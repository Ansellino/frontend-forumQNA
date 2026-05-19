<template>
  <div class="page-container">

    <!-- Hero Banner -->
    <div class="rounded-2xl bg-gradient-to-br from-primary/90 to-orange-400 p-6 mb-8 text-white shadow-lg shadow-primary/20">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold mb-1">Selamat datang di ForumQ&A 👋</h1>
          <p class="text-sm text-white/80">Tanya apa saja, jawab bersama komunitas.</p>
        </div>
        <button
          v-if="auth.isLoggedIn"
          @click="showForm = !showForm"
          class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all shadow"
        >
          <PlusIcon class="w-4 h-4" />
          Tanya Sekarang
        </button>
        <router-link
          v-else
          to="/login"
          class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-all shadow"
        >
          Login untuk Bertanya
        </router-link>
      </div>
    </div>

    <!-- Create Thread Form -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showForm" class="rounded-xl border border-border bg-white shadow-sm mb-6 overflow-hidden">
        <div class="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-secondary/40">
          <PencilLineIcon class="w-4 h-4 text-primary" />
          <span class="text-sm font-semibold text-foreground">Buat Pertanyaan Baru</span>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Judul Pertanyaan</label>
            <input
              v-model="title"
              type="text"
              placeholder="Tulis judul yang jelas dan spesifik..."
              class="form-input"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detail Pertanyaan</label>
            <textarea
              v-model="content"
              rows="5"
              placeholder="Jelaskan pertanyaanmu secara detail..."
              class="form-textarea"
            />
          </div>
          <div v-if="formError" class="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircleIcon class="w-3.5 h-3.5 shrink-0" />
            {{ formError }}
          </div>
          <div class="flex gap-2">
            <button @click="createThread" :disabled="submitting" class="btn-primary text-[13px]">
              <LoaderIcon v-if="submitting" class="w-3.5 h-3.5 animate-spin" />
              <SendIcon v-else class="w-3.5 h-3.5" />
              {{ submitting ? 'Mengirim...' : 'Kirim Pertanyaan' }}
            </button>
            <button @click="cancelForm" class="btn-outline text-[13px]">Batal</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- List Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-semibold text-foreground">Semua Diskusi</h2>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {{ threads.length }}
        </span>
      </div>
      <div class="flex items-center gap-1 text-xs text-muted-foreground">
        <ClockIcon class="w-3.5 h-3.5" />
        Terbaru
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="pageLoading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="rounded-xl border border-border bg-white p-5 animate-pulse">
        <div class="flex gap-4">
          <div class="w-9 h-9 rounded-lg bg-secondary shrink-0" />
          <div class="flex-1 space-y-2.5">
            <div class="h-4 bg-secondary rounded-md w-3/4" />
            <div class="h-3 bg-secondary rounded-md w-full" />
            <div class="h-3 bg-secondary rounded-md w-1/2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Thread Cards -->
    <div v-else-if="threads.length > 0" class="space-y-3">
      <router-link
        v-for="thread in threads"
        :key="thread.id"
        :to="`/threads/${thread.id}`"
        class="thread-card block group"
      >
        <div class="flex items-start gap-4">
          <div class="badge-q mt-0.5">Q</div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
              {{ thread.title }}
            </h3>
            <p class="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {{ thread.content }}
            </p>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <div class="avatar-sm">{{ thread.user?.username?.[0]?.toUpperCase() }}</div>
                <span class="text-xs text-muted-foreground font-medium">{{ thread.user?.username }}</span>
              </div>
              <div class="w-1 h-1 rounded-full bg-border" />
              <div class="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon class="w-3 h-3" />
                {{ formatDate(thread.created_at) }}
              </div>
            </div>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-border group-hover:text-primary/50 shrink-0 mt-1 transition-colors" />
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <MessageSquareIcon class="w-7 h-7 text-muted-foreground/50" />
      </div>
      <p class="font-semibold text-foreground mb-1">Belum ada diskusi</p>
      <p class="text-sm text-muted-foreground">Jadilah yang pertama bertanya!</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import {
  PlusIcon, PencilLineIcon, SendIcon, AlertCircleIcon,
  LoaderIcon, CalendarIcon, ChevronRightIcon,
  MessageSquareIcon, ClockIcon,
} from 'lucide-vue-next'

const auth = useAuthStore()
const threads = ref([])
const showForm = ref(false)
const title = ref('')
const content = ref('')
const formError = ref('')
const submitting = ref(false)
const pageLoading = ref(true)

const loadThreads = async () => {
  try {
    const res = await api.get('/threads')
    threads.value = res.data?.data || res.data || []
  } finally {
    pageLoading.value = false
  }
}

onMounted(loadThreads)

const createThread = async () => {
  formError.value = ''
  submitting.value = true
  try {
    await api.post('/threads', { title: title.value, content: content.value })
    await loadThreads()
    cancelForm()
  } catch (e) {
    const msg = e.response?.data?.message
    formError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal membuat thread'
  } finally {
    submitting.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
  title.value = ''
  content.value = ''
  formError.value = ''
}

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric',
})
</script>
