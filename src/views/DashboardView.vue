<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  UserPlus,
  Users,
  FileEdit,
  Trash2,
  Search,
  LogOut,
  Activity
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const navigateToCreate = () => {
  router.push('/create-patient')
}

const actions = computed(() => {
  // Hide/show dashboard actions by role
  function getActionsByRole(role: string) {
    if (role === 'admin') {
      return [
        {
          title: 'New Patient',
          description: 'Register a new patient record',
          icon: UserPlus,
          action: navigateToCreate,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          hoverBorder: 'hover:border-green-200'
        },
        {
          title: 'Patient List',
          description: 'View and manage all patients',
          icon: Users,
          action: () => { router.push('/patients') },
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          hoverBorder: 'hover:border-blue-200'
        },
        {
          title: 'Doctors',
          description: 'View/add/remove doctors',
          icon: FileEdit,
          action: () => { router.push('/doctors') },
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          hoverBorder: 'hover:border-amber-200'
        },
        {
          title: 'Departments',
          description: 'View/add/remove departments',
          icon: Trash2,
          action: () => { router.push('/departments') },
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          hoverBorder: 'hover:border-red-200'
        },
        {
          title: 'Search & Filter',
          description: 'Find records by ID, name, doctor, department',
          icon: Search,
          action: () => { router.push('/patients') },
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          hoverBorder: 'hover:border-purple-200'
        }
      ];
    }
    if (role === 'doctor') {
      return [
        {
          title: 'Patient List',
          description: 'View and manage all patients',
          icon: Users,
          action: () => { router.push('/patients') },
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          hoverBorder: 'hover:border-blue-200'
        },
        {
          title: 'Search & Filter',
          description: 'Find records by ID, name, doctor, department',
          icon: Search,
          action: () => { router.push('/patients') },
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          hoverBorder: 'hover:border-purple-200'
        }
      ];
    }
    return [];
  }
  return getActionsByRole(auth.user?.role || '');
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-gray-800">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Activity class="h-6 w-6" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">PRS</h1>
            <p class="text-xs text-gray-500">Healthcare Management System</p>
          </div>
        </div>
        <Button variant="ghost" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" @click="auth.logout">
          <LogOut class="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
        <p class="mt-1 text-sm text-gray-500">Welcome back, Dr. Smith. What would you like to do today?</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card 
          v-for="(action, index) in actions" 
          :key="index"
          class="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          :class="action.hoverBorder"
          @click="action.action"
        >
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              {{ action.title }}
            </CardTitle>
            <div :class="`rounded-full p-2 ${action.bgColor} ${action.color}`">
              <component :is="action.icon" class="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-xs text-muted-foreground">
              {{ action.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

