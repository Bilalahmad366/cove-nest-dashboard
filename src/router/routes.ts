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

  //  projects Routes
  {
    path: "/projects",
    name: "projects",
    component: () => import("@/modules/Projects/veiws/Projects.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/projects/add-project",
    name: "add-project",
    component: () => import("@/modules/Projects/veiws/AddProjects.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/projects/update-project/:id",
    name: "update-project",
    component: () => import("@/modules/Projects/veiws/AddProjects.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },

  //  news Routes
  {
    path: "/news",
    name: "news",
    component: () => import("@/modules/News/views/news.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/news/add-news",
    name: "add-news",
    component: () => import("@/modules/News/views/addNews.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/news/update-news/:id",
    name: "update-news",
    component: () => import("@/modules/News/views/addNews.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  //  events Routes
  {
    path: "/events",
    name: "events",
    component: () => import("@/modules/Events/views/events.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/events/add-event",
    name: "add-event",
    component: () => import("@/modules/Events/views/addEvent.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/events/update-event/:id",
    name: "update-event",
    component: () => import("@/modules/Events/views/addEvent.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  //  blogs Routes
  {
    path: "/blogs",
    name: "blogs",
    component: () => import("@/modules/blogs/views/blogs.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/blogs/add-blog",
    name: "add-blog",
    component: () => import("@/modules/blogs/views/addBlog.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/blogs/update-blog/:id",
    name: "update-blog",
    component: () => import("@/modules/blogs/views/addBlog.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  //  video Routes
  {
    path: "/videos",
    name: "videos",
    component: () => import("@/modules/videos/views/videos.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/videos/add-video",
    name: "add-video",
    component: () => import("@/modules/videos/views/addVideo.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/videos/update-video/:id",
    name: "update-video",
    component: () => import("@/modules/videos/views/addVideo.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  //  FAQ Routes
  {
    path: "/faq",
    name: "faq",
    component: () => import("@/modules/FAQ/views/Faq.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/faq/add-faq",
    name: "add-faq",
    component: () => import("@/modules/FAQ/views/addFaq.vue"),
    meta: {
      layout: "app",
      requiresAuth: true,
    },
  },
  {
    path: "/faq/update-faq/:id",
    name: "update-faq",
    component: () => import("@/modules/FAQ/views/addFaq.vue"),
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
