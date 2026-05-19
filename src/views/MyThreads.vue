<template>
  <div class="page-container">

    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="section-title">Thread Saya</h1>
        <p class="section-subtitle">Semua pertanyaan yang pernah kamu buat</p>
      </div>
      <router-link to="/" class="btn-outline text-[13px]">
        <ArrowLeftIcon class="w-3.5 h-3.5" />
        Beranda
      </router-link>
    </div>

    <!-- Not logged in -->
    <div v-if="!auth.isLoggedIn" class="rounded-2xl border border-border bg-white p-12 text-center">
      <div class="w-14 h-14 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
        <LockIcon class="w-6 h-6 text-muted-foreground/50" />
      </div>
      <p class="font-semibold text-foreground mb-1">Login Diperlukan</p>
      <p class="text-sm text-muted-foreground mb-5">Silakan login untuk melihat thread milikmu.</p>
      <router-link to="/login" class="btn-primary text-[13px]">Masuk Sekarang</router-link>
    </div>

    <template v-else>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="rounded-xl border border-border bg-white p-5 animate-pulse">
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

      <!-- Error -->
      <div v-else-if="error" class="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        <AlertCircleIcon class="w-4 h-4 shrink-0" />
        {{ error }}
      </div>

      <!-- Thread List -->
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
              <p class="text-[13px] text-muted-foreground line-clamp-2 mb-3">{{ thread.content }}</p>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon class="w-3 h-3" />
                <span>{{ formatDate(thread.created_at) }}</span>
                <span
                  v-if="thread.updated_at !== thread.created_at"
                  class="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground"
                >
                  <PencilIcon class="w-2.5 h-2.5" />
                  Diedit
                </span>
              </div>
            </div>
            <ChevronRightIcon class="w-4 h-4 text-border group-hover:text-primary/50 shrink-0 mt-1 transition-colors" />
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-2xl border border-border bg-white p-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
          <MessageSquareIcon class="w-7 h-7 text-muted-foreground/40" />
        </div>
        <p class="font-semibold text-foreground mb-1">Belum ada pertanyaan</p>
        <p class="text-sm text-muted-foreground mb-5">Mulai diskusi dengan bertanya pertama kali!</p>
        <router-link to="/" class="btn-primary text-[13px]">
          <PlusIcon class="w-3.5 h-3.5" />
          Buat Pertanyaan
        </router-link>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import {
  ArrowLeftIcon, LockIcon, AlertCircleIcon, MessageSquareIcon,
  CalendarIcon, ChevronRightIcon, PlusIcon, PencilIcon,
} from 'lucide-vue-next'

const auth = useAuthStore()
const threads = ref([])
const loading = ref(false)
const error = ref('')

const loadThreads = async () => {
  if (!auth.isLoggedIn) return
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/threads/my-threads')
    threads.value = res.data?.data || res.data || []
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal memuat thread'
  } finally {
    loading.value = false
  }
}

onMounted(loadThreads)

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric',
})
</script>
