import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Patient {
  patientId: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  diagnosis: string;
  visitInfo: string;
  doctor: string;
  department: string;
  date?: string; // ISO string
  tags?: string[];
}

const initialPatients: Patient[] = [
  {
    patientId: 'PT-1001',
    fullName: 'Elif Yılmaz',
    gender: 'female',
    contactNumber: '+90 500 123 45 67',
    diagnosis: 'Migraine',
    visitInfo: 'Annual check',
    doctor: 'Dr. Sarah Smith',
    department: 'Neurology',
    date: '2025-12-01',
    tags: ['VIP']
  },
  {
    patientId: 'PT-1002',
    fullName: 'Can Demir',
    gender: 'male',
    contactNumber: '+90 507 765 43 21',
    diagnosis: 'Hypertension',
    visitInfo: 'Follow-up',
    doctor: 'Dr. James Wilson',
    department: 'Cardiology',
    date: '2025-12-10',
    tags: ['Chronic Condition']
  }
]

export const usePatientStore = defineStore('patient', () => {
  const patients = ref<Patient[]>([...initialPatients])

  function addPatient(newPatient: Patient) {
    patients.value.push(newPatient)
  }
  function updatePatient(patientId: string, updates: Partial<Patient>) {
    const idx = patients.value.findIndex(p => p.patientId === patientId)
    if (idx !== -1) {
      // Patient ID hiçbir koşulda güncellenemez!
      const { patientId: _omitId, ...restUpdates } = updates;
      patients.value[idx] = { ...patients.value[idx], ...restUpdates }
    }
  }
  function deletePatient(patientId: string) {
    patients.value = patients.value.filter(p => p.patientId !== patientId)
  }
  function getPatientById(patientId: string) {
    return patients.value.find(p => p.patientId === patientId) || null
  }
  function patientExists(patientId: string) {
    return patients.value.some(p => p.patientId === patientId)
  }
  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    patientExists
  }
})

