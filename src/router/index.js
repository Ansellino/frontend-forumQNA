import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: () => import("../views/HomeView.vue") },
  { path: "/login", component: () => import("../views/LoginView.vue") },
  { path: "/register", component: () => import("../views/RegisterView.vue") },
  {
    path: "/threads/:id",
    component: () => import("../views/ThreadDetail.vue"),
  },
  {
    path: "/my-threads",
    component: () => import("../views/MyThreads.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:id",
    component: () => import("../views/ProfileView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard: redirect ke /login jika belum auth
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
});

export default router;
