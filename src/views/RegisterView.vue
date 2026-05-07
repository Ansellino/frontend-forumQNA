<template>
  <div class="auth-form">
    <h2>Register</h2>
    <input v-model="username" type="text" placeholder="Username" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleRegister">Register</button>
    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p>Sudah punya akun? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");

const handleRegister = async () => {
  error.value = "";
  success.value = "";
  try {
    await auth.register(username.value, email.value, password.value);
    success.value = "Registrasi berhasil. Silakan login.";
    setTimeout(() => {
      router.push("/login");
    }, 800);
  } catch (e) {
    error.value = e.response?.data?.message || "Registrasi gagal";
  }
};
</script>
