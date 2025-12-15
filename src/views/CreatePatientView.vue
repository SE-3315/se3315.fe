<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Form State
const formData = ref({
  fullName: '',
  patientId: '',
  gender: '',
  contactNumber: '',
  diagnosis: '',
  visitInfo: '',
  doctor: '',
  department: '',
  date: undefined as any,
  tags: [] as string[]
})

// Mock Data
const doctors = ['Dr. Sarah Smith', 'Dr. Michael Chen', 'Dr. Emily Johnson', 'Dr. James Wilson']
const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'General Practice']
const availableTags = ['VIP', 'Chronic Condition', 'Urgent', 'Insurance Pending']

// Date Formatter
const formattedDate = computed(() => {
  if (!formData.value.date) return 'Pick a date'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(toDate(formData.value.date, getLocalTimeZone()))
})

const goBack = () => {
  router.back()
}

const toggleTag = (tag: string) => {
  const index = formData.value.tags.indexOf(tag)
  if (index === -1) {
    formData.value.tags.push(tag)
  } else {
    formData.value.tags.splice(index, 1)
  }
}
</script>

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
          
          <!-- Section 1: Patient Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Information</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="fullName">Full Name <span class="text-red-500">*</span></Label>
                <Input id="fullName" placeholder="John Doe" v-model="formData.fullName" />
              </div>
              <div class="space-y-2">
                <Label for="patientId">Patient ID</Label>
                <Input id="patientId" placeholder="PT-123456" v-model="formData.patientId" />
              </div>
              <div class="space-y-2">
                <Label>Gender</Label>
                <Select v-model="formData.gender" class="w-full">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="contact">Contact Number</Label>
                <Input id="contact" placeholder="+1 (555) 000-0000" v-model="formData.contactNumber" />
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 2: Medical Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Medical Information</h3>
            <div class="space-y-2">
              <Label for="diagnosis">Diagnosis / Medical Notes</Label>
              <Textarea 
                id="diagnosis" 
                placeholder="Enter initial diagnosis or symptoms..." 
                class="min-h-[100px]" 
                v-model="formData.diagnosis"
              />
            </div>
            <div class="space-y-2">
              <Label for="visitInfo">Visit Information</Label>
              <Input id="visitInfo" placeholder="Reason for visit (e.g. Annual Checkup)" v-model="formData.visitInfo" />
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 3: Visit Assignment -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Visit Assignment</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Assigned Doctor</Label>
                <Select v-model="formData.doctor">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="doc in doctors" :key="doc" :value="doc">
                      {{ doc }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label>Department</Label>
                <Select v-model="formData.department">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="dept in departments" :key="dept" :value="dept">
                      {{ dept }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 dark:border-gray-800"></div>

          <!-- Section 4: Administrative Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Administrative</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2 flex flex-col">
                <Label>Registration Date</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="!formData.date ? 'text-muted-foreground' : ''"
                      class="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ formattedDate }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="formData.date" />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div class="space-y-2 flex flex-col">
                <Label>Categorization Tags</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="outline" class="w-full justify-between font-normal">
                      <span v-if="formData.tags.length === 0" class="text-muted-foreground">Select tags...</span>
                      <span v-else class="truncate">{{ formData.tags.join(', ') }}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-[200px] p-2" align="start">
                    <div class="grid gap-2">
                      <div v-for="tag in availableTags" :key="tag" class="flex items-center space-x-2">
                        <Checkbox 
                          :id="tag" 
                          :checked="formData.tags.includes(tag)"
                          @update:checked="toggleTag(tag)"
                        />
                        <Label :for="tag" class="text-sm font-normal cursor-pointer">{{ tag }}</Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter class="flex justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <Button variant="outline" @click="goBack">Cancel</Button>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Save class="mr-2 h-4 w-4" />
            Save Record
          </Button>
        </CardFooter>
      </Card>
    </main>
  </div>
</template>

