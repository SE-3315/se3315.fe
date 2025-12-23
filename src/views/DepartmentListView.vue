<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import { usePatientStore } from '@/stores/patient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const departmentStore = useDepartmentStore()
const patientStore = usePatientStore()

const newDeptName = ref('')
const newDeptDescription = ref('')
const error = ref('')
const success = ref('')
const confirmDeleteId = ref<string|null>(null)

// Sayfa yüklendiğinde verileri çek
onMounted(async () => {
  try {
    await Promise.all([
      departmentStore.fetchDepartments(),
      patientStore.fetchPatients()
    ])
  } catch (err: any) {
    error.value = 'Error loading data: ' + (err.message || 'Unknown error')
  }
})

async function addDepartment() {
  error.value = ''
  success.value = ''
  
  if(!newDeptName.value.trim()) {
    error.value = 'Department name is required.'
    return
  }
  
  try {
    await departmentStore.addDepartment({
      name: newDeptName.value,
      description: newDeptDescription.value || undefined,
      isActive: true
    })
    
    // Verileri yeniden yükle
    await departmentStore.fetchDepartments()
    
    newDeptName.value = ''
    newDeptDescription.value = ''
    success.value = 'Department added successfully.'
    
    // Remove success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Error creating department.'
  }
}

function hasRelatedPatients(deptId: string): boolean {
  return patientStore.patients.some(p => p.departmentId === deptId)
}

function askDelete(id: string) { 
  confirmDeleteId.value = id 
}

async function deleteDepartment() {
  error.value = ''
  success.value = ''
  
  try {
    if (hasRelatedPatients(confirmDeleteId.value!)) {
      error.value = 'Cannot delete department with related patients!'
      confirmDeleteId.value = null
      return
    }
    
    await departmentStore.deleteDepartment(confirmDeleteId.value!)
    
    // Reload data
    await departmentStore.fetchDepartments()
    
    success.value = 'Department deleted successfully.'
    confirmDeleteId.value = null
    
    // Remove success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Error deleting department.'
    confirmDeleteId.value = null
  }
}
</script>
<template>
  <div class="min-h-screen py-10 bg-gray-50">
    <div class="mx-auto max-w-4xl">
      <Card class="mb-6">
        <CardHeader><CardTitle>Department Management</CardTitle></CardHeader>
        <CardContent>
          <div class="space-y-3 mb-4">
            <div class="flex gap-2">
              <input v-model="newDeptName" placeholder="Department Name" class="border rounded px-2 py-1 focus:border-blue-400 flex-1" />
              <Button @click="addDepartment" :disabled="departmentStore.isLoading">
                {{ departmentStore.isLoading ? 'Adding...' : 'Add' }}
              </Button>
            </div>
            <input v-model="newDeptDescription" placeholder="Description (optional)" class="border rounded px-2 py-1 focus:border-blue-400 w-full" />
          </div>
          <div v-if="error" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{{ error }}</div>
          <div v-if="success" class="mb-4 text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">{{ success }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Departments</CardTitle></CardHeader>
        <CardContent>
          <table class="w-full mt-2 text-sm border">
            <thead>
              <tr class="bg-gray-200">
                <th>Name</th><th>Description</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in departmentStore.departments" :key="d.id">
                <td>{{ d.name }}</td>
                <td>{{ d.description || '-' }}</td>
                <td>
                  <span :class="d.isActive ? 'text-green-600' : 'text-red-600'">
                    {{ d.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <Button variant="ghost" color="danger" @click="askDelete(d.id)" :disabled="departmentStore.isLoading">Delete</Button>
                </td>
              </tr>
              <tr v-if="departmentStore.departments.length === 0">
                <td colspan="4" class="text-center py-4 text-gray-500">No departments added yet</td>
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
            <Button class="bg-red-600 text-white" @click="deleteDepartment">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
