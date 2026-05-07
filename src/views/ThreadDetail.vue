<template>
  <div v-if="thread">
    <div v-if="!editing">
      <h2>{{ thread.title }}</h2>
      <p>{{ thread.content }}</p>
      <small>by {{ thread.user.username }}</small>

      <!-- Hanya tampil jika user adalah pemilik -->
      <div v-if="isOwner">
        <button @click="startEdit">Edit</button>
        <button @click="deleteThread">Hapus</button>
      </div>
    </div>

    <!-- Form Edit -->
    <div v-else>
      <input v-model="editTitle" />
      <textarea v-model="editContent" />
      <button @click="saveEdit">Simpan</button>
      <button @click="editing = false">Batal</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const thread = ref(null);
const editing = ref(false);
const editTitle = ref("");
const editContent = ref("");

onMounted(async () => {
  const res = await api.get(`/threads/${route.params.id}`);
  thread.value = res.data;
});

// Computed: cek apakah user yang login adalah pemilik thread
const isOwner = computed(() => {
  if (!auth.isLoggedIn || !thread.value) return false;
  // Decode JWT payload untuk ambil userId
  const payload = JSON.parse(atob(auth.token.split(".")[1]));
  return thread.value.user.id === payload.sub;
});

const startEdit = () => {
  editTitle.value = thread.value.title;
  editContent.value = thread.value.content;
  editing.value = true;
};

const saveEdit = async () => {
  await api.put(`/threads/${route.params.id}`, {
    title: editTitle.value,
    content: editContent.value,
  });
  const res = await api.get(`/threads/${route.params.id}`);
  thread.value = res.data;
  editing.value = false;
};

const deleteThread = async () => {
  if (!confirm("Yakin hapus thread ini?")) return;
  await api.delete(`/threads/${route.params.id}`);
  router.push("/");
};
</script>
