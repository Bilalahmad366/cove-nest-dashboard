<template>
  <div class="panel">
    <form @submit.prevent="handleSubmit">
      <h1 class="text-2xl font-bold text-center  my-2"> {{ isEditMode ? 'Update Project' : 'Add Project' }}</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div class="space-y-4">
          <!-- Project Name -->
          <div :class="{ 'has-error': $v.project.project_name.$error }">
            <label class="block text-sm font-medium text-white-dark">Project Name</label>
            <multiselect v-model="$v.project.project_name.$model" :options="ProjectNameOption"
              class="custom-multiselect" :searchable="true" :allow-empty="false" :multiple="false"
              placeholder="Select or Create Project" :taggable="true" @tag="addNewProject" />
            <p v-if="$v.project.project_name.$error" class="text-danger mt-1">
              {{ $v.project.project_name.$errors[0].$message }}
            </p>
          </div>


          <!-- Developer Name -->
          <div :class="{ 'has-error': $v.project.developer_name.$error }">
            <label class="block text-sm font-medium text-white-dark">Developer Name</label>
            <multiselect v-model="$v.project.developer_name.$model" :options="DeveloperNameOption"
              class="custom-multiselect" :searchable="true" :allow-empty="false" :multiple="false"
              placeholder="Select or Create Project" :taggable="true" @tag="addNewDeveloper" />
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

          <!-- size -->
          <div :class="{ 'has-error': $v.project.size.$error }">
            <label class="block text-sm font-medium text-white-dark">size </label>
            <input v-model.trim="$v.project.size.$model" type="text" placeholder="Enter size"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.size.$error" class="text-danger mt-1">
              {{ $v.project.size.$errors[0].$message }}
            </p>
          </div>
          <!-- Area -->
          <div :class="{ 'has-error': $v.project.area.$error }">
            <label class="block text-sm font-medium text-white-dark">Area</label>
            <input v-model.trim="$v.project.area.$model" type="text" placeholder="Enter area"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.area.$error" class="text-danger mt-1">
              {{ $v.project.area.$errors[0].$message }}
            </p>
          </div>
          <!-- Description -->
          <div :class="{ 'has-error': $v.project.description.$error }">
            <label class="block text-sm font-medium text-white-dark">Description</label>
            <textarea v-model.trim="$v.project.description.$model as string" placeholder="Enter project description"
              rows="4" class="form-input placeholder:text-white-dark resize-none"></textarea>
            <p v-if="$v.project.description.$error" class="text-danger mt-1">
              {{ $v.project.description.$errors[0].$message }}
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


          <!-- Categories -->
          <div>
            <label class="block text-sm font-medium text-white-dark">Categories</label>
            <multiselect v-model="project.category" :options="categoryOptions" class="custom-multiselect"
              :multiple="false" :searchable="false" placeholder="Select or add categories" />
          </div>

          <!-- Handover  -->
          <div :class="{ 'has-error': $v.project.handover.$error }">
            <label class="block text-sm font-medium text-white-dark">Hand Over</label>
            <input v-model.trim="$v.project.handover.$model" type="text" placeholder="Enter handover"
              class="form-input placeholder:text-white-dark" />
            <p v-if="$v.project.handover.$error" class="text-danger mt-1">
              {{ $v.project.handover.$errors[0].$message }}
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


          <!-- Amenities Section -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-white-dark">Amenities</label>

            <div class="flex flex-wrap items-center gap-2 border rounded p-2 cursor-text" @click="inputRef?.focus()">
              <!-- Tags -->
              <span v-for="(amenity, index) in amenities" :key="index"
                class="bg-lime-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {{ amenity }}
                <button type="button" class="text-xs bg-white/30 rounded-full px-1" @click.stop="removeAmenity(index)">
                  ✕
                </button>
              </span>

              <!-- Input -->
              <input ref="inputRef" v-model="newAmenity" @keydown.enter.prevent="addAmenity" @keydown="checkComma"
                placeholder="Type and press Enter or Comma to Add Multiple"
                class="flex-1 outline-none text-sm bg-transparent" />
            </div>
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

          <!-- Best Toggle -->
          <div>
            <label class="block text-sm font-medium text-white-dark mb-2">Mark as Best Area</label>
            <button type="button" @click="project.is_best = !project.is_best" :class="[
              'relative inline-flex h-6 w-12 items-center rounded-full transition',
              project.is_best ? 'bg-lime-700' : 'bg-gray-400'
            ]">
              <span :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white transition',
                project.is_best ? 'translate-x-6' : 'translate-x-1'
              ]" />
            </button>
          </div>

        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-white-dark" for="uploadfile">
          Upload Project Images :
        </label>

        <!-- Wrapper with border dotted -->
        <div
          class="mt-2 border-2 border-dotted border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-lime-700 transition">
          <!-- File Input -->
          <div class="relative">
            <input multiple
              class="w-full bg-white rounded-lg border px-4 py-2 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-lime-700 hover:file:bg-blue-100"
              id="uploadfile" type="file" @change="handleFileUpload" accept="image/*" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Iconfile :fill="true" />
            </span>
          </div>

          <!-- Preview Section -->
          <div v-if="projectjectDocuments.length" class="mt-4 flex flex-wrap gap-4">
            <div v-for="(document, index) in projectjectDocuments" :key="index"
              class="relative w-32 h-32 border rounded-lg overflow-hidden shadow-sm">
              <!-- Close Button -->
              <button type="button" @click="removeProjectImage(index)"
                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full text-xs hover:bg-red-600 transition"
                aria-label="Remove Image">
                ✕
              </button>
              <!-- Image Preview -->
              <img :src="document.preview" alt="Preview" class="w-full h-full object-cover" />
            </div>
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
import { AllProjects } from "../composables/useProject";
import Multiselect from "@suadelabs/vue3-multiselect";
import "@suadelabs/vue3-multiselect/dist/vue3-multiselect.css";

import { GetSingleProject } from "../composables/useProject";
import showMessage from "@/core/components/common/SweetAlert";
import LoaderIcon from "@/core/components/icon/icon-loader.vue";
import { useMeta } from '@/core/composables/use-meta';
import axios from "axios";


const amenities = ref<string[]>([]);
const newAmenity = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

function addAmenity() {
  if (newAmenity.value.trim() !== "") {
    amenities.value.push(newAmenity.value.trim());
    newAmenity.value = "";
  }
}

function checkComma(e: KeyboardEvent) {
  if (e.key === ",") {
    e.preventDefault();
    addAmenity();
  }
}


function removeAmenity(index: number) {
  amenities.value.splice(index, 1);
}



const router = useRouter();
const route = useRoute();
const isEditMode = computed(() => !!route.params.id);
useMeta({ title: `${isEditMode.value ? 'Update project' : 'Add project'} ` });
const loader = ref(false);
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);
const projectjectDocuments = ref<any>([]);
const ProjectNameOption = ref<any[]>([]);
const DeveloperNameOption = ref<any[]>([]);
const project = ref<any>({
  project_name: "",
  developer_name: "",
  location: "",
  city: "",
  area: "",
  property_type: [],
  min_price: "",
  max_price: "",
  plan_status: "",
  handover: "",
  size: "",
  category: "",
  description: "",
  is_best: false,
});

const categoryOptions = ref(["Waterfront Properties", "Near Golf Course", "Luxury Properties", "Beachfront Properties", "Branded Residences"]);
const propertyTypeOptions = ref(["Apartment", "Penthouse", "Villa", "Town House"]);


const addNewProject = (newName: string) => {
  ProjectNameOption.value.push(newName);
  project.value.project_name = newName;
};
const addNewDeveloper = (newName: string) => {
  DeveloperNameOption.value.push(newName);
  project.value.developer_name = newName;
};


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
    area: "",
    size: "",
    property_type: [],
    min_price: "",
    max_price: "",
    plan_status: "",
    handover: "",
    category: "",
    description: "",
    is_best: false,
  };
  amenities.value = [];
  $v.value.$reset();
  errorMessage.value = null;
};

watch(() => route.params.id, (newId) => {
  if (!newId) {
    resetForm();
  }
});

onMounted(async () => {
  await fetchProjects();
  const projectId = route.params.id;
  if (projectId) {
    try {
      isLoading.value = true;
      const response: any = await GetSingleProject(projectId as string);

      if (response.images && response.images.length > 0) {

        projectjectDocuments.value = response.images.map((imgUrl: string) => ({
          preview: `${import.meta.env.VITE_STORAGE_URL}${imgUrl}`,
          url: imgUrl,
        }));
      }


      project.value = {
        project_name: response.project_name,
        developer_name: response.developer_name,
        location: response.location,
        city: response.city,
        area: response.area,
        size: response.size,
        property_type: response.property_type,
        min_price: response.min_price,
        max_price: response.max_price,
        plan_status: response.plan_status,
        handover: response.handover,
        category: response.category,
        description: response.description,
        is_best: response.isBestArea,
      };
    amenities.value = response.amenities;

    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Failed to fetch project.";
    } finally {
      isLoading.value = false;
    }
  }
});


const fetchProjects = async () => {
  try {
    isLoading.value = true;
    let response: any = await AllProjects();
    ProjectNameOption.value = response.map((project: any) => project.project_name);
    DeveloperNameOption.value = response.map((project: any) => project.developer_name);

    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};
const rules = computed(() => ({
  project: {
    project_name: { required, maxLength: maxLength(255) },
    developer_name: { required, maxLength: maxLength(255) },
    location: { required, maxLength: maxLength(255) },
    city: { required, maxLength: maxLength(150) },
    area: { required, },
    size: { required, numeric },
    property_type: { required },
    min_price: { required, numeric, minValue: minValue(1) },
    max_price: { required, numeric, minValue: minValue(1), maxPriceValidator },
    plan_status: { required },
    description: { required },
    handover: { required },
  },
}));

const $v = useVuelidate(rules, { project });

const maxPriceValid = computed(() => {
  if (!project.value.min_price || !project.value.max_price) return true;
  return Number(project.value.max_price) >= Number(project.value.min_price);
});



const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      projectjectDocuments.value.push({
        preview: e.target.result,
        file: file,
      });
    };

    reader.readAsDataURL(file);
  }
};


const removeProjectImage = (index: number) => {
  projectjectDocuments.value.splice(index, 1);
};

const handleSubmit = async () => {
  $v.value.$touch();
  if (!$v.value.$invalid && maxPriceValid.value) {

    try {
      isLoading.value = true;

      const API_BASE = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("project_name", project.value.project_name);
      formData.append("developer_name", project.value.developer_name);
      formData.append("location", project.value.location);
      formData.append("city", project.value.city);
      formData.append("area", project.value.area);
      formData.append("size", project.value.size);
      formData.append("min_price", project.value.min_price);
      formData.append("max_price", project.value.max_price);
      formData.append("plan_status", project.value.plan_status);
      formData.append("handover", project.value.handover);
      formData.append("property_type", project.value.property_type);
      formData.append("category", project.value.category);
      formData.append("isBestArea", project.value.is_best);
      formData.append("description", project.value.description);
      amenities.value.forEach((item) => {
        formData.append("amenities[]", item);
      });

      projectjectDocuments.value.forEach((doc) => {
        if (doc.file) {
          formData.append("images", doc.file);
        } else if (doc.url) {
          formData.append("existingImages", doc.url);
        }
      });
      if (isEditMode.value) {
        const projectId = route.params.id;
        await axios.put(`${API_BASE}/project/${projectId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        showMessage("Project updated successfully!", "success");
      } else {
        await axios.post(`${API_BASE}/project`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        showMessage("Project added successfully!", "success");
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
