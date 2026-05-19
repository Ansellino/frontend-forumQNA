<template>
  <div class="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">

      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-2xl bg-primary mx-auto mb-3 flex items-center justify-center shadow-lg shadow-primary/25">
          <MessageSquareIcon class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-xl font-bold text-foreground">Masuk ke ForumQ&A</h1>
        <p class="text-sm text-muted-foreground mt-1">Belum punya akun?
          <router-link to="/register" class="text-primary font-medium hover:underline">Daftar gratis</router-link>
        </p>
      </div>

      <!-- Form Card -->
      <div class="rounded-2xl border border-border bg-white shadow-sm p-6 space-y-4">

        <div v-if="error" class="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          {{ error }}
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
          <div class="relative">
            <MailIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <input
              v-model="email"
              type="email"
              placeholder="kamu@email.com"
              @keyup.enter="handleLogin"
              class="form-input pl-9"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
          <div class="relative">
            <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <input
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              placeholder="Masukkan password"
              @keyup.enter="handleLogin"
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

        <button
          @click="handleLogin"
          :disabled="loading"
          class="btn-primary w-full mt-1"
        >
          <LoaderIcon v-if="loading" class="w-4 h-4 animate-spin" />
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>

      </div>

      <!-- Hint -->
      <p class="text-center text-xs text-muted-foreground mt-5">
        Dengan masuk, kamu menyetujui tata tertib diskusi komunitas kami.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { MessageSquareIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, AlertCircleIcon, LoaderIcon } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPwd = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) { error.value = 'Email dan password wajib diisi'; return }
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    const msg = e.response?.data?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Login gagal, periksa email & password'
  } finally {
    loading.value = false
  }
}
</script>
