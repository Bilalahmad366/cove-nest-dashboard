<template>
  <header
    class="z-40"
    :class="{ dark: store.semidark && store.menu === 'horizontal' }"
  >
    <div class="shadow-sm">
      <div
        class="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-[#0e1726]"
      >
        <div
          class="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2"
        >
          <router-link to="/dashboard" class="main-logo flex items-center shrink-0">
            <img
              class="h-14 ml-[4px] flex-none"
              src="/assets/images/logo.png"
              alt="cove Nest"
            />
        
          </router-link>

          <a
            href="javascript:;"
            class="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
            @click="store.toggleSidebar()"
          >
            <icon-menu class="w-5 h-5" />
          </a>
        </div>
        <div
          class="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]"
        >
          <div class="sm:ltr:mr-auto sm:rtl:ml-auto mx-auto">
            <form
              class="sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden"
              :class="{ '!block': search }"
              @submit.prevent="search = false"
            >
              <div class="relative">
                <input
                  type="text"
                  class="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                  placeholder="Search..."
                />
                <button
                  type="button"
                  class="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary"
                >
                  <icon-search class="mx-auto" />
                </button>
                <button
                  type="button"
                  class="hover:opacity-80 sm:hidden block absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2"
                  @click="search = false"
                >
                  <icon-x-circle />
                </button>
              </div>
            </form>

            <button
              type="button"
              class="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              @click="search = !search"
            >
              <icon-search class="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" />
            </button>
          </div>
          <div>
            <a
              href="javascript:;"
              v-show="store.theme === 'light'"
              class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
              @click="store.toggleTheme('dark')"
            >
              <icon-sun />
            </a>
            <a
              href="javascript:;"
              v-show="store.theme === 'dark'"
              class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
              @click="store.toggleTheme('system')"
            >
              <icon-moon />
            </a>
            <a
              href="javascript:;"
              v-show="store.theme === 'system'"
              class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
              @click="store.toggleTheme('light')"
            >
              <icon-laptop />
            </a>
          </div>

          <div class="dropdown shrink-0">
            <Popper
              :placement="
                store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'
              "
              offsetDistance="8"
            >
              <button
                type="button"
                class="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
              >
                <img
                  :src="currentFlag"
                  alt="flag"
                  class="w-5 h-5 object-cover rounded-full"
                />
              </button>
              <template #content="{ close }">
                <ul
                  class="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]"
                >
                  <template v-for="item in store.languageList" :key="item.code">
                    <li>
                      <button
                        type="button"
                        class="w-full hover:text-primary"
                        :class="{
                          'bg-primary/10 text-primary':
                            i18n.locale === item.code,
                        }"
                        @click="changeLanguage(item), close()"
                      >
                        <img
                          class="w-5 h-5 object-cover rounded-full"
                          :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`"
                          alt=""
                        />
                        <span class="ltr:ml-3 rtl:mr-3">{{ item.name }}</span>
                      </button>
                    </li>
                  </template>
                </ul>
              </template>
            </Popper>
          </div>

          <div class="dropdown shrink-0">
            <Popper
              :placement="
                store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'
              "
              offsetDistance="8"
              class="!block"
            >
              <button type="button" class="relative group block">
                <div
                  v-if="userData.email"
                  class="rounded-full w-10 h-10 flex items-center justify-center bg-lime-800 text-white font-bold text-lg"
                >
                  {{ userData.email.charAt(0).toUpperCase() }}
                </div>
              </button>
              <template #content="{ close }">
                <ul
                  class="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90"
                >
                  <li>
                    <div class="flex items-center px-4 py-4">
                      <div class="flex-none">
                        <div
                          v-if="userData.email"
                          class="rounded-md w-10 h-10 flex items-center justify-center bg-primary text-white font-bold text-lg"
                        >
                          {{ userData.email.charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <div class="ltr:pl-4 rtl:pr-4 truncate">
                        <h4 class="text-base">
                          {{ userData.name
                          }}<span
                            class="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2"
                            >Pro</span
                          >
                        </h4>
                        <a
                          class="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                          href="javascript:;"
                          >{{ userData.email }}</a
                        >
                      </div>
                    </div>
                  </li>
                  <!-- <li>
                    <router-link
                      to="/users/profile"
                      class="dark:hover:text-white"
                      @click="close()"
                    >
                      <icon-user
                        class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0"
                      />

                      Profile
                    </router-link>
                  </li> -->

                  <li
                    class="border-t border-white-light dark:border-white-light/10"
                  >
                    <button class="text-danger !py-3" @click="SignOut()">
                      <icon-logout
                        class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0"
                      />

                      Sign Out
                    </button>
                  </li>
                </ul>
              </template>
            </Popper>
          </div>
        </div>
      </div>

    
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import appSetting from "@/app-setting";
import { useRoute } from "vue-router";
import { useAppStore } from "@/core/store/index";

import IconMenu from "@/core/components/icon/icon-menu.vue";
import IconSearch from "@/core/components/icon/icon-search.vue";
import IconXCircle from "@/core/components/icon/icon-x-circle.vue";
import IconSun from "@/core/components/icon/icon-sun.vue";
import IconMoon from "@/core/components/icon/icon-moon.vue";
import IconLaptop from "@/core/components/icon/icon-laptop.vue";
import IconLogout from "@/core/components/icon/icon-logout.vue";

const store = useAppStore();
const route = useRoute();
const search = ref(false);
const userData = ref({ name: "Default Name", email: "Default Email" }); // Reactive variable for user data

// multi language
const i18n = reactive(useI18n());
const changeLanguage = (item: any) => {
  i18n.locale = item.code;
  appSetting.toggleLanguage(item);
};
const currentFlag = computed(() => {
  return `/assets/images/flags/${i18n.locale.toUpperCase()}.svg`;
});

onMounted(() => {
  setActiveDropdown();
  userData.value = getUserData();
});
const getUserData = () => {
  const userDataString = localStorage.getItem("userdata");
  if (userDataString) {
    try {
      const parsedData = JSON.parse(userDataString);
      return {
        name: parsedData.name || "Default Name",
        email: parsedData.email || "Default Email",
      };
    } catch (e) {
      console.error("Error parsing userdata from localStorage:", e);
      return { name: "Default Name", email: "Default Email" };
    }
  }
  return { name: "abc", email: "email@examp;le.;com" }; // Fallback if no userdata in localStorage
};

watch(route, (to, from) => {
  setActiveDropdown();
});

const setActiveDropdown = () => {
  const selector = document.querySelector(
    'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
  );
  if (selector) {
    selector.classList.add("active");
    const all: any = document.querySelectorAll(
      "ul.horizontal-menu .nav-link.active"
    );
    for (let i = 0; i < all.length; i++) {
      all[0]?.classList.remove("active");
    }
    const ul: any = selector.closest("ul.sub-menu");
    if (ul) {
      let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link");
      if (ele) {
        ele = ele[0];
        setTimeout(() => {
          ele?.classList.add("active");
        });
      }
    }
  }
};

const SignOut = () => {
  localStorage.removeItem("token");
  store.setIsAuthenticated(false);
  window.location.reload();
};
</script>
