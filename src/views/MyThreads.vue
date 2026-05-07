<template>
  <div>
    <div class="header">
      <h1>Thread Saya</h1>
      <router-link to="/">Kembali</router-link>
    </div>

    <div v-if="!auth.isLoggedIn" class="notice">
      <p>Silakan login untuk melihat thread Anda.</p>
      <router-link to="/login">Login</router-link>
    </div>

    <div v-else>
      <p v-if="loading">Memuat...</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="!loading && !error && threads.length === 0">Belum ada thread.</p>

      <div v-for="thread in threads" :key="thread.id" class="card">
        <router-link :to="`/threads/${thread.id}`">
          <h3>{{ thread.title }}</h3>
          <p>
            by {{ thread.user.username }} -- {{ formatDate(thread.created_at) }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import api from "../api";

const auth = useAuthStore();
const threads = ref([]);
const loading = ref(false);
const error = ref("");

const loadThreads = async () => {
  if (!auth.isLoggedIn) return;
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/threads/my-threads");
    threads.value = res.data?.data || res.data || [];
  } catch (e) {
    error.value = e.response?.data?.message || "Gagal memuat thread";
  } finally {
    loading.value = false;
  }
};

onMounted(loadThreads);

const formatDate = (d) => new Date(d).toLocaleDateString("id-ID");
</script>
