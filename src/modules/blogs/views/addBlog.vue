<template>
  <div class="panel">
    <form @submit.prevent="handleSubmit">
      <h1 class="text-2xl font-bold text-center my-4">
        {{ isEditMode ? "Update Blog" : "Add Blog" }}
      </h1>

      <!-- Title -->
      <div>
        <label class="block font-medium">Title</label>
        <input v-model="blog.title" type="text" class="form-input w-full" />
      </div>

      <!-- Description -->
      <div class="mt-4">
        <label class="block font-medium">Description</label>
        <textarea v-model="blog.description" rows="3" class="form-input w-full" />
      </div>

      <!-- Date -->
      <div class="mt-4">
        <label class="block font-medium">Date</label>
        <input v-model="blog.date" type="date" class="form-input w-full" />
      </div>

      <!-- ====================== Table of Contents ====================== -->
      <div class="mt-6">
        <h2 class="text-lg font-bold">Table of Contents</h2>
        <div v-for="(toc, index) in blog.tableOfContents" :key="index" class="flex gap-2 mt-2">
          <input v-model="toc.title" @input="syncSections" type="text" placeholder="TOC Title"
            class="form-input flex-1" />
          <button type="button" @click="removeTOC(index)" class="btn bg-red-500 text-white">
            ✕
          </button>
        </div>
        <button type="button" @click="addTOC" class="btn btn-gradient my-2">
          + Add TOC
        </button>
      </div>

      <!-- ====================== Sections (Auto from TOC) ====================== -->
      <div class="mt-6" v-if="blog.sections.length">
        <h2 class="text-lg font-bold mb-2">Sections</h2>

        <div v-for="(section, sIndex) in blog.sections" :key="sIndex" class="border p-4 mt-4 rounded-md bg-gray-50">
          <!-- Title (readonly from TOC) -->
          <div>
            <label class="block font-medium">Section Title (from TOC)</label>
            <input v-model="section.title" type="text" readonly class="form-input w-full bg-gray-200" />
          </div>

          <!-- 2 Columns Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      

            <!-- Project Select (per section) -->
            <div>
              <label class="block font-medium">Select Project</label>
              <select v-model="section.projectRef.projectId" class="form-select w-full">
                <option value="">-- Select Project --</option>
                <option v-for="p in projects" :key="p._id" :value="p._id">
                  {{ p.project_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Connectivity -->
          <div class="mt-4">
            <h3 class="font-medium">Connectivity</h3>
            <div v-for="(c, cIndex) in section.connectivity" :key="cIndex" class="flex gap-2 mt-2">
              <input v-model="section.connectivity[cIndex]" type="text" placeholder="Connectivity"
                class="form-input flex-1" />
              <button type="button" @click="removeConnectivity(sIndex, cIndex)" class="btn bg-red-500 text-white">
                ✕
              </button>
            </div>
            <button type="button" @click="addConnectivity(sIndex)" class="btn btn-gradient my-2">
              + Add Connectivity
            </button>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn btn-gradient w-full mt-6">
        {{ isEditMode ? "Update Blog" : "Add Blog" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { GetSingleBlog } from "../composables/useBlogs";
import axios from "axios";
import showMessage from "@/core/components/common/SweetAlert";
import { useMeta } from "@/core/composables/use-meta";
const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);
useMeta({ title: isEditMode.value ? "Update Blog" : "Add Blog" });
const blog = ref<any>({
  title: "",
  description: "",
  date: "",
  tableOfContents: [],
  sections: [],
});

const projects = ref<any[]>([]);

const addTOC = () => {
  blog.value.tableOfContents.push({ title: "" });
  syncSections();
};
const removeTOC = (i: number) => {
  blog.value.tableOfContents.splice(i, 1);
  syncSections();
};

const syncSections = () => {
  blog.value.sections = blog.value.tableOfContents.map((toc, index) => {
    const oldSection = blog.value.sections[index] || {};
    return {
      title: toc.title,
      projectRef: { projectId: oldSection.projectRef?.projectId || "" },
      connectivity: oldSection.connectivity || [],
    };
  });
};

const addConnectivity = (sIndex: number) =>
  blog.value.sections[sIndex].connectivity.push("");
const removeConnectivity = (sIndex: number, cIndex: number) =>
  blog.value.sections[sIndex].connectivity.splice(cIndex, 1);

const fetchProjects = async () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/project`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  projects.value = res.data;
};

onMounted(async () => {
  await fetchProjects();

  if (isEditMode.value) {
    try {
      const response: any = await GetSingleBlog(route.params.id);

      blog.value = {
        title: response.title,
        description: response.description,
        date: response.date?.split("T")[0] || "",
        tableOfContents: response.tableOfContents || [],
        sections: (response.sections || []).map((s: any) => ({
          ...s,
          projectRef: {
            projectId: typeof s.projectRef?.projectId === "object"
              ? s.projectRef.projectId._id // agar populate hua hai
              : s.projectRef?.projectId || ""
          },
        })),
      };

      if (!blog.value.sections.length && blog.value.tableOfContents.length) {
        syncSections();
      }
    } catch (err: any) {
      console.log(err);
    }
  }
});

const resetForm = () => {
  blog.value = {
    title: "",
    description: "",
    date: "",
    tableOfContents: [],
    sections: [],
  };
};

watch(
  () => route.params.id,
  (newId) => {
    if (!newId) {
      resetForm();
    }
  }
);

const handleSubmit = async () => {
  try {
    const API_BASE = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const payload = {
      ...blog.value,
      sections: blog.value.sections,
    };

    if (isEditMode.value) {
      await axios.put(`${API_BASE}/blog/${route.params.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Blog updated successfully!", "success");
    } else {
      await axios.post(`${API_BASE}/blog`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Blog added successfully!", "success");
    }

    router.push("/blogs");
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Request failed");
  }
};
</script>
