<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useDoctorStore } from '@/stores/doctor'
import { useDepartmentStore } from '@/stores/department'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const patientStore = usePatientStore()
const doctorStore = useDoctorStore()
const departmentStore = useDepartmentStore()

const filterPatientId = ref('')
const filterName = ref('')
const filterDoctor = ref('')
const filterDepartment = ref('')
const error = ref('')
const success = ref('')

const filteredPatients = computed(() => {
  return patientStore.patients.filter(p => {
    const matchId = !filterPatientId.value || p.patientId.includes(filterPatientId.value)
    const matchName = !filterName.value || p.fullName.toLowerCase().includes(filterName.value.toLowerCase())
    const matchDoc = !filterDoctor.value || p.doctor === filterDoctor.value
    const matchDept = !filterDepartment.value || p.department === filterDepartment.value
    return matchId && matchName && matchDoc && matchDept
  })
})

const selectedPatientId = ref<string|null>(null)
const confirmDelete = ref(false)

function askDelete(patientId: string) {
  selectedPatientId.value = patientId
  confirmDelete.value = true
}
function deletePatient() {
  if (selectedPatientId.value) {
    patientStore.deletePatient(selectedPatientId.value)
    success.value = 'Patient deleted successfully.'
    confirmDelete.value = false
    selectedPatientId.value = null
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="mx-auto max-w-6xl">
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>Patient List &amp; Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="error" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{{ error }}</div>
          <div v-if="success" class="mb-4 text-green-700 bg-green-50 border-green-200 rounded border px-4 py-2">{{ success }}</div>

          <div class="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            <input v-model="filterPatientId" placeholder="Search by Patient ID" class="border rounded px-2 py-1 focus:border-blue-400" />
            <input v-model="filterName" placeholder="Search by Name" class="border rounded px-2 py-1 focus:border-blue-400" />
            <select v-model="filterDoctor" class="border rounded px-2 py-1 focus:border-blue-400">
              <option value="">All Doctors</option>
              <option v-for="doc in doctorStore.doctors" :key="doc.id" :value="doc.name">{{ doc.name }}</option>
            </select>
            <select v-model="filterDepartment" class="border rounded px-2 py-1 focus:border-blue-400">
              <option value="">All Departments</option>
              <option v-for="dept in departmentStore.departments" :key="dept.id" :value="dept.name">{{ dept.name }}</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <div v-if="confirmDelete" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
          <Alert variant="destructive"><AlertTitle>Confirm delete?</AlertTitle><AlertDescription>This action cannot be undone.</AlertDescription></Alert>
          <div class="flex gap-2 py-6 justify-end">
            <Button variant="ghost" @click="confirmDelete=false">Cancel</Button>
            <Button class="bg-red-600 text-white" @click="deletePatient">Delete</Button>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="filteredPatients.length === 0" class="text-gray-600 py-4">No patients found.</div>
          <table v-if="filteredPatients.length > 0" class="w-full mt-2 text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th>ID</th>
                <th>Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredPatients" :key="p.patientId">
                <td>{{p.patientId}}</td>
                <td>{{p.fullName}}</td>
                <td>{{p.doctor}}</td>
                <td>{{p.department}}</td>
                <td>
                  <Button variant="ghost" color="danger" @click="askDelete(p.patientId)">Delete</Button>
                  <!-- Buraya güncelleme/detay butonları eklenebilir -->
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="success" class="text-green-700 py-2">{{ success }}</div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

