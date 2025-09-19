<template>
  <div>
    <div class="absolute inset-0">
      <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
    </div>
    <div class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
      <img src="/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
      <img src="/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
      <img src="/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
      <img src="/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
      <div class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
        <div class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(0,83,200,4)_0%,rgba(42,215,255,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
          <div class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
          <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
            <router-link to="/" class="w-48 block lg:w-72 ms-10">
              <img src="/assets/images/logo.png" alt="Logo" class="w-64 pl-16 mt-10" />
            </router-link>
            <div class="mt-24 hidden w-full max-w-[430px] lg:block">
              <img src="/assets/images/auth/reset-password.svg" alt="Cover Image" class="w-full" />
            </div>
          </div>
        </div>
        <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
          <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
            <router-link to="/" class="w-8 block lg:hidden">
              <img src="/assets/images/auth/logo.png" alt="Logo" class="mx-auto w-10" />
            </router-link>
            <div class="dropdown ms-auto w-max">
              <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="8">
                <button type="button" class="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black">
                  <div>
                    <img :src="currentFlag" alt="image" class="h-5 w-5 rounded-full object-cover" />
                  </div>
                  <div class="text-base font-bold uppercase">
                    {{ store.locale }}
                  </div>
                  <span class="shrink-0">
                    <icon-caret-down />
                  </span>
                </button>
                <template #content="{ close }">
                  <ul class="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                    <template v-for="item in store.languageList" :key="item.code">
                      <li>
                        <button
                          type="button"
                          class="w-full hover:text-primary"
                          :class="{
                            'bg-primary/10 text-primary': i18n.locale === item.code,
                          }"
                          @click="changeLanguage(item), close()"
                        >
                          <img class="w-5 h-5 object-cover rounded-full" :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`" alt="" />
                          <span class="ltr:ml-3 rtl:mr-3">{{ item.name }}</span>
                        </button>
                      </li>
                    </template>
                  </ul>
                </template>
              </Popper>
            </div>
          </div>
          <!--  -->
          <!--  -->
          <!--  -->
          <!-- Forgot Password Page -->
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-7">
              <h1 class="mb-3 text-3xl font-bold !leading-snug dark:text-white">Forgot password</h1>
              <p>Enter your email to recover your ID</p>
            </div>
            <form class="space-y-5" @submit.prevent="forgotPassword">
              <div>
                <label for="Email">Email</label>
                <div class="relative text-white-dark">
                  <input v-model="email" id="Email" type="email" placeholder="Enter Email" class="form-input pl-10 placeholder:text-white-dark" />
                  <span class="absolute left-4 top-1/2 -translate-y-1/2">
                    <icon-mail :fill="true" />
                  </span>
                </div>
                <template class="text-red-500 mt-1" v-if="emailError">
                  {{ emailError }}
                </template>
              </div>
              <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" :disabled="loadingState">
                <span v-if="loadingState"><LoaderIcon class="animate-spin h-5 w-5 text-white" /></span>
                <span v-else>RECOVER</span>
              </button>
            </form>
            <loading v-if="loadingState" />
          </div>

          <!--  -->
          <!--  -->
          <!--  -->

          <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.Optimus Algos All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import appSetting from "@/app-setting";
import { useAppStore } from "@/core/store/index";
import { useRouter } from "vue-router";
import LoaderIcon from "@/core/components/icon/icon-loader.vue";
import { useMeta } from "@/core/composables/use-meta";
import { forget } from "../composables/useAuth";
import axios from "axios"; // For API calls
// import loading from "@/components/common/lazy-loading.vue"; // Lazy loading component

useMeta({ title: "Reset Password Cover" });

const router = useRouter();
const store = useAppStore();

// Data for email, loading state, and error messages
const email = ref("");
const emailError = ref(""); // Stores the error message if the email is not found or invalid
const loadingState = ref(false); // Tracks the loading state

// multi-language setup
const i18n = reactive(useI18n());
const changeLanguage = (item: any) => {
  i18n.locale = item.code;
  appSetting.toggleLanguage(item);
};

const currentFlag = computed(() => {
  return `/assets/images/flags/${i18n.locale.toUpperCase()}.svg`;
});

// Function to handle the Forgot Password logic
const forgotPassword = async () => {
  // Validation: check if email is provided
  if (email.value === "") {
    emailError.value = "Please enter your email.";
    return;
  }

  // Start loading
  loadingState.value = true;

  try {
    let data = email.value;

    const response = await forget(data);
    console.log(response);
    router.push("/reset-password");
  } catch (error) {
    console.log(error);
  } finally {
    // Stop loading once the request is complete
    loadingState.value = false;
  }
};
</script>
