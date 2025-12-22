<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useDoctorStore } from '@/stores/doctor'
import { useDepartmentStore } from '@/stores/department'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, ArrowLeft, Save, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { toDate } from 'reka-ui/date'
import { getLocalTimeZone } from '@internationalized/date'

const router = useRouter()
const patientStore = usePatientStore()
const doctorStore = useDoctorStore()
const departmentStore = useDepartmentStore()

const success = ref<string | null>(null)
const error = ref<string | null>(null)

// Form State
const formData = ref({
  firstName: '',
  lastName: '',
  nationalId: '',
  birthDate: '',
  gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
  phone: '',
  email: '',
  address: '',
  bloodType: '',
  allergies: '',
  chronicConditions: '',
  insuranceProvider: '',
  insuranceNumber: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  primaryDoctorId: '',
  departmentId: '',
})

// Sayfa yüklendiğinde doktor ve departmanları çek
onMounted(async () => {
  try {
    await Promise.all([
      doctorStore.fetchDoctors(),
      departmentStore.fetchDepartments()
    ])
  } catch (err) {
    error.value = 'Failed to load doctors and departments.'
  }
})

const goBack = () => {
  router.back()
}

// Validasyon ve ekleme akışı
const handleSubmit = async () => {
  error.value = null
  success.value = null
  
  // Validasyonlar
  if (!formData.value.firstName.trim()) {
    error.value = 'First name is required.'
    return
  }
  if (!formData.value.lastName.trim()) {
    error.value = 'Last name is required.'
    return
  }
  if (!formData.value.nationalId.trim()) {
    error.value = 'National ID is required.'
    return
  }
  if (!formData.value.primaryDoctorId) {
    error.value = 'Doctor selection is required.'
    return
  }
  if (!formData.value.departmentId) {
    error.value = 'Department selection is required.'
    return
  }
  
  // Benzersiz National ID kontrolü
  if (patientStore.patientExists(formData.value.nationalId)) {
    error.value = 'A patient with this National ID already exists.'
    return
  }
  
  try {
    // Kayıt ekle
    await patientStore.addPatient({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      nationalId: formData.value.nationalId,
      birthDate: formData.value.birthDate || undefined,
      gender: formData.value.gender || undefined,
      phone: formData.value.phone || undefined,
      email: formData.value.email || undefined,
      address: formData.value.address || undefined,
      bloodType: formData.value.bloodType || undefined,
      allergies: formData.value.allergies || undefined,
      chronicConditions: formData.value.chronicConditions || undefined,
      insuranceProvider: formData.value.insuranceProvider || undefined,
      insuranceNumber: formData.value.insuranceNumber || undefined,
      emergencyContactName: formData.value.emergencyContactName || undefined,
      emergencyContactPhone: formData.value.emergencyContactPhone || undefined,
      primaryDoctorId: formData.value.primaryDoctorId,
      departmentId: formData.value.departmentId,
    })
    
    success.value = 'Patient registered successfully!'
    
    // Formu sıfırla
    formData.value = {
      firstName: '', lastName: '', nationalId: '', birthDate: '', gender: '', phone: '', email: '', address: '',
      bloodType: '', allergies: '', chronicConditions: '', insuranceProvider: '', insuranceNumber: '',
      emergencyContactName: '', emergencyContactPhone: '', primaryDoctorId: '', departmentId: ''
    }
    
    // Başarılı olursa geri dön
    setTimeout(() => {
      router.push('/patients')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Failed to create patient.'
  }
}</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-12 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-gray-800">
      <div class="mx-auto flex max-w-4xl items-center px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" class="mr-4" @click="goBack">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Create Patient Record</h1>
      </div>
    </header>

    <main class="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>
            Enter the patient's details to create a new medical record.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-8">
          <div v-if="error" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{{ error }}</div>
          <div v-if="success" class="mb-4 text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">{{ success }}</div>
          <!-- Section 1: Patient Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Information</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="firstName">First Name <span class="text-red-500">*</span></Label>
                <Input id="firstName" placeholder="John" v-model="formData.firstName" />
              </div>
              <div class="space-y-2">
                <Label for="lastName">Last Name <span class="text-red-500">*</span></Label>
                <Input id="lastName" placeholder="Doe" v-model="formData.lastName" />
              </div>
              <div class="space-y-2">
                <Label for="nationalId">National ID <span class="text-red-500">*</span></Label>
                <Input id="nationalId" placeholder="12345678901" v-model="formData.nationalId" />
              </div>
              <div class="space-y-2">
                <Label for="birthDate">Birth Date</Label>
                <Input id="birthDate" type="date" v-model="formData.birthDate" />
              </div>
              <div class="space-y-2">
                <Label>Gender</Label>
                <Select v-model="formData.gender" class="w-full">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="phone">Phone</Label>
                <Input id="phone" placeholder="05551234567" v-model="formData.phone" />
              </div>
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="patient@example.com" v-model="formData.email" />
              </div>
              <div class="space-y-2">
                <Label for="address">Address</Label>
                <Input id="address" placeholder="Address" v-model="formData.address" />
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 2: Medical Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Medical Information</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="bloodType">Blood Type</Label>
                <Input id="bloodType" placeholder="A+" v-model="formData.bloodType" />
              </div>
              <div class="space-y-2">
                <Label for="allergies">Allergies</Label>
                <Input id="allergies" placeholder="Penisilin" v-model="formData.allergies" />
              </div>
              <div class="space-y-2 sm:col-span-2">
                <Label for="chronicConditions">Chronic Conditions</Label>
                <Input id="chronicConditions" placeholder="Diyabet" v-model="formData.chronicConditions" />
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 3: Assignment -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Assignment</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Primary Doctor <span class="text-red-500">*</span></Label>
                <Select v-model="formData.primaryDoctorId">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="doc in doctorStore.doctors" :key="doc.id" :value="doc.id">
                      {{ doc.specialization || doc.id }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label>Department <span class="text-red-500">*</span></Label>
                <Select v-model="formData.departmentId">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="dept in departmentStore.departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 4: Insurance & Emergency Contact -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Insurance & Emergency Contact</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="insuranceProvider">Insurance Provider</Label>
                <Input id="insuranceProvider" placeholder="SGK" v-model="formData.insuranceProvider" />
              </div>
              <div class="space-y-2">
                <Label for="insuranceNumber">Insurance Number</Label>
                <Input id="insuranceNumber" placeholder="INS123" v-model="formData.insuranceNumber" />
              </div>
              <div class="space-y-2">
                <Label for="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" placeholder="Ayşe Veli" v-model="formData.emergencyContactName" />
              </div>
              <div class="space-y-2">
                <Label for="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" placeholder="05559876543" v-model="formData.emergencyContactPhone" />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter class="flex justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <Button variant="outline" @click="goBack">Cancel</Button>
          <Button class="bg-blue-600 hover:bg-blue-700" @click="handleSubmit">
            <Save class="mr-2 h-4 w-4" />
            Save Record
          </Button>
        </CardFooter>
      </Card>
    </main>
  </div>
</template>

