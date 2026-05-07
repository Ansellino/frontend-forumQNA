<template>
  <div>
    <div class="header">
      <h1>Forum Q&A</h1>
      <div v-if="auth.isLoggedIn">
        <router-link to="/my-threads">Thread Saya</router-link>
        <button @click="showForm = !showForm">+ Buat Thread</button>
      </div>
    </div>

    <div v-if="showForm" class="form">
      <input v-model="title" placeholder="Judul thread (min 5 karakter)" />
      <textarea
        v-model="content"
        placeholder="Isi pertanyaan (min 10 karakter)"
      />
      <button @click="createThread">Submit</button>
      <button @click="showForm = false">Batal</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-for="thread in threads" :key="thread.id" class="card">
      <router-link :to="`/threads/${thread.id}`">
        <h3>{{ thread.title }}</h3>
        <p>
          by {{ thread.user.username }} -- {{ formatDate(thread.created_at) }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import api from "../api";

const auth = useAuthStore();
const threads = ref([]);
const showForm = ref(false);
const title = ref("");
const content = ref("");
const error = ref("");

const loadThreads = async () => {
  const res = await api.get("/threads");
  threads.value = res.data;
};

onMounted(loadThreads);

const createThread = async () => {
  error.value = "";
  try {
    await api.post("/threads", { title: title.value, content: content.value });
    await loadThreads();
    showForm.value = false;
    title.value = content.value = "";
  } catch (e) {
    error.value = e.response?.data?.message || "Gagal membuat thread";
  }
};

const formatDate = (d) => new Date(d).toLocaleDateString("id-ID");
</script>
