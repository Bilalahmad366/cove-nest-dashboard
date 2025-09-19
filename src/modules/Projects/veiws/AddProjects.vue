<template>
  <div class="panel">
    <form @submit.prevent="handleSubmit">
      <h1 class="text-2xl font-bold text-center  my-2"> {{ isEditMode ? 'Update Project' : 'Add Project' }}</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div class="space-y-4">
          <!-- Project Name -->
          <div :class="{ 'has-error': $v.project.project_name.$error }">
            <label class="block text-sm font-medium text-white-dark">Project Name</label>
            <input v-model.trim="$v.project.project_name.$model" type="text" placeholder="Enter Project Name"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.project_name.$error" class="text-danger mt-1">
              {{ $v.project.project_name.$errors[0].$message }}
            </p>
          </div>

          <!-- Developer Name -->
          <div :class="{ 'has-error': $v.project.developer_name.$error }">
            <label class="block text-sm font-medium text-white-dark">Developer Name</label>
            <input v-model.trim="$v.project.developer_name.$model" type="text" placeholder="Enter Developer Name"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.developer_name.$error" class="text-danger mt-1">
              {{ $v.project.developer_name.$errors[0].$message }}
            </p>
          </div>

          <!-- Location -->
          <div :class="{ 'has-error': $v.project.location.$error }">
            <label class="block text-sm font-medium text-white-dark">Location</label>
            <input v-model.trim="$v.project.location.$model" type="text" placeholder="Enter Location"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.location.$error" class="text-danger mt-1">
              {{ $v.project.location.$errors[0].$message }}
            </p>
          </div>

          <!-- City -->
          <div :class="{ 'has-error': $v.project.city.$error }">
            <label class="block text-sm font-medium text-white-dark">City</label>
            <input v-model.trim="$v.project.city.$model" type="text" placeholder="Enter City"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.city.$error" class="text-danger mt-1">
              {{ $v.project.city.$errors[0].$message }}
            </p>
          </div>

          <!-- Size -->
          <div :class="{ 'has-error': $v.project.size.$error }">
            <label class="block text-sm font-medium text-white-dark">Size (sq ft)</label>
            <input v-model.trim="$v.project.size.$model" type="number" placeholder="Enter Size"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.size.$error" class="text-danger mt-1">
              {{ $v.project.size.$errors[0].$message }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Property Type -->
          <div :class="{ 'has-error': $v.project.property_type.$error }">
            <label class="block text-sm font-medium text-white-dark">Property Type</label>
            <multiselect v-model="$v.project.property_type.$model" :options="propertyTypeOptions"
              class="custom-multiselect" :searchable="false" :allow-empty="false" :multiple="false"
              placeholder="Select Property Type" />

            <p v-if="$v.project.property_type.$error" class="text-danger mt-1">
              {{ $v.project.property_type.$errors[0].$message }}
            </p>
          </div>

          <!-- Handover Range -->
          <div :class="{ 'has-error': $v.dateRange.$error }">
            <label class="block text-sm font-medium text-white-dark">Hand Over</label>
            <flat-pickr v-model="dateRange" class="form-input" :config="rangeCalendar"
              placeholder="Select handover period" />
            <p v-if="$v.dateRange.$error" class="text-danger mt-1">
              {{ $v.dateRange.$errors[0].$message }}
            </p>
          </div>

          <!-- Minimum Price -->
          <div :class="{ 'has-error': $v.project.min_price.$error }">
            <label class="block text-sm font-medium text-white-dark">Minimum Price</label>
            <input v-model.trim="$v.project.min_price.$model" type="number" placeholder="Enter Minimum Price"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.min_price.$error" class="text-danger mt-1">
              <span v-if="!$v.project.min_price.required">Min Price is required</span>
              <span v-else-if="!$v.project.min_price.numeric">Min Price must be a number</span>
              <span v-else-if="!$v.project.min_price.minValue">Min Price must be at least 1</span>
            </p>
          </div>

          <!-- Maximum Price -->
          <div :class="{ 'has-error': $v.project.max_price.$error || !maxPriceValid }">
            <label class="block text-sm font-medium text-white-dark">Maximum Price</label>
            <input v-model.trim="$v.project.max_price.$model" type="number" placeholder="Enter Maximum Price"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.max_price.$error" class="text-danger mt-1">
              <span v-if="!$v.project.max_price.required">Max Price is required</span>
              <span v-else-if="!$v.project.max_price.numeric">Max Price must be a number</span>
              <span v-else-if="!$v.project.max_price.minValue">Max Price must be at least 1</span>
            </p>
            <p v-if="!maxPriceValid" class="text-danger mt-1">
              Max Price should be greater than or equal to Min Price
            </p>
          </div>

          <!-- Plan Status -->
          <div :class="{ 'has-error': $v.project.plan_status.$error }">
            <label class="block text-sm font-medium text-white-dark">Plan Status</label>
            <div class="flex gap-6 mt-2">
              <label class="flex items-center gap-2">
                <input type="radio" value="Offplan" class="form-radio" v-model="$v.project.plan_status.$model" />
                Offplan
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" value="Onplan" class="form-radio" v-model="$v.project.plan_status.$model" />
                Onplan
              </label>
            </div>
            <p v-if="$v.project.plan_status.$error" class="text-danger mt-1">
              {{ $v.project.plan_status.$errors[0].$message }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-2">
        <template v-if="errorMessage">
          <div class="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
            <span class="ltr:pr-2 rtl:pl-2 text-red-400">
              <strong class="ltr:mr-1 rtl:ml-1 text-red-400">error!</strong>{{ errorMessage }}
            </span>
          </div>
        </template>

        <button type="submit"
          class="btn btn-gradient !mt-2 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
          <span v-if="!loader">{{ isEditMode ? 'Save' : 'Add Project' }}</span>
          <div v-if="loader" class="flex justify-center">
            <LoaderIcon class="animate-spin h-5 w-5 text-white" />
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric, minValue, helpers } from "@vuelidate/validators";
import Multiselect from "@suadelabs/vue3-multiselect";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import "@suadelabs/vue3-multiselect/dist/vue3-multiselect.css";

import { addProject, GetSingleProject, UpdateProject } from "../composables/useProject";
import showMessage from "@/core/components/common/SweetAlert";
import LoaderIcon from "@/core/components/icon/icon-loader.vue";
import { useMeta } from '@/core/composables/use-meta';
const router = useRouter();
const route = useRoute();
const isEditMode = computed(() => !!route.params.id);
useMeta({ title: `${isEditMode.value ? 'Update project' : 'Add project'} ` });
const loader = ref(false);
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);

const project = ref<any>({
  project_name: "",
  developer_name: "",
  location: "",
  city: "",
  size: "",
  property_type: [],
  min_price: "",
  max_price: "",
  plan_status: "",
});

const propertyTypeOptions = ref(["Apartment", "Penthouse", "Villa", "Town House"]);


const dateRange = ref<string>("");

const rangeCalendar: any = ref({
  dateFormat: "Y-m-d",
  mode: "range",
});

const maxPriceValidator = helpers.withParams(
  { message: "Max Price must be greater than or equal to Min Price" },
  (value) => {
    if (!value || !project.value.min_price) return true;
    return Number(value) >= Number(project.value.min_price);
  }
);

const resetForm = () => {

  project.value = {
    project_name: "",
    developer_name: "",
    location: "",
    city: "",
    size: "",
    property_type: [],
    min_price: "",
    max_price: "",
    plan_status: "",
  };
  dateRange.value = "";
  $v.value.$reset();
  errorMessage.value = null;
};

watch(() => route.params.id, (newId) => {
  if (!newId) {
    resetForm();
  }
});

onMounted(async () => {
  const projectId = route.params.id;
  if (projectId) {
    try {
      isLoading.value = true;
      const response: any = await GetSingleProject(projectId as string);

      let range = "";
      if (response.handover?.from && response.handover?.to) {
        const from = new Date(response.handover.from).toISOString().split("T")[0];
        const to = new Date(response.handover.to).toISOString().split("T")[0];
        range = `${from} to ${to}`;
      }

      project.value = {
        project_name: response.project_name,
        developer_name: response.developer_name,
        location: response.location,
        city: response.city,
        size: response.size,
        property_type: response.property_type,
        min_price: response.min_price,
        max_price: response.max_price,
        plan_status: response.plan_status,
      };

      dateRange.value = range;
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Failed to fetch project.";
    } finally {
      isLoading.value = false;
    }
  }
});

const rules = computed(() => ({
  project: {
    project_name: { required, maxLength: maxLength(255) },
    developer_name: { required, maxLength: maxLength(255) },
    location: { required, maxLength: maxLength(255) },
    city: { required, maxLength: maxLength(150) },
    size: { required, numeric },
    property_type: { required },
    min_price: { required, numeric, minValue: minValue(1) },
    max_price: { required, numeric, minValue: minValue(1), maxPriceValidator },
    plan_status: { required },
  },
  dateRange: { required },
}));

const $v = useVuelidate(rules, { project, dateRange });

const maxPriceValid = computed(() => {
  if (!project.value.min_price || !project.value.max_price) return true;
  return Number(project.value.max_price) >= Number(project.value.min_price);
});

const handleSubmit = async () => {
  $v.value.$touch();
  if (!$v.value.$invalid && maxPriceValid.value) {
    let from: string | null = null;
    let to: string | null = null;

    if (dateRange.value) {
      const parts = dateRange.value.split(" to ");
      from = parts[0] ? new Date(parts[0]).toISOString() : null;
      to = parts[1] ? new Date(parts[1]).toISOString() : null;
    }

    try {
      isLoading.value = true;

      const payload = {
        project_name: project.value.project_name,
        developer_name: project.value.developer_name,
        location: project.value.location,
        city: project.value.city,
        size: project.value.size,
        property_type: project.value.property_type,
        min_price: Number(project.value.min_price),
        max_price: Number(project.value.max_price),
        plan_status: project.value.plan_status,
        handoverFrom: from,
        handoverTo: to,
      };

      if (isEditMode.value) {
        const projectId = route.params.id;
        await UpdateProject(projectId, payload);
        showMessage("project updated successfully!", 'success');
      } else {
        await addProject(payload);
        showMessage("project added successfully!", 'success');
      }
      resetForm();
      isLoading.value = false;
      router.push("/projects");
    } catch (error: any) {
      isLoading.value = false;
      errorMessage.value = error.response?.data?.message || "Request failed";
      console.error("❌ API Error:", error);
    }
  } else {
    console.log("❌ Validation failed");
  }
};
</script>
