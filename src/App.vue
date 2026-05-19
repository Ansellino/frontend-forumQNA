<template>
  <div class="min-h-screen bg-background flex flex-col">

    <!-- Navbar -->
    <header class="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
            <MessageSquareIcon class="w-3.5 h-3.5 text-white" />
          </div>
          <span class="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors">
            Forum<span class="text-primary">Q&A</span>
          </span>
        </router-link>

        <!-- Center Nav -->
        <nav class="hidden sm:flex items-center gap-0.5">
          <router-link to="/" class="btn-ghost text-[13px]" active-class="bg-accent text-foreground">
            Beranda
          </router-link>
          <router-link v-if="auth.isLoggedIn" to="/my-threads" class="btn-ghost text-[13px]" active-class="bg-accent text-foreground">
            Thread Saya
          </router-link>
        </nav>

        <!-- Auth -->
        <div class="flex items-center gap-2">
          <template v-if="auth.isLoggedIn">
            <router-link
              :to="`/profile/${auth.userId}`"
              class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-colors"
            >
              <div class="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                {{ auth.username?.[0]?.toUpperCase() }}
              </div>
              <span class="text-xs font-medium text-foreground">{{ auth.username }}</span>
            </router-link>
            <button @click="handleLogout" class="btn-ghost text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOutIcon class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Keluar</span>
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-ghost text-[13px]">Masuk</router-link>
            <router-link to="/register" class="btn-primary text-[13px] py-1.5 px-3">Daftar</router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border py-5 mt-auto">
      <div class="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <span class="text-xs text-muted-foreground">© 2026 ForumQ&A — Platform diskusi komunitas</span>
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Online
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { MessageSquareIcon, LogOutIcon, UserIcon } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const handleLogout = () => { auth.logout(); router.push('/login') }
</script>
