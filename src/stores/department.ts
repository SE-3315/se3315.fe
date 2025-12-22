import { ref } from 'vue'
import { defineStore } from 'pinia'
import { departmentApi, type Department, type DepartmentCreateRequest } from '@/services/api'
import { usePatientStore } from './patient'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string>('')

  // Backend'den tüm departmanları yükle
  async function fetchDepartments() {
    isLoading.value = true
    error.value = ''
    try {
      departments.value = await departmentApi.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch departments.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Yeni departman ekle
  async function addDepartment(newDep: DepartmentCreateRequest) {
    isLoading.value = true
    error.value = ''
    try {
      const created = await departmentApi.create(newDep)
      departments.value.push(created)
      return created
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create department.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Departman sil
  async function deleteDepartment(depId: string) {
    isLoading.value = true
    error.value = ''
    try {
      // İlgili hasta kontrolü
      const patientStore = usePatientStore()
      const hasRelatedPatients = patientStore.patients.some(p => p.departmentId === depId)
      if (hasRelatedPatients) {
        throw new Error('Bu departmana bağlı hasta var, silinemez!')
      }
      
      await departmentApi.delete(depId)
      departments.value = departments.value.filter(d => d.id !== depId)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete department.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ID'ye göre departman getir
  function getDepartmentById(depId: string) {
    return departments.value.find(d => d.id === depId) || null
  }

  return {
    departments,
    isLoading,
    error,
    fetchDepartments,
    addDepartment,
    deleteDepartment,
    getDepartmentById
  }
})

