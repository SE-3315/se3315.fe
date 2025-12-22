<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDoctorStore } from '@/stores/doctor'
import { usePatientStore } from '@/stores/patient'
import { useDepartmentStore } from '@/stores/department'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const doctorStore = useDoctorStore()
const patientStore = usePatientStore()
const departmentStore = useDepartmentStore()

const newSpecialization = ref('')
const newDepartmentId = ref('')
const newLicenseNumber = ref('')
const newPhone = ref('')
const newEmail = ref('')
const error = ref('')
const success = ref('')
const confirmDeleteId = ref<string | null>(null)

// Sayfa yüklendiğinde verileri çek
onMounted(async () => {
  try {
    await Promise.all([
      doctorStore.fetchDoctors(),
      patientStore.fetchPatients(),
      departmentStore.fetchDepartments()
    ])
  } catch (err: any) {
    error.value = 'Veriler yüklenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata')
  }
})

async function addDoctor() {
  error.value = ''
  success.value = ''
  
  if(!newSpecialization.value.trim()) {
    error.value = 'Uzmanlık alanı gereklidir.'
    return
  }
  if(!newDepartmentId.value) {
    error.value = 'Departman seçilmelidir.'
    return
  }
  if(!newLicenseNumber.value.trim()) {
    error.value = 'Lisans numarası gereklidir.'
    return
  }
  
  try {
    // Not: Backend'de doctor oluştururken userId gerekli
    // Şimdilik ilk doctor user'ı kullan veya backend'den al
    // Bu kısım backend API'ye göre düzenlenmeli
    error.value = 'Doctor eklemek için backend API\'de userId gereklidir. Lütfen backend\'den doctor user ID\'sini alın.'
    return
    
    // TODO: Backend'den doctor user listesi çek veya userId'yi başka şekilde al
    // await doctorStore.addDoctor({
    //   userId: 'user-id-here',
    //   departmentId: newDepartmentId.value,
    //   licenseNumber: newLicenseNumber.value,
    //   specialization: newSpecialization.value,
    //   phone: newPhone.value || undefined,
    //   email: newEmail.value || undefined,
    //   isActive: true
    // })
    
    // Verileri yeniden yükle
    await doctorStore.fetchDoctors()
    
    newSpecialization.value = ''
    newDepartmentId.value = ''
    newLicenseNumber.value = ''
    newPhone.value = ''
    newEmail.value = ''
    success.value = 'Doktor başarıyla eklendi.'
    
    // Success mesajını 3 saniye sonra kaldır
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Doktor eklenirken hata oluştu.'
  }
}

function hasRelatedPatients(doctorId: string): boolean {
  return patientStore.patients.some(p => p.doctorId === doctorId)
}

function askDelete(id: string) { 
  confirmDeleteId.value = id 
}

async function deleteDoctor() {
  error.value = ''
  success.value = ''
  
  try {
    if (hasRelatedPatients(confirmDeleteId.value!)) {
      error.value = 'Bu doktora bağlı hasta var, silinemez!'
      confirmDeleteId.value = null
      return
    }
    
    await doctorStore.deleteDoctor(confirmDeleteId.value!)
    
    // Verileri yeniden yükle
    await doctorStore.fetchDoctors()
    
    success.value = 'Doktor başarıyla silindi.'
    confirmDeleteId.value = null
    
    // Success mesajını 3 saniye sonra kaldır
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Doktor silinirken hata oluştu.'
    confirmDeleteId.value = null
  }
}
</script>
<template>
  <div class="min-h-screen py-10 bg-gray-50">
    <div class="mx-auto max-w-4xl">
      <Card class="mb-6">
        <CardHeader><CardTitle>Doctor Management</CardTitle></CardHeader>
        <CardContent>
          <div class="space-y-3 mb-4">
            <div class="flex gap-2">
              <input v-model="newSpecialization" placeholder="Uzmanlık Alanı" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <input v-model="newLicenseNumber" placeholder="Lisans No" class="border rounded px-2 py-1 focus:border-blue-400" />
            </div>
            <div class="flex gap-2">
              <select v-model="newDepartmentId" class="border rounded px-2 py-1 focus:border-blue-400 flex-1">
                <option value="">Departman Seçin</option>
                <option v-for="dept in departmentStore.departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <input v-model="newPhone" placeholder="Telefon" class="border rounded px-2 py-1 focus:border-blue-400" />
            </div>
            <div class="flex gap-2">
              <input v-model="newEmail" placeholder="Email (opsiyonel)" type="email" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <Button @click="addDoctor" :disabled="doctorStore.isLoading">
                {{ doctorStore.isLoading ? 'Ekleniyor...' : 'Ekle' }}
              </Button>
            </div>
          </div>
          <div v-if="error" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{{ error }}</div>
          <div v-if="success" class="mb-4 text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">{{ success }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Doctors</CardTitle></CardHeader>
        <CardContent>
          <table class="w-full mt-2 text-sm border">
            <thead>
              <tr class="bg-gray-200">
                <th>Uzmanlık</th><th>Departman</th><th>Lisans No</th><th>Telefon</th><th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in doctorStore.doctors" :key="d.id">
                <td>{{ d.specialization || '-' }}</td>
                <td>{{ departmentStore.departments.find(dept => dept.id === d.departmentId)?.name || '-' }}</td>
                <td>{{ d.licenseNumber || '-' }}</td>
                <td>{{ d.phone || '-' }}</td>
                <td>
                  <Button variant="ghost" color="danger" @click="askDelete(d.id)" :disabled="doctorStore.isLoading">Sil</Button>
                </td>
              </tr>
              <tr v-if="doctorStore.doctors.length === 0">
                <td colspan="5" class="text-center py-4 text-gray-500">Henüz doktor eklenmemiş</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div v-if="confirmDeleteId" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
          <Alert variant="destructive"><AlertTitle>Confirm delete?</AlertTitle><AlertDescription>This action cannot be undone.</AlertDescription></Alert>
          <div class="flex gap-2 py-6 justify-end">
            <Button variant="ghost" @click="confirmDeleteId=null">Cancel</Button>
            <Button class="bg-red-600 text-white" @click="deleteDoctor">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

