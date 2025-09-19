<template>
  <div :class="{ 'dark text-white-dark': store.semidark }">
    <nav
      class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300">
      <div class="bg-white dark:bg-[#0e1726] h-full">
        <div class="flex justify-between items-center px-4">
          <router-link to="/dashboard" class="main-logo flex items-center shrink-0">
            <img class="w-32 ml-[4px] flex-none" src="/assets/images/logo.png" alt="Cove Nest logo" />
            <!-- <span class="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">VRISTO</span> -->
          </router-link>
          <a href="javascript:;"
            class="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180 hover:text-primary"
            @click="store.toggleSidebar()">
            <icon-carets-down class="m-auto rotate-90" />
          </a>
        </div>
        <perfect-scrollbar :options="{
          swipeEasing: true,
          wheelPropagation: false,
        }" class="h-[calc(100vh-80px)] relative">
          <ul class="relative font-semibold space-y-0.5  mt-2.5 p-4 py-0">
            <li class="menu nav-item">
              <button type="button" class="nav-link group w-full cursor-pointer" @click="router.push('/dashboard')">
                <div class="flex items-center">
                  <icon-menu-dashboard class="group-hover:!text-lime-700 shrink-0" />
                  <span class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                    {{ $t("Dashboard") }}
                  </span>
                </div>
                <!-- <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== 'dashboard' }">
                                    <icon-caret-down />
                                </div> -->
              </button>
            </li>

            <li class="menu nav-item">
              <button type="button" class="nav-link group w-full" :class="{ active: activeDropdown === 'Projects' }"
                @click="
                  activeDropdown === 'Projects'
                    ? (activeDropdown = null)
                    : (activeDropdown = 'Projects')
                  ">
                <div class="flex items-center">
                  <iconproperty class="group-hover:!text-lime-700  shrink-0" />

                  <span class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{{
                    $t("Projects") }}</span>
                </div>
                <div :class="{
                  'rtl:rotate-90 -rotate-90': activeDropdown !== 'Projects',
                }">
                  <icon-caret-down />
                </div>
              </button>
              <vue-collapsible :isOpen="activeDropdown === 'Projects'">
                <ul class="sub-menu text-gray-500">


                  <li>
                    <router-link to="/projects" @click="toggleMobileMenu" class="flex items-center space-x-2 group">
                      <span>{{ $t("Projects") }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/projects/add-project" @click="toggleMobileMenu"
                      class="flex items-center space-x-2 group">
                      <span>{{ $t("Add Project") }}</span>
                    </router-link>
                  </li>


                </ul>
              </vue-collapsible>
            </li>



          </ul>
        </perfect-scrollbar>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/core/store/index";
import VueCollapsible from "vue-height-collapsible/vue3";
import IconCaretsDown from "@/core/components/icon/icon-carets-down.vue";
import iconproperty from "@/core/components/icon/icon-Property.vue";
import IconMenuDashboard from "@/core/components/icon/menu/icon-menu-dashboard.vue";
import IconCaretDown from "@/core/components/icon/icon-caret-down.vue";
import router from "@/router";

const store = useAppStore();
const activeDropdown: any = ref("");
const subActive: any = ref("");

onMounted(() => {
  const selector = document.querySelector(
    '.sidebar ul a[href="' + window.location.pathname + '"]'
  );
  if (selector) {
    selector.classList.add("active");
    const ul: any = selector.closest("ul.sub-menu");
    if (ul) {
      let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link") || [];
      if (ele.length) {
        ele = ele[0];
        setTimeout(() => {
          ele.click();
        });
      }
    }
  }
});

const toggleMobileMenu = () => {
  if (window.innerWidth < 1024) {
    store.toggleSidebar();
  }
};
</script>
