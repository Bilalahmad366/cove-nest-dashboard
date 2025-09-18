export const authRoutes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/modules/auth/views/Login.vue"),
    meta: {
      layout: "auth",
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/modules/auth/views/Register.vue"),
    meta: {
      layout: "auth",
      requiresAuth: false,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/modules/auth/views/ResetPassword.vue"),
    meta: {
      layout: "auth",
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/modules/auth/views/ForgotPasword.vue"),
    meta: {
      layout: "auth",
      requiresAuth: false,
    },
  },
];


export const appRoutes = [
  // Dashboard Routes
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/core/views/Dashboard.vue"),
    meta: {
      layout: "app",
      // requiresAuth: true,
    },
  },

  //  Property Routes
  {
    path: "/property/add-property",
    name: "add-property",
    component: () => import("@/modules/Property/veiws/AddProperty.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  
  {
    path: "/:catchAll(.*)", 
    name: "page-not-found",
    component: () => import("@/core/views/PageNotFound.vue"),
    meta: {
      layout: "auth",
      requiresAuth: false,
    },
  },
];
