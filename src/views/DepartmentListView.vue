<script setup lang="ts">
import { ref } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import { usePatientStore } from '@/stores/patient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const departmentStore = useDepartmentStore()
const patientStore = usePatientStore()

const newDeptName = ref('')
const error = ref('')
const success = ref('')
const confirmDeleteId = ref<string|null>(null)

function addDepartment() {
  error.value = ''
  if(!newDeptName.value.trim()) {
    error.value = 'Department name is required.'; return
  }
  const newId = 'DEP-' + (100 + departmentStore.departments.length + 1)
  departmentStore.addDepartment({ id: newId, name: newDeptName.value })
  newDeptName.value = ''
  success.value = 'Department added.'
}

function hasRelatedPatients(deptName: string): boolean {
  return patientStore.patients.some(p => p.department === deptName)
}
function askDelete(id: string) { confirmDeleteId.value = id }
function deleteDepartment() {
  const dept = departmentStore.getDepartmentById(confirmDeleteId.value!)
  if(dept && hasRelatedPatients(dept.name)) {
    error.value = 'Cannot delete: this department is assigned to at least one patient.'
  } else {
    departmentStore.deleteDepartment(confirmDeleteId.value!)
    success.value = 'Department deleted.'
  }
  confirmDeleteId.value = null
}
</script>
<template>
  <div class="min-h-screen py-10 bg-gray-50">
    <div class="mx-auto max-w-4xl">
      <Card class="mb-6">
        <CardHeader><CardTitle>Department Management</CardTitle></CardHeader>
        <CardContent>
          <div class="flex gap-2 mb-4">
            <input v-model="newDeptName" placeholder="Department Name" class="border rounded px-2 py-1 focus:border-blue-400" />
            <Button @click="addDepartment">Add</Button>
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
                <th>ID</th><th>Name</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in departmentStore.departments" :key="d.id">
                <td>{{ d.id }}</td>
                <td>{{ d.name }}</td>
                <td>
                  <Button variant="ghost" color="danger" @click="askDelete(d.id)">Delete</Button>
                </td>
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
