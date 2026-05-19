import { defineStore } from "pinia";
import api from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => {
      if (!state.token) return null
      try { return JSON.parse(atob(state.token.split('.')[1])).username } catch { return null }
    },
    userId: (state) => {
      if (!state.token) return null
      try { return JSON.parse(atob(state.token.split('.')[1])).sub } catch { return null }
    },
  },

  actions: {
    async register(username, email, password) {
      await api.post("/auth/register", { username, email, password });
    },

    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data?.data?.access_token || res.data?.access_token;
      localStorage.setItem("token", this.token);
    },

    logout() {
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
