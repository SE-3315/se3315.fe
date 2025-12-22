import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { patientApi, type Patient, type PatientCreateRequest } from '@/services/api'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref<Patient[]>([])
  const isLoading = ref(false)
  const error = ref<string>('')

  // Backend'den tüm hastaları yükle
  async function fetchPatients() {
    isLoading.value = true
    error.value = ''
    try {
      patients.value = await patientApi.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch patients.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Yeni hasta ekle
  async function addPatient(newPatient: PatientCreateRequest) {
    isLoading.value = true
    error.value = ''
    try {
      const created = await patientApi.create(newPatient)
      patients.value.push(created)
      return created
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create patient.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Hasta güncelle
  async function updatePatient(id: string, updates: Partial<PatientCreateRequest>) {
    isLoading.value = true
    error.value = ''
    try {
      const updated = await patientApi.update(id, updates)
      const idx = patients.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        patients.value[idx] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update patient.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Hasta sil
  async function deletePatient(id: string) {
    isLoading.value = true
    error.value = ''
    try {
      await patientApi.delete(id)
      patients.value = patients.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete patient.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ID'ye göre hasta getir
  function getPatientById(id: string) {
    return patients.value.find(p => p.id === id) || null
  }

  // National ID kontrolü (benzersizlik için)
  function patientExists(nationalId: string) {
    return patients.value.some(p => p.nationalId === nationalId)
  }

  return {
    patients,
    isLoading,
    error,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    patientExists
  }
})

