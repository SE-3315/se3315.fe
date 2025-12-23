import axios, { type AxiosInstance, type AxiosResponse } from 'axios'


// API Base URL - environment variable'dan al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Axios instance oluştur
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - hata yönetimi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH API ====================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: 'DOCTOR' | 'ADMIN' | 'PATIENT'
  firstName?: string
  lastName?: string
  phone?: string
}

export interface RegisterResponse {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
}

export interface UserInfo {
  email: string
  role: string
  firstName?: string
  lastName?: string
  name?: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
    }
    return response.data
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data)
    return response.data
  },

  // Backend'den user bilgisini çek (role dahil)
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },
}

// ==================== PATIENT API ====================

export interface Patient {
  id: string
  firstName: string
  lastName: string
  nationalId: string
  gender: string
  phone: string
  doctorId: string
  departmentId: string
}

export interface PatientCreateRequest {
  firstName: string
  lastName: string
  nationalId: string
  birthDate?: string // "YYYY-MM-DD" format
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  phone?: string
  email?: string
  address?: string
  bloodType?: string
  allergies?: string
  chronicConditions?: string
  insuranceProvider?: string
  insuranceNumber?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  primaryDoctorId?: string
  departmentId?: string
}

export interface PatientUpdateRequest extends Partial<PatientCreateRequest> {}

export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients')
    return response.data
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`)
    return response.data
  },

  create: async (patient: PatientCreateRequest): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/patients', patient)
    return response.data
  },

  update: async (id: string, updates: PatientUpdateRequest): Promise<Patient> => {
    const response = await apiClient.put<Patient>(`/patients/${id}`, updates)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`)
  },
}

// ==================== DOCTOR API ====================

export interface Doctor {
  id: string
  userId: string
  departmentId: string
  licenseNumber: string
  specialization: string
  isActive: boolean
}

export interface DoctorCreateRequest {
  userId: string
  departmentId: string
  licenseNumber: string
  specialization?: string
  phone?: string
  email?: string
  roomNumber?: string
  workingHours?: string
  biography?: string
  isActive?: boolean
}

export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/doctors')
    return response.data
  },

  create: async (doctor: DoctorCreateRequest): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>('/doctors', doctor)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/doctors/${id}`)
  },
}

// ==================== DEPARTMENT API ====================

export interface Department {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface DepartmentCreateRequest {
  name: string
  description?: string
  isActive?: boolean
}

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>('/departments')
    return response.data
  },

  create: async (department: DepartmentCreateRequest): Promise<Department> => {
    const response = await apiClient.post<Department>('/departments', department)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`)
  },
}

// ==================== APPOINTMENT API ====================

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  departmentId: string
  appointmentDate: string // ISO 8601 format
  status: string
  reason: string
}

export interface AppointmentCreateOrUpdateRequest {
  patientId: string
  doctorId: string
  departmentId: string
  appointmentDate: string // ISO 8601 format (e.g., "2025-12-25T10:00:00Z")
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING'
  reason?: string
}

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments')
    return response.data
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`)
    return response.data
  },

  create: async (appointment: AppointmentCreateOrUpdateRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments', appointment)
    return response.data
  },

  update: async (id: string, appointment: AppointmentCreateOrUpdateRequest): Promise<Appointment> => {
    const response = await apiClient.put<Appointment>(`/appointments/${id}`, appointment)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`)
  },
}

// ==================== MEDICAL RECORD API ====================

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  recordType: string
  description: string
  attachments: string
}

export interface MedicalRecordCreateOrUpdateRequest {
  patientId: string
  doctorId: string
  recordType: string
  description?: string
  attachments?: string
}

export const medicalRecordApi = {
  getAll: async (): Promise<MedicalRecord[]> => {
    const response = await apiClient.get<MedicalRecord[]>('/records')
    return response.data
  },

  getById: async (id: string): Promise<MedicalRecord> => {
    const response = await apiClient.get<MedicalRecord>(`/records/${id}`)
    return response.data
  },

  create: async (record: MedicalRecordCreateOrUpdateRequest): Promise<MedicalRecord> => {
    const response = await apiClient.post<MedicalRecord>('/records', record)
    return response.data
  },

  update: async (id: string, record: MedicalRecordCreateOrUpdateRequest): Promise<MedicalRecord> => {
    const response = await apiClient.put<MedicalRecord>(`/records/${id}`, record)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/records/${id}`)
  },
}

// ==================== PRESCRIPTION API ====================

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  issuedAt: string // ISO 8601 format
}

export interface PrescriptionCreateOrUpdateRequest {
  patientId: string
  doctorId: string
  medicationName: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
  issuedAt?: string
}

export const prescriptionApi = {
  getAll: async (): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>('/prescriptions')
    return response.data
  },

  getById: async (id: string): Promise<Prescription> => {
    const response = await apiClient.get<Prescription>(`/prescriptions/${id}`)
    return response.data
  },

  create: async (prescription: PrescriptionCreateOrUpdateRequest): Promise<Prescription> => {
    const response = await apiClient.post<Prescription>('/prescriptions', prescription)
    return response.data
  },

  update: async (id: string, prescription: PrescriptionCreateOrUpdateRequest): Promise<Prescription> => {
    const response = await apiClient.put<Prescription>(`/prescriptions/${id}`, prescription)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/prescriptions/${id}`)
  },
}

// Export default olarak apiClient'ı da export et
export default apiClient
