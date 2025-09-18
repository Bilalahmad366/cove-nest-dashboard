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
              <img src="/assets/images/logo.png" alt="Logo" class="w-72 pl-10 mt-5" />
            </router-link>

            <div class="mt-24 hidden w-full max-w-[430px] lg:block">
              <img src="/assets/images/auth/register.svg" alt="Cover Image" class="w-full" />
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
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-10">
              <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
              <p class="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
            </div>
            <form class="space-y-5 dark:text-white" @submit.prevent="registerUser">
              <!-- name Field Validation -->
              <div
                :class="{
                  'has-error': $v.registration.name.$error,
                  'has-success': isSubmitregistration && !$v.registration.name.$error,
                }"
              >
                <label for="name">Name </label>
                <div class="relative text-white-dark">
                  <input v-model.trim="$v.registration.name.$model" id="name" type="text" placeholder="Enter name" class="form-input ps-10 placeholder:text-white-dark" />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <icon-mail :fill="true" />
                  </span>
                </div>
                <template v-if="isSubmitregistration && !$v.registration.name.$error">
                  <p class="text-[#1abc9c] mt-1">Valid name !</p>
                </template>
                <template v-if="isSubmitregistration && $v.registration.name.$error">
                  <p class="text-danger mt-1">Please enter a valid name</p>
                </template>
              </div>
              <!-- Email Field Validation -->
              <div
                :class="{
                  'has-error': $v.registration.email.$error,
                  'has-success': isSubmitregistration && !$v.registration.email.$error,
                }"
              >
                <label for="Email">Email</label>
                <div class="relative text-white-dark">
                  <input v-model.trim="$v.registration.email.$model" id="Email" type="email" placeholder="Enter Email" class="form-input ps-10 placeholder:text-white-dark" />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <icon-mail :fill="true" />
                  </span>
                </div>
                <template v-if="isSubmitregistration && !$v.registration.email.$error">
                  <p class="text-[#1abc9c] mt-1">Valid Email!</p>
                </template>
                <template v-if="isSubmitregistration && $v.registration.email.$error">
                  <p class="text-danger mt-1">Please enter a valid email</p>
                </template>
              </div>

              <!--  Password Field validation -->
              <div
                :class="{
                  'has-error': $v.registration.password.$error,
                  'has-success': isSubmitregistration && !$v.registration.password.$error,
                }"
              >
                <label for="Password">Password</label>
                <div class="relative text-white-dark">
                  <input v-model.trim="$v.registration.password.$model" id="password" type="password" placeholder="Enter Password" class="form-input ps-10 placeholder:text-white-dark" />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <icon-lock-dots :fill="true" />
                  </span>
                </div>
                <template v-if="isSubmitregistration && !$v.registration.password.$error">
                  <p class="text-[#1abc9c] mt-1">Perfect Match!</p>
                </template>
                <template v-if="isSubmitregistration && $v.registration.password.$error">
                  <p class="text-danger mt-1">
                    {{ $v.registration.password.$errors[0].$message }}
                  </p>
                </template>
              </div>

              <!-- ConfirmPassword Field Validation -->
              <div
                :class="{
                  'has-error': $v.registration.confirmpassword.$error,
                  'has-success': isSubmitregistration && !$v.registration.confirmpassword.$error,
                }"
              >
                <label for="confirmpassword">Confirm Password</label>
                <div class="relative text-white-dark">
                  <input v-model.trim="$v.registration.confirmpassword.$model" id="confirmpassword" type="password" placeholder="Confirm Password" class="form-input ps-10 placeholder:text-white-dark" />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <icon-lock-dots :fill="true" />
                  </span>
                </div>

                <template v-if="isSubmitregistration && !$v.registration.confirmpassword.$error">
                  <p class="text-[#1abc9c] mt-1">Password matched!</p>
                </template>
                <template v-if="isSubmitregistration && $v.registration.confirmpassword.$error">
                  <p class="text-danger mt-1">Password and Confirm Password must be same</p>
                </template>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                <!-- Show Sign In text when loader is false -->
                <span v-if="!loader">Sign Up</span>

                <!-- Show Loader when loader is true -->
                <div v-if="loader" class="flex justify-center">
                  <LoaderIcon class="animate-spin h-5 w-5 text-white" />
                </div>
              </button>
            </form>
            <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
              <p>{{ errorMessage }}</p>
            </div>

            
            <div class="text-center dark:text-white mt-2">
              Already have an account ?
              <router-link to="/" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white"> SIGN IN </router-link>
            </div>
          </div>
          <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.Cove Nest All Rights Reserved.</p>
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
import { useMeta } from "@/core/composables/use-meta";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import IconCaretDown from "@/core/components/icon/icon-caret-down.vue";
import IconMail from "@/core/components/icon/icon-mail.vue";
import IconLockDots from "@/core/components/icon/icon-lock-dots.vue";
import { Register } from "@/modules/auth/composables/useAuth";
import LoaderIcon from "@/core/components/icon/icon-loader.vue";

useMeta({ title: "Register" });
const router = useRouter();
const store = useAppStore();
const loader = ref(false);
const errorMessage = ref("");
const registration = ref({
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
});
const isSubmitregistration = ref(false);

// multi language
const i18n = reactive(useI18n());
const changeLanguage = (item: any) => {
  i18n.locale = item.code;
  appSetting.toggleLanguage(item);
};
const currentFlag = computed(() => {
  return `/assets/images/flags/${i18n.locale.toUpperCase()}.svg`;
});

//  Validation Rules
const sameAsPassword = (value: string) => {
  return value === registration.value.password;
};

const rules1 = {
  registration: {
    name: { required, minLength: minLength(4) },
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    },
    confirmpassword: {
      required,
      sameAsPassword,
    },
  },
};

// Initialize validation
const $v = useVuelidate(rules1, { registration });

const registerUser = async () => {
  isSubmitregistration.value = true;
  $v.value.$touch();
  if ($v.value.$invalid) {
    return false;
  }

  const postData = {
    name:registration.value.name,
    email: registration.value.email,
    password: registration.value.password,
  };
  const saveUser = {
    email: registration.value.email,
    name: registration.value.name,
  };
  loader.value = true;
  errorMessage.value = "";
  try {
    await Register(postData);
    localStorage.setItem("userdata", JSON.stringify(saveUser));
    router.push("/");
  } catch (err: any) {
    // Check if the error has a response property
    if (err && err.response && err.response.data && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      // If error is not in the expected format, display a generic message
      errorMessage.value = "Request failed";
    }
    console.error("Submission failed:", err);
  } finally {
    loader.value = false;
  }
};
</script>
