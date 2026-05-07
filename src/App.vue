<template>
  <nav>
    <router-link to="/">Home</router-link>
    <div v-if="auth.isLoggedIn">
      <router-link to="/my-threads">My Threads</router-link>
      <button @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>
