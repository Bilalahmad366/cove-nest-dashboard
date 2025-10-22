<template>
    <div class="panel max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit">
            <h1 class="text-2xl font-bold text-center my-4">
                {{ isEditMode ? "Update Developer" : "Add Developer" }}
            </h1>

            <!-- Developer Name -->
            <div>
                <label class="block font-medium">Developer Name</label>
                <input v-model="developer.name" type="text" placeholder="Enter developer name" class="form-input w-full"
                    required />
            </div>

            <!-- About -->
            <div class="mt-4">
                <label class="block font-medium">About</label>
                <textarea v-model="developer.about" rows="3" placeholder="Write something about the developer..."
                    class="form-input w-full" required />
            </div>

            <!-- Is Featured -->
            <div class="mt-4">
                <label class="block font-medium mb-1">Featured Developer?</label>
                <div class="flex gap-6 items-center">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="developer.is_featured" :value="true" />
                        <span>Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="developer.is_featured" :value="false" />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <!-- Map iFrame -->
            <div class="mt-4">
                <label class="block font-medium">Google Map iFrame</label>
                <input v-model="developer.map" type="text" placeholder="Paste Google Map iframe embed link"
                    class="form-input w-full" />
                <div v-if="developer.map" class="mt-3 rounded-lg overflow-hidden border">
                    <iframe :src="extractMapSrc(developer.map)" width="100%" height="250" style="border:0;"
                        allowfullscreen loading="lazy"></iframe>
                </div>
            </div>


            <!-- Image Upload -->
            <div class="mt-4">
                <label class="block font-medium">Developer Image</label>
                <input type="file" @change="handleImageUpload" class="form-input w-full" />

                <!-- Image Preview -->
                <div v-if="previewImage" class="relative w-40 h-40 mt-4">
                    <img :src="previewImage" alt="Preview" class="w-full h-full object-cover rounded-lg border" />
                    <button type="button" @click="removeImage"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-gradient w-full mt-6">
                <span v-if="isLoading">loading ....</span>
                <span v-else> {{ isEditMode ? "Update Developer" : "Add Developer" }}</span>
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
import { GetSingleDeveloper } from '../composables/useDeveloper'
const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);
useMeta({ title: isEditMode.value ? "Update Developer" : "Add Developer" });

const isLoading = ref(false)
const developer = ref<any>({
    name: "",
    about: "",
    image: "",
    map: "",
    is_featured: false,
});

const previewImage = ref<string | null>(null);
const selectedImage = ref<File | null>(null);

// Handle image upload preview
const handleImageUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        selectedImage.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

// Remove selected image
const removeImage = () => {
    selectedImage.value = null;
    previewImage.value = null;
};
const extractMapSrc = (iframeString: string) => {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : iframeString;
};
// Fetch single developer if in edit mode
const fetchDeveloper = async () => {

    const res: any = await GetSingleDeveloper(route.params.id);

    developer.value = {
        name: res.developer.name,
        about: res.developer.about,
        image: res.developer.image || "",
        map: res.developer.mapIframe || "",
        is_featured: res.developer.is_featured,
    };

    if (developer.value.image) {
        previewImage.value = developer.value.image?.url;
    }
};

onMounted(async () => {
    if (isEditMode.value) await fetchDeveloper();
});

// Handle submit (Add / Update)
const handleSubmit = async () => {
    try {
        const API_BASE = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("name", developer.value.name);
        formData.append("about", developer.value.about);
        formData.append("mapIframe", developer.value.map);
        formData.append("is_featured", String(developer.value.is_featured));
        if (selectedImage.value) formData.append("image", selectedImage.value);

        if (isEditMode.value) {
            isLoading.value = true;
            await axios.put(`${API_BASE}/developer/${route.params.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            isLoading.value = false;
            showMessage("Developer updated successfully!", "success");
        } else {
            isLoading.value = true;
            await axios.post(`${API_BASE}/developer`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            isLoading.value = false;
            showMessage("Developer added successfully!", "success");
        }

        router.push("/developers");
    } catch (err: any) {
        console.error(err);
        isLoading.value = false;
        showMessage(err.response?.data?.message || "error");
    }
};
</script>
