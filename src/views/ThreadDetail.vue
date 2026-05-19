<template>
  <div class="page-container">

    <!-- Back -->
    <button @click="router.push('/')" class="btn-ghost text-[13px] mb-6 -ml-2">
      <ArrowLeftIcon class="w-3.5 h-3.5" />
      Kembali
    </button>

    <!-- Loading skeleton -->
    <div v-if="loading" class="rounded-2xl border border-border bg-white p-6 animate-pulse space-y-4">
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-lg bg-secondary shrink-0" />
        <div class="flex-1 space-y-3">
          <div class="h-5 bg-secondary rounded-md w-3/4" />
          <div class="h-3 bg-secondary rounded-md w-1/3" />
        </div>
      </div>
      <div class="space-y-2 pt-2">
        <div class="h-3.5 bg-secondary rounded w-full" />
        <div class="h-3.5 bg-secondary rounded w-full" />
        <div class="h-3.5 bg-secondary rounded w-4/5" />
      </div>
    </div>

    <template v-else-if="thread">

      <!-- ── Thread Card ── -->
      <div class="rounded-2xl border border-border bg-white shadow-sm overflow-hidden mb-1">

        <div v-if="!editing">
          <!-- Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start gap-3.5 mb-4">
              <div class="badge-q mt-0.5 shrink-0">Q</div>
              <h1 class="text-lg font-bold text-foreground leading-snug">{{ thread.title }}</h1>
            </div>
            <div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground ml-[3.375rem]">
              <router-link
                :to="`/profile/${thread.user?.id}`"
                class="flex items-center gap-1.5 hover:text-primary transition-colors"
                @click.stop
              >
                <div class="avatar-sm">{{ thread.user?.username?.[0]?.toUpperCase() }}</div>
                <span class="font-medium text-foreground/80">{{ thread.user?.username }}</span>
              </router-link>
              <span class="text-border">·</span>
              <div class="flex items-center gap-1">
                <CalendarIcon class="w-3 h-3" />
                {{ formatDate(thread.created_at) }}
              </div>
            </div>
          </div>

          <div class="h-px bg-border mx-6" />

          <!-- Content -->
          <div class="px-6 py-5">
            <p class="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{{ thread.content }}</p>
          </div>

          <!-- Owner actions -->
          <div v-if="isOwner" class="flex items-center gap-2 px-6 pb-5">
            <button @click="startEdit" class="btn-outline text-[13px] py-1.5">
              <PencilIcon class="w-3.5 h-3.5" />
              Edit
            </button>
            <button @click="showDeleteConfirm = true" class="btn-ghost text-[13px] py-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2Icon class="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>

        <!-- Edit form -->
        <div v-else>
          <div class="flex items-center gap-2 px-6 py-4 border-b border-border bg-secondary/30">
            <PencilIcon class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold">Edit Pertanyaan</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Judul</label>
              <input v-model="editTitle" type="text" class="form-input" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Konten</label>
              <textarea v-model="editContent" rows="7" class="form-textarea" />
            </div>
            <div v-if="editError" class="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircleIcon class="w-3.5 h-3.5 shrink-0" />{{ editError }}
            </div>
            <div class="flex gap-2">
              <button @click="saveEdit" :disabled="saveLoading" class="btn-primary text-[13px]">
                <LoaderIcon v-if="saveLoading" class="w-3.5 h-3.5 animate-spin" />
                <CheckIcon v-else class="w-3.5 h-3.5" />
                {{ saveLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
              <button @click="editing = false" class="btn-outline text-[13px]">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Replies Section ── -->
      <div class="mt-6">

        <!-- Replies Header -->
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-base font-semibold text-foreground">Balasan</h2>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {{ replies.length }}
          </span>
        </div>

        <!-- Reply List -->
        <div v-if="replies.length > 0" class="space-y-3 mb-5">
          <div
            v-for="reply in replies"
            :key="reply.id"
            class="rounded-xl border border-border bg-white p-4 group"
          >
            <div class="flex items-start gap-3">
              <div class="avatar-sm shrink-0 mt-0.5">{{ reply.user?.username?.[0]?.toUpperCase() }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <router-link
                    :to="`/profile/${reply.user?.id}`"
                    class="text-xs font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {{ reply.user?.username }}
                  </router-link>
                  <span class="text-border text-xs">·</span>
                  <span class="text-xs text-muted-foreground">{{ formatDate(reply.created_at) }}</span>
                </div>
                <p class="text-sm text-foreground leading-relaxed">{{ reply.content }}</p>
              </div>
              <!-- Delete own reply -->
              <button
                v-if="isReplyOwner(reply)"
                @click="deleteReply(reply.id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1.5 h-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2Icon class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-sm text-muted-foreground mb-5">
          Belum ada balasan. Jadilah yang pertama menjawab!
        </div>

        <!-- Add Reply Form -->
        <div v-if="auth.isLoggedIn" class="rounded-xl border border-border bg-white overflow-hidden">
          <div class="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
            <MessageSquarePlusIcon class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Tulis Balasan</span>
          </div>
          <div class="p-5 space-y-3">
            <textarea
              v-model="replyContent"
              rows="3"
              placeholder="Tulis balasanmu di sini... (min 5 karakter)"
              class="form-textarea"
            />
            <div v-if="replyError" class="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircleIcon class="w-3.5 h-3.5 shrink-0" />{{ replyError }}
            </div>
            <div class="flex justify-end">
              <button @click="submitReply" :disabled="replyLoading" class="btn-primary text-[13px]">
                <LoaderIcon v-if="replyLoading" class="w-3.5 h-3.5 animate-spin" />
                <SendIcon v-else class="w-3.5 h-3.5" />
                {{ replyLoading ? 'Mengirim...' : 'Kirim Balasan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Not logged in prompt -->
        <div v-else class="rounded-xl border border-border bg-secondary/30 p-5 text-center">
          <p class="text-sm text-muted-foreground">
            <router-link to="/login" class="text-primary font-medium hover:underline">Login</router-link>
            untuk menulis balasan.
          </p>
        </div>

      </div>

    </template>

    <!-- Delete Modal -->
    <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showDeleteConfirm = false" />
        <div class="relative w-full max-w-xs rounded-2xl border border-border bg-white shadow-xl p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Trash2Icon class="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p class="font-semibold text-foreground text-sm">Hapus Thread?</p>
              <p class="text-xs text-muted-foreground mt-0.5">Thread beserta semua balasan akan dihapus permanen.</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="deleteThread" :disabled="deleteLoading"
              class="flex-1 btn-primary bg-destructive hover:bg-destructive/90 shadow-none text-[13px]">
              <LoaderIcon v-if="deleteLoading" class="w-3.5 h-3.5 animate-spin" />
              {{ deleteLoading ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
            <button @click="showDeleteConfirm = false" class="flex-1 btn-outline text-[13px]">Batal</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api'
import {
  ArrowLeftIcon, PencilIcon, Trash2Icon, CheckIcon,
  CalendarIcon, AlertCircleIcon, LoaderIcon, SendIcon, MessageSquarePlusIcon,
} from 'lucide-vue-next'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const tid    = route.params.id

const thread  = ref(null)
const replies = ref([])
const loading = ref(true)

const editing     = ref(false)
const editTitle   = ref('')
const editContent = ref('')
const editError   = ref('')
const saveLoading = ref(false)

const showDeleteConfirm = ref(false)
const deleteLoading     = ref(false)

const replyContent = ref('')
const replyError   = ref('')
const replyLoading = ref(false)

const loadThread = async () => {
  const res = await api.get(`/threads/${tid}`)
  thread.value = res.data?.data || res.data
}

const loadReplies = async () => {
  const res = await api.get(`/threads/${tid}/replies`)
  replies.value = res.data?.data || res.data || []
}

onMounted(async () => {
  try {
    await Promise.all([loadThread(), loadReplies()])
  } finally {
    loading.value = false
  }
})

const currentUserId = computed(() => {
  if (!auth.isLoggedIn) return null
  try { return JSON.parse(atob(auth.token.split('.')[1])).sub } catch { return null }
})

const isOwner = computed(() => thread.value?.user?.id === currentUserId.value)
const isReplyOwner = (reply) => reply.user?.id === currentUserId.value

const startEdit = () => {
  editTitle.value   = thread.value.title
  editContent.value = thread.value.content
  editError.value   = ''
  editing.value     = true
}

const saveEdit = async () => {
  editError.value = ''
  saveLoading.value = true
  try {
    await api.put(`/threads/${tid}`, { title: editTitle.value, content: editContent.value })
    await loadThread()
    editing.value = false
  } catch (e) {
    const msg = e.response?.data?.message
    editError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal menyimpan'
  } finally {
    saveLoading.value = false
  }
}

const deleteThread = async () => {
  deleteLoading.value = true
  try {
    await api.delete(`/threads/${tid}`)
    router.push('/')
  } finally {
    deleteLoading.value = false
    showDeleteConfirm.value = false
  }
}

const submitReply = async () => {
  replyError.value = ''
  replyLoading.value = true
  try {
    await api.post(`/threads/${tid}/replies`, { content: replyContent.value })
    replyContent.value = ''
    await loadReplies()
  } catch (e) {
    const msg = e.response?.data?.message
    replyError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal mengirim balasan'
  } finally {
    replyLoading.value = false
  }
}

const deleteReply = async (id) => {
  try {
    await api.delete(`/replies/${id}`)
    await loadReplies()
  } catch (e) {
    console.error('Gagal menghapus reply', e)
  }
}

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric',
})
</script>
