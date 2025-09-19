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
        <div class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
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
              <img src="/assets/images/logo.svg" alt="Logo" class="mx-auto w-10" />
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

          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-7">
              <h1 class="mb-3 text-2xl font-bold !leading-snug dark:text-white">Reset Password</h1>
              <p>Enter the code sent to your email and update your password.</p>
            </div>

            <form class="space-y-5" @submit.prevent="resetPassword()">
              <!-- Code Field -->
              <div
                :class="{
                  'has-error': $v.form.token.$error,
                  'has-success': isresetpassword && !$v.form.token.$error,
                }"
              >
                <label for="token">Code</label>
                <div class="relative text-white-dark">
                  <input id="token" type="text" placeholder="Enter your code" class="form-input pl-10 placeholder:text-white-dark" v-model.trim="$v.form.token.$model" />
                </div>

                <template v-if="isresetpassword && $v.form.token.$error">
                  <p class="text-danger mt-1">please fill the field</p>
                </template>
              </div>

              <!-- New Password Field -->
              <div
                :class="{
                  'has-error': $v.form.newPassword.$error,
                  'has-success': isresetpassword && !$v.form.newPassword.$error,
                }"
              >
                <label for="newPassword">New Password</label>
                <div class="relative text-white-dark">
                  <input id="newPassword" type="password" placeholder="Enter new password" class="form-input pl-10 placeholder:text-white-dark" v-model.trim="$v.form.newPassword.$model" />
                </div>
                <template v-if="isresetpassword && $v.form.newPassword.$error">
                  <p class="text-danger mt-1">password must be 6 characters</p>
                </template>
              </div>

              <!-- Confirm Password Field -->
              <div
                :class="{
                  'has-error': $v.form.confirmPassword.$error,
                  'has-success': isresetpassword && !$v.form.confirmPassword.$error,
                }"
              >
                <label for="confirmPassword">Confirm Password</label>
                <div class="relative text-white-dark">
                  <input id="confirmPassword" type="password" placeholder="Confirm new password" class="form-input pl-10 placeholder:text-white-dark" v-model.trim="$v.form.confirmPassword.$model" />
                </div>
                <template v-if="isresetpassword && $v.form.confirmPassword.$error">
                  <div v-if="confirnPasswordErr">
                    <p class="text-danger mt-1">{{ confirnPasswordErr }}</p>
                  </div>

                  <p v-else class="text-danger mt-1">password must be 6 character</p>
                </template>
              </div>

              <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">Update Password</button>
            </form>
          </div>

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
import { required, minLength, sameAs } from "@vuelidate/validators";
import { resetpassword } from "../composables/useAuth";
import { useVuelidate } from "@vuelidate/core";
import axios from "axios";

useMeta({ title: "Reset Password Cover" });

const router = useRouter();
const store = useAppStore();

const loadingState = ref(false);
const isresetpassword = ref(false);
const confirnPasswordErr = ref("");
const form = ref({
  token: "",
  newPassword: "",
  confirmPassword: "",
});

const sameAsPassword = (value: string) => {
  if (value !== form.value.newPassword) {
    confirnPasswordErr.value = "password not matche !";
  }
  return value === form.value.newPassword;
};
// Validation rules
const rules = {
  form: {
    token: { required, minLength: minLength(3) },
    newPassword: { required, minLength: minLength(6) },
    confirmPassword: {
      minLength: minLength(6),
      required,
      sameAsPassword,
    },
  },
};
// Initialize validation
const $v = useVuelidate(rules, { form });

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
const resetPassword = async () => {
  isresetpassword.value = true;
  $v.value.$touch();
  if ($v.value.$invalid) {
    return false;
  }
  loadingState.value = true;

  try {
    let payload = {
      token: form.value.token,
      newPassword: form.value.newPassword,
    };
    let response = await resetpassword(payload);
    router.push("/");
  } catch (error) {
    console.log(error);
  } finally {
    loadingState.value = false;
  }
};
</script>
