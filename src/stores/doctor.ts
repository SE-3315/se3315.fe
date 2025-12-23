import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doctorApi, authApi, type Doctor, type DoctorCreateRequest, type RegisterRequest } from '@/services/api'
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

  // Yeni doktor ekle - önce user oluştur, sonra doctor oluştur
  async function addDoctor(
    doctorData: DoctorCreateRequest,
    userData: {
      email: string
      password: string
      firstName?: string
      lastName?: string
      phone?: string
    }
  ) {
    isLoading.value = true
    error.value = ''
    let createdUserId: string | null = null

    try {
      // 1. Önce user oluştur (role: DOCTOR)
      const registerRequest: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        role: 'DOCTOR',
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      }

      const registerResponse = await authApi.register(registerRequest)
      createdUserId = registerResponse.id

      if (!createdUserId) {
        throw new Error('User created but user ID could not be retrieved.')
      }

      // 2. User ID ile doctor oluştur
      const doctorRequest: DoctorCreateRequest = {
        ...doctorData,
        userId: createdUserId,
      }

      const created = await doctorApi.create(doctorRequest)
      doctors.value.push(created)
      return created
    } catch (err: any) {
      // Error handling
      if (err.response?.status === 400 || err.response?.status === 409) {
        // Validation error or duplicate email
        error.value = err.response?.data?.message || 'Failed to create user. Email may already be in use.'
      } else if (err.response?.status === 500) {
        error.value = 'Server error occurred. Please try again.'
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = err.response?.data?.message || 'Error creating doctor.'
      }
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
      // Check for related patients
      const patientStore = usePatientStore()
      const hasRelatedPatients = patientStore.patients.some(p => p.doctorId === doctorId)
      if (hasRelatedPatients) {
        throw new Error('Cannot delete doctor with related patients!')
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

