import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doctorApi, type Doctor, type DoctorCreateRequest } from '@/services/api'
import { usePatientStore } from './patient'

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref<Doctor[]>([])
  const isLoading = ref(false)
  const error = ref<string>('')

  // Backend'den tüm doktorları yükle
  async function fetchDoctors() {
    isLoading.value = true
    error.value = ''
    try {
      doctors.value = await doctorApi.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch doctors.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Yeni doktor ekle
  async function addDoctor(newDoctor: DoctorCreateRequest) {
    isLoading.value = true
    error.value = ''
    try {
      const created = await doctorApi.create(newDoctor)
      doctors.value.push(created)
      return created
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create doctor.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Doktor sil
  async function deleteDoctor(doctorId: string) {
    isLoading.value = true
    error.value = ''
    try {
      // İlgili hasta kontrolü
      const patientStore = usePatientStore()
      const hasRelatedPatients = patientStore.patients.some(p => p.doctorId === doctorId)
      if (hasRelatedPatients) {
        throw new Error('Bu doktora bağlı hasta var, silinemez!')
      }
      
      await doctorApi.delete(doctorId)
      doctors.value = doctors.value.filter(d => d.id !== doctorId)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete doctor.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ID'ye göre doktor getir
  function getDoctorById(doctorId: string) {
    return doctors.value.find(d => d.id === doctorId) || null
  }

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    addDoctor,
    deleteDoctor,
    getDoctorById
  }
})

