<template>
    <div class="panel max-w-3xl mx-auto">
        <form @submit.prevent="handleSubmit">
            <h1 class="text-2xl font-bold text-center my-4">
                {{ isEditMode ? "Update Area" : "Add Area" }}
            </h1>

            <!-- Area Name -->
            <div>
                <label class="block font-medium">Area Name</label>
                <input v-model="Area.name" type="text" placeholder="Enter Area name" class="form-input w-full"
                    required />
            </div>

            <!-- About -->
            <div class="mt-4">
                <label class="block font-medium">About</label>
                <textarea v-model="Area.about" rows="3" placeholder="Write something about the Area..."
                    class="form-input w-full" required />
            </div>

            <!-- Is Featured -->
            <div class="mt-4">
                <label class="block font-medium mb-1">Featured Area?</label>
                <div class="flex gap-6 items-center">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="Area.is_featured" :value="true" />
                        <span>Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="Area.is_featured" :value="false" />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <!-- Map iFrame -->
            <div class="mt-4">
                <label class="block font-medium">Google Map iFrame</label>
                <input v-model="Area.map" type="text" placeholder="Paste Google Map iframe embed link"
                    class="form-input w-full" />
                <div v-if="Area.map" class="mt-3 rounded-lg overflow-hidden border">
                    <iframe :src="extractMapSrc(Area.map)" width="100%" height="250" style="border:0;" allowfullscreen
                        loading="lazy"></iframe>
                </div>
            </div>

            <!-- Area Image -->
            <div class="mt-4">
                <label class="block font-medium">Main Area Image</label>
                <input type="file" @change="handleImageUpload" class="form-input w-full" />
                <div v-if="previewImage" class="relative w-40 h-40 mt-4">
                    <img :src="previewImage" alt="Preview" class="w-full h-full object-cover rounded-lg border" />
                    <button type="button" @click="removeImage"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">✕</button>
                </div>
            </div>

            <!-- Dynamic Content Sections -->
            <div class="mt-8">
                <h2 class="text-lg font-semibold mb-2">Content Sections</h2>

                <div v-for="(section, index) in Area.sections" :key="index"
                    class="border p-4 rounded-lg mb-4 bg-gray-50">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-medium">Section {{ index + 1 }}</h3>
                        <button type="button" @click="removeSection(index)"
                            class="text-red-500 text-sm hover:underline">Remove</button>
                    </div>

                    <label class="block font-medium">Heading</label>
                    <input v-model="section.heading" type="text" placeholder="Section heading"
                        class="form-input w-full" />

                    <label class="block font-medium mt-3">Paragraph</label>
                    <textarea v-model="section.paragraph" rows="3" placeholder="Write details..."
                        class="form-input w-full" />

                    <label class="block font-medium mt-3">Image (optional)</label>
                    <input type="file" @change="(e) => handleSectionImage(e, index)" class="form-input w-full" />
                    <div v-if="section.preview" class="relative w-40 h-40 mt-2">
                        <img :src="section.preview" class="w-full h-full object-cover rounded-lg border" />
                        <button type="button" @click="removeSectionImage(index)"
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">✕</button>
                    </div>
                </div>

                <button type="button" @click="addSection"
                    class="mt-3 bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700">
                    + Add Section
                </button>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-gradient w-full mt-6">
                <span v-if="isLoading">loading ....</span>
                <span v-else>{{ isEditMode ? "Update Area" : "Add Area" }}</span>
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import showMessage from "@/core/components/common/SweetAlert";
import { useMeta } from "@/core/composables/use-meta";
import { GetSingleArea } from "../composables/useArea";

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);
useMeta({ title: isEditMode.value ? "Update Area" : "Add Area" });

const isLoading = ref(false);
const Area = ref<any>({
    name: "",
    about: "",
    image: "",
    map: "",
    is_featured: false,
    sections: [],
});

const previewImage = ref<string | null>(null);
const selectedImage = ref<File | null>(null);

// IMAGE HANDLERS
const handleImageUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        selectedImage.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};
const removeImage = () => {
    selectedImage.value = null;
    previewImage.value = null;
};

// SECTIONS HANDLERS
const addSection = () => Area.value.sections.push({ heading: "", paragraph: "", image: null, preview: null });
const removeSection = (index: number) => Area.value.sections.splice(index, 1);
const handleSectionImage = (e: Event, index: number) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        Area.value.sections[index].image = file;
        Area.value.sections[index].preview = URL.createObjectURL(file);
    }
};
const removeSectionImage = (index: number) => {
    Area.value.sections[index].image = null;
    Area.value.sections[index].preview = null;
};

// MAP IFRAME
const extractMapSrc = (iframeString: string) => {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : iframeString;
};

// FETCH AREA
const fetchArea = async () => {
    const res: any = await GetSingleArea(route.params.id);
    console.log(res)
    Area.value = {
        name: res.area.name,
        about: res.area.about,
        image: res.area.image,
        map: res.area.mapIframe || "",
        is_featured: res.area.is_featured,
        sections: res.area.sections || [],
    };
    if (Area.value.image) previewImage.value = Area.value.image?.url;
     Area.value.sections.forEach((section: any, index: number) => {
    if (section.image) {
      // backend se aane wali image URL ko preview me set kar do
      section.preview = section.image.url; 
    }
  });
};
onMounted(async () => { if (isEditMode.value) await fetchArea(); });

// SUBMIT
const handleSubmit = async () => {
    try {
        const API_BASE = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", Area.value.name);
        formData.append("about", Area.value.about);
        formData.append("mapIframe", Area.value.map);
        formData.append("is_featured", String(Area.value.is_featured));
        if (selectedImage.value) formData.append("image", selectedImage.value);
        // sections data JSON string
        formData.append("sections", JSON.stringify(
            Area.value.sections.map(s => ({ heading: s.heading, paragraph: s.paragraph }))
        ));

        // section images separately
        Area.value.sections.forEach((section, i) => {
            if (section.image) formData.append(`section_images`, section.image);
        });

        isLoading.value = true;
        const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

        if (isEditMode.value) {
            await axios.put(`${API_BASE}/area/${route.params.id}`, formData, config);
            showMessage("Area updated successfully!", "success");
        } else {
            await axios.post(`${API_BASE}/area`, formData, config);
            showMessage("Area added successfully!", "success");
        }

        isLoading.value = false;
        router.push("/areas");
    } catch (err: any) {
        console.error(err);
        isLoading.value = false;
        showMessage(err.response?.data?.message || "Error occurred");
    }
};
</script>

<style scoped>
iframe {
    border-radius: 0.5rem;
}
</style>
