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
const newFirstName = ref('')
const newLastName = ref('')
const newPassword = ref('')
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
    error.value = 'Error loading data: ' + (err.message || 'Unknown error')
  }
})

async function addDoctor() {
  error.value = ''
  success.value = ''
  
  // Validations
  if(!newSpecialization.value.trim()) {
    error.value = 'Specialization is required.'
    return
  }
  if(!newDepartmentId.value) {
    error.value = 'Department must be selected.'
    return
  }
  if(!newLicenseNumber.value.trim()) {
    error.value = 'License number is required.'
    return
  }
  if(!newEmail.value.trim()) {
    error.value = 'Email is required.'
    return
  }
  if(!newPassword.value.trim()) {
    error.value = 'Password is required.'
    return
  }
  if(newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if(!newFirstName.value.trim()) {
    error.value = 'First name is required.'
    return
  }
  if(!newLastName.value.trim()) {
    error.value = 'Last name is required.'
    return
  }
  
  try {
    // Önce user oluştur, sonra doctor oluştur
    await doctorStore.addDoctor(
      {
        departmentId: newDepartmentId.value,
        licenseNumber: newLicenseNumber.value,
        specialization: newSpecialization.value,
        phone: newPhone.value || undefined,
        email: newEmail.value || undefined,
        isActive: true
      },
      {
        email: newEmail.value,
        password: newPassword.value,
        firstName: newFirstName.value,
        lastName: newLastName.value,
        phone: newPhone.value || undefined
      }
    )
    
    // Verileri yeniden yükle
    await doctorStore.fetchDoctors()
    
    // Formu temizle
    newSpecialization.value = ''
    newDepartmentId.value = ''
    newLicenseNumber.value = ''
    newPhone.value = ''
    newEmail.value = ''
    newFirstName.value = ''
    newLastName.value = ''
    newPassword.value = ''
    
    success.value = 'Doctor added successfully.'
    
    // Remove success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    // Error handling is done in store, just display here
    error.value = doctorStore.error || err.message || 'Error creating doctor.'
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
      error.value = 'Cannot delete doctor with related patients!'
      confirmDeleteId.value = null
      return
    }
    
    await doctorStore.deleteDoctor(confirmDeleteId.value!)
    
    // Reload data
    await doctorStore.fetchDoctors()
    
    success.value = 'Doctor deleted successfully.'
    confirmDeleteId.value = null
    
    // Remove success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Error deleting doctor.'
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
            <div class="text-sm font-medium text-gray-700 mb-2">User Information</div>
            <div class="flex gap-2">
              <input v-model="newFirstName" placeholder="First Name *" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <input v-model="newLastName" placeholder="Last Name *" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
            </div>
            <div class="flex gap-2">
              <input v-model="newEmail" placeholder="Email *" type="email" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <input v-model="newPassword" placeholder="Password *" type="password" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
            </div>
            <div class="text-sm font-medium text-gray-700 mb-2 mt-4">Doctor Information</div>
            <div class="flex gap-2">
              <input v-model="newSpecialization" placeholder="Specialization *" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <input v-model="newLicenseNumber" placeholder="License Number *" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
            </div>
            <div class="flex gap-2">
              <select v-model="newDepartmentId" class="border rounded px-2 py-1 focus:border-blue-400 flex-1">
                <option value="">Select Department *</option>
                <option v-for="dept in departmentStore.departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <input v-model="newPhone" placeholder="Phone" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
            </div>
            <div class="flex justify-end">
              <Button @click="addDoctor" :disabled="doctorStore.isLoading">
                {{ doctorStore.isLoading ? 'Adding...' : 'Add Doctor' }}
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
                <th>Specialization</th><th>Department</th><th>License No</th><th>Phone</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in doctorStore.doctors" :key="d.id">
                <td>{{ d.specialization || '-' }}</td>
                <td>{{ departmentStore.departments.find(dept => dept.id === d.departmentId)?.name || '-' }}</td>
                <td>{{ d.licenseNumber || '-' }}</td>
                <td>{{ d.phone || '-' }}</td>
                <td>
                  <Button variant="ghost" color="danger" @click="askDelete(d.id)" :disabled="doctorStore.isLoading">Delete</Button>
                </td>
              </tr>
              <tr v-if="doctorStore.doctors.length === 0">
                <td colspan="5" class="text-center py-4 text-gray-500">No doctors added yet</td>
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

