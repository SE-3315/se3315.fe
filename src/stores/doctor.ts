import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Doctor {
  id: string;
  name: string;
  department: string;
}

const initialDoctors: Doctor[] = [
  { id: 'DR-001', name: 'Dr. Sarah Smith', department: 'Neurology' },
  { id: 'DR-002', name: 'Dr. Michael Chen', department: 'Cardiology' },
  { id: 'DR-003', name: 'Dr. Emily Johnson', department: 'Pediatrics' },
  { id: 'DR-004', name: 'Dr. James Wilson', department: 'Cardiology' }
]

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref<Doctor[]>([...initialDoctors]);
  function addDoctor(newDoctor: Doctor) {
    doctors.value.push(newDoctor)
  }
  function deleteDoctor(doctorId: string, relatedPatientCheck?: (id: string) => boolean) {
    // İlgili hasta kontrolü
    if (relatedPatientCheck && relatedPatientCheck(doctorId)) {
      throw new Error('Bu doktora bağlı hasta var, silinemez!')
    }
    doctors.value = doctors.value.filter(d => d.id !== doctorId)
  }
  function getDoctorById(doctorId: string) {
    return doctors.value.find(d => d.id === doctorId) || null
  }
  return {
    doctors,
    addDoctor,
    deleteDoctor,
    getDoctorById
  }
})

