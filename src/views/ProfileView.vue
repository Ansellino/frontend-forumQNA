<template>
  <div class="page-container">

    <!-- Back -->
    <button @click="router.back()" class="btn-ghost text-[13px] mb-6 -ml-2">
      <ArrowLeftIcon class="w-3.5 h-3.5" />
      Kembali
    </button>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="rounded-2xl border border-border bg-white p-6 animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-2xl bg-secondary shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-secondary rounded-md w-40" />
            <div class="h-3 bg-secondary rounded-md w-56" />
          </div>
        </div>
        <div class="flex gap-4">
          <div class="h-16 bg-secondary rounded-xl flex-1" />
          <div class="h-16 bg-secondary rounded-xl flex-1" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-2xl border border-border bg-white p-10 text-center">
      <div class="w-14 h-14 rounded-2xl bg-red-50 mx-auto mb-4 flex items-center justify-center">
        <AlertCircleIcon class="w-6 h-6 text-destructive" />
      </div>
      <p class="font-semibold text-foreground mb-1">User Tidak Ditemukan</p>
      <p class="text-sm text-muted-foreground">{{ error }}</p>
    </div>

    <template v-else-if="profile">

      <!-- ── Profile Card ── -->
      <div class="rounded-2xl border border-border bg-white shadow-sm overflow-hidden mb-6">

        <!-- Cover / Top gradient bar -->
        <div class="h-20 bg-gradient-to-r from-primary/80 to-orange-400/80" />

        <div class="px-6 pb-6">
          <!-- Avatar overlapping the cover -->
          <div class="-mt-8 mb-4 flex items-end justify-between">
            <div class="w-16 h-16 rounded-2xl bg-primary/15 border-4 border-white flex items-center justify-center text-2xl font-bold text-primary shadow-md">
              {{ profile.username?.[0]?.toUpperCase() }}
            </div>
          </div>

          <!-- Name & Email -->
          <h1 class="text-xl font-bold text-foreground">{{ profile.username }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <MailIcon class="w-3.5 h-3.5" />
            {{ profile.email }}
          </p>

          <!-- Stats -->
          <div class="flex gap-3 mt-5">
            <div class="flex-1 rounded-xl bg-secondary/50 border border-border px-4 py-3 text-center">
              <p class="text-2xl font-bold text-primary">{{ profile.threadCount }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">Thread Dibuat</p>
            </div>
            <div class="flex-1 rounded-xl bg-secondary/50 border border-border px-4 py-3 text-center">
              <p class="text-sm font-semibold text-foreground">{{ formatDate(profile.created_at) }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">Bergabung</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Recent Threads ── -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-base font-semibold text-foreground">Thread Terbaru</h2>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {{ profile.recentThreads?.length }}
          </span>
        </div>

        <div v-if="profile.recentThreads?.length > 0" class="space-y-3">
          <router-link
            v-for="thread in profile.recentThreads"
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
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon class="w-3 h-3" />
                  {{ formatDate(thread.created_at) }}
                </div>
              </div>
              <ChevronRightIcon class="w-4 h-4 text-border group-hover:text-primary/50 shrink-0 mt-1 transition-colors" />
            </div>
          </router-link>
        </div>

        <div v-else class="rounded-xl border border-border bg-white p-10 text-center">
          <div class="w-12 h-12 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
            <MessageSquareIcon class="w-5 h-5 text-muted-foreground/40" />
          </div>
          <p class="text-sm text-muted-foreground">Belum ada thread yang dibuat.</p>
        </div>

        <!-- Show more link if threadCount > 5 -->
        <div v-if="profile.threadCount > 5" class="mt-3 text-center">
          <p class="text-xs text-muted-foreground">
            Menampilkan 5 dari {{ profile.threadCount }} thread.
          </p>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import {
  ArrowLeftIcon, MailIcon, CalendarIcon, ChevronRightIcon,
  MessageSquareIcon, AlertCircleIcon,
} from 'lucide-vue-next'

const route   = useRoute()
const router  = useRouter()
const profile = ref(null)
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/users/${route.params.id}`)
    profile.value = res.data?.data || res.data
  } catch (e) {
    error.value = e.response?.data?.message || 'User tidak ditemukan'
  } finally {
    loading.value = false
  }
})

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric',
})
</script>
