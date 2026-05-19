<template>
  <div class="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">

      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-2xl bg-primary mx-auto mb-3 flex items-center justify-center shadow-lg shadow-primary/25">
          <UserPlusIcon class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-xl font-bold text-foreground">Buat Akun Baru</h1>
        <p class="text-sm text-muted-foreground mt-1">Sudah punya akun?
          <router-link to="/login" class="text-primary font-medium hover:underline">Masuk di sini</router-link>
        </p>
      </div>

      <!-- Form Card -->
      <div class="rounded-2xl border border-border bg-white shadow-sm p-6 space-y-4">

        <div v-if="success" class="flex items-start gap-2.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3.5 py-3">
          <CheckCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          {{ success }}
        </div>

        <div v-if="error" class="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          {{ error }}
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Username</label>
          <div class="relative">
            <AtSignIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <input v-model="username" type="text" placeholder="johndoe" class="form-input pl-9" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
          <div class="relative">
            <MailIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <input v-model="email" type="email" placeholder="kamu@email.com" class="form-input pl-9" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
          <div class="relative">
            <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <input
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="Min. 6 karakter"
              @keyup.enter="handleRegister"
              class="form-input pl-9 pr-10"
            />
            <button type="button" @click="showPwd = !showPwd"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <EyeOffIcon v-if="showPwd" class="w-4 h-4" />
              <EyeIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button @click="handleRegister" :disabled="loading" class="btn-primary w-full mt-1">
          <LoaderIcon v-if="loading" class="w-4 h-4 animate-spin" />
          {{ loading ? 'Membuat akun...' : 'Daftar Sekarang' }}
        </button>

      </div>

      <p class="text-center text-xs text-muted-foreground mt-5">
        Dengan mendaftar, kamu menyetujui tata tertib komunitas kami.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  UserPlusIcon, MailIcon, LockIcon, AtSignIcon,
  EyeIcon, EyeOffIcon, AlertCircleIcon, CheckCircleIcon, LoaderIcon,
} from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const showPwd = ref(false)

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await auth.register(username.value, email.value, password.value)
    success.value = 'Akun berhasil dibuat! Mengarahkan ke halaman login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    const msg = e.response?.data?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Registrasi gagal'
  } finally {
    loading.value = false
  }
}
</script>
