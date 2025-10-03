<template>
    <div class="panel">
        <form @submit.prevent="handleSubmit">
            <h1 class="text-2xl font-bold text-center my-2">
                {{ isEditMode ? "Update News" : "Add News" }}
            </h1>

            <div class="space-y-4">
                <!-- Title -->
                <div :class="{ 'has-error': $v.news.title.$error }">
                    <label class="block text-sm font-medium text-white-dark">Title</label>
                    <input v-model.trim="$v.news.title.$model" type="text" placeholder="Enter News Title"
                        class="form-input placeholder:text-white-dark" />
                    <p v-if="$v.news.title.$error" class="text-danger mt-1">
                        {{ $v.news.title.$errors[0].$message }}
                    </p>
                </div>

                <!-- Description -->
                <div :class="{ 'has-error': $v.news.description.$error }">
                    <label class="block text-sm font-medium text-white-dark">Description</label>
                    <textarea v-model.trim="$v.news.description.$model as string" placeholder="Enter Description"
                        rows="4" class="form-input placeholder:text-white-dark resize-none" />
                    <p v-if="$v.news.description.$error" class="text-danger mt-1">
                        {{ $v.news.description.$errors[0].$message }}
                    </p>
                </div>

                <!-- Date -->
                <div :class="{ 'has-error': $v.news.date.$error }">
                    <label class="block text-sm font-medium text-white-dark">Date</label>
                    <input v-model.trim="$v.news.date.$model" type="date" class="form-input" />
                    <p v-if="$v.news.date.$error" class="text-danger mt-1">
                        {{ $v.news.date.$errors[0].$message }}
                    </p>
                </div>

                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-white-dark">Upload Image</label>
                    <div
                        class="mt-2 border-2 border-dotted border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-lime-700 transition">

                        <input id="uploadfile" type="file" @change="handleFileUpload" accept="image/*" class="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100" />

                        <!-- Preview -->
                        <div v-if="newsImage" class="mt-4 relative w-32 h-32 border rounded-lg overflow-hidden">
                            <button type="button" @click="removeImage"
                                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                ✕
                            </button>
                            <img :src="newsImage.preview" alt="Preview" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div class="mt-2" v-if="errorMessage">
                <div class="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                    <span class="text-red-400">
                        <strong class="mr-1">Error!</strong>{{ errorMessage }}
                    </span>
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit"
                class="btn btn-gradient !mt-4 w-full uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                <span v-if="!loader">{{ isEditMode ? "Save" : "Add News" }}</span>
                <div v-else class="flex justify-center">
                    <LoaderIcon class="animate-spin h-5 w-5 text-white" />
                </div>
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { GetSingleNews } from '../composables/useNews';
import LoaderIcon from "@/core/components/icon/icon-loader.vue";
import showMessage from "@/core/components/common/SweetAlert";
import axios from "axios";
import { useMeta } from "@/core/composables/use-meta";

const router = useRouter();
const route = useRoute();
const isEditMode = computed(() => !!route.params.id);

useMeta({ title: isEditMode.value ? "Update News" : "Add News" });

const loader = ref(false);
const errorMessage = ref<string | null>(null);

const news = ref<any>({
    title: "",
    description: "",
    date: "",
});
const newsImage = ref<any>(null);

const rules = computed(() => ({
    news: {
        title: { required, maxLength: maxLength(255) },
        description: { required },
        date: { required },
    },
}));
const $v = useVuelidate(rules, { news });

const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            newsImage.value = { preview: e.target.result, file };
        };
        reader.readAsDataURL(file);
    }
};
const removeImage = () => {
    newsImage.value = null;
};


onMounted(async () => {
    if (isEditMode.value) {
        try {
            const response: any = await GetSingleNews(route.params.id);
            news.value = {
                title: response.title,
                description: response.description,
                date: response.date ? response.date.split("T")[0] : "",
            };
            if (response.image) {
                newsImage.value = {
                    // preview: `${import.meta.env.VITE_STORAGE_URL}${response.image}`, local
                    preview: response.image,
                    url: response.image,
                };
            }
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || "Failed to fetch news.";
        }
    }
});

const resetForm = () => {
    news.value = {
        title: "",
        description: "",
        date: "",
    };
    newsImage.value = null;
    $v.value.$reset();
    errorMessage.value = null;
};

watch(() => route.params.id, (newId) => {
    if (!newId) {
        resetForm();
    }
});
const handleSubmit = async () => {
    $v.value.$touch();
    if ($v.value.$invalid) return;

    try {
        loader.value = true;
        const API_BASE = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("title", news.value.title);
        formData.append("description", news.value.description);
        formData.append("date", news.value.date);

        if (newsImage.value?.file) {
            formData.append("image", newsImage.value.file);
        } else if (newsImage.value?.url) {
            formData.append("existingImage", newsImage.value.url);
        }

        if (isEditMode.value) {
            await axios.put(`${API_BASE}/news/${route.params.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
            showMessage("News updated successfully!", "success");
        } else {
            await axios.post(`${API_BASE}/news`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
            showMessage("News added successfully!", "success");
        }

        router.push("/news");
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Request failed";
    } finally {
        loader.value = false;
    }
};


</script>
