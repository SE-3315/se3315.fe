<script setup lang="ts">
import { ref } from 'vue'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-vue-next'

import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const email = ref('')
const password = ref('')
const error = ref('') // Placeholder for error message

const handleLogin = async () => {
    isLoading.value = true
    error.value = ''

    // Simulate API call
    setTimeout(() => {
        isLoading.value = false
        router.push('/dashboard')
        // error.value = 'Invalid credentials. Please try again.' // Uncomment to test error state
    }, 2000)
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <Card class="w-full max-w-md">
            <CardHeader class="space-y-1 text-center">
                <CardTitle class="text-2xl font-bold tracking-tight text-blue-900">
                    CarePulse Login
                </CardTitle>
                <CardDescription>
                    Enter your credentials to access the healthcare portal
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <Alert v-if="error" variant="destructive">
                    <AlertCircle class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {{ error }}
                    </AlertDescription>
                </Alert>

                <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input id="email" type="email" placeholder="doctor@hospital.com" v-model="email" />
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                    </div>
                    <Input id="password" type="password" v-model="password" />
                </div>

                <div class="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label for="remember" class="text-sm font-normal text-gray-500">
                        Remember me for 30 days
                    </Label>
                </div>
            </CardContent>
            <CardFooter>
                <Button class="w-full bg-blue-700 hover:bg-blue-800" :disabled="isLoading" @click="handleLogin">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ isLoading ? 'Signing in...' : 'Sign in' }}
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>
