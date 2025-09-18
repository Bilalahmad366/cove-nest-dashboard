<template>
  <form>
    <div>
      <h3 class="text-xl font-semibold mb-2">Edit User</h3>
      <div>
        <label class="text-sm mt-2 text-gray-600" for="name"> Name :</label>
        <div class="relative">
          <input
            v-model="userDetails.name"
            class="w-full bg-gray-50 rounded form-input ps-10 placeholder:text-white-dark"
            id="name"
            type="text"
            placeholder="Enter name"
          />
        </div>
      </div>
      <!--  -->
      <!--  -->

      <div>
        <label class="text-sm mt-4 text-gray-600" for="email"> email :</label>
        <div class="relative">
          <input
            v-model="userDetails.email"
            class="w-full bg-gray-50 rounded form-input ps-10 placeholder:text-white-dark"
            id="email"
            type="text"
            required
            placeholder="Enter email"
          />
        </div>
      </div>

      <!--  -->
      <!--  -->
    </div>
    <div class="mt-3">
      <button
        type="button"
        @click="updateUser()"
        class="btn btn-gradient w-full"
      >
        <span class="flex justify-center items-center" v-if="LoadingButton">
          <iconLoader class="animate-spin" />
        </span>
        <span v-else>Update User</span>
      </button>
    </div>
  </form>
</template>
<script setup>
import Multiselect from "@suadelabs/vue3-multiselect";
import "@suadelabs/vue3-multiselect/dist/vue3-multiselect.css";
import { ref, defineProps, onMounted, defineEmits } from "vue";
import showMessage from "@/core/components/common/SweetAlert";
import IconLoader from "@/core/components/icon/icon-loader.vue";
import axios from "axios";
const emit = defineEmits();
let baseUrl = import.meta.env.VITE_API_URL;
let token = localStorage.getItem("token");
// Define props
const props = defineProps({
  data: { type: Object, required: true },
});
const LoadingButton = ref(false);
const userDetails = ref({
  _id: "",
  name: "",
  email: "",
});

onMounted(async () => {
  userDetails.value = props.data;
});
/************ existing details ******************/

/****** api call for update prop********* */
const updateUser = async () => {
  console.log(userDetails.value);
  const payload = {
    id: userDetails.value._id,
    name: userDetails.value.name,
    email: userDetails.value.email,
  };
  try {
    LoadingButton.value = true;
    await axios.put(`${baseUrl}/users`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    showMessage("User Updated Successfully", "success");
    LoadingButton.value = false;
    emit("close");
  } catch (error) {
    showMessage("User Updated Failed", "error");
  }
};
</script>
