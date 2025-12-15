import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Department {
  id: string;
  name: string;
}

const initialDepartments: Department[] = [
  { id: 'DEP-01', name: 'Cardiology' },
  { id: 'DEP-02', name: 'Neurology' },
  { id: 'DEP-03', name: 'Pediatrics' },
  { id: 'DEP-04', name: 'General Practice' }
]

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([...initialDepartments])
  function addDepartment(newDep: Department) {
    departments.value.push(newDep)
  }
  function deleteDepartment(depId: string, relatedPatientCheck?: (id:string) => boolean) {
    // İlgili hasta kontrolü
    if (relatedPatientCheck && relatedPatientCheck(depId)) {
      throw new Error('Bu departmana bağlı hasta var, silinemez!')
    }
    departments.value = departments.value.filter(d => d.id !== depId)
  }
  function getDepartmentById(depId: string) {
    return departments.value.find(d => d.id === depId) || null
  }
  return {
    departments,
    addDepartment,
    deleteDepartment,
    getDepartmentById
  }
})

