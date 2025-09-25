<template>
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="text-center">
                <h1 class="text-3xl font-extrabold text-gray-800">
                    {{ isEditMode ? "Update Videos" : "Add Videos" }}
                </h1>
                <p class="text-gray-500 mt-2">Manage your YouTube videos collection easily</p>
            </div>

            <!-- Input Fields -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">Video Title</label>
                        <input v-model="newVideo.title" type="text" placeholder="Enter video title"
                            class="form-input w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">YouTube URL</label>
                        <input v-model="newVideo.youtubeUrl" type="text" placeholder="https://youtube.com/..."
                            class="form-input w-full" />
                    </div>
                </div>

                <div class="flex justify-end mt-3">
                    <button type="button" @click="saveVideo" class="btn btn-gradient">
                        {{ editIndex !== null ? "Update Video" : "+ Add Video" }}
                    </button>
                </div>
            </div>

            <!-- Preview Section -->
            <div v-if="form.videos.length > 0" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Added Videos</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(video, index) in form.videos" :key="index"
                        class="bg-gray-100 border rounded-lg shadow-sm overflow-hidden">

                        <div class="aspect-w-16 aspect-h-9 bg-black">
                            <iframe :src="getYoutubeEmbed(video.youtubeUrl)" class="w-full h-full" frameborder="0"
                                allowfullscreen></iframe>
                        </div>

                        <div class="p-3 flex justify-between items-center">
                            <h3 class="text-sm font-medium text-gray-800">{{ video.title }}</h3>
                            <div class="flex items-center gap-2">
                                <div>
                                    <button @click="editVideo(index)" type="button" v-tippy:Edit>
                                        <iconEdit />
                                    </button>
                                    <tippy target="Edit">Edit</tippy>
                                </div>
                                <div>
                                    <button @click="removeVideo(index)" type="button" v-tippy:Delete>
                                        <iconTrash />
                                    </button>
                                    <tippy target="Delete">Delete</tippy>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit -->
            <div>
                <button type="submit" class="w-full py-3 btn-gradient">
                    {{ isEditMode ? "Update Videos" : "Add Videos" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import showMessage from "@/core/components/common/SweetAlert"
import { useMeta } from "@/core/composables/use-meta";
import { GetSingleVideo } from '../composables/useVideos';
import iconTrash from "@/core/components/icon/icon-trash.vue";
import iconEdit from "@/core/components/icon/icon-edit.vue";

const route = useRoute()
const router = useRouter()
const isEditMode = computed(() => !!route.params.id)
useMeta({ title: isEditMode.value ? "Update Videos" : "Add Videos" });

const form = ref<any>({ videos: [] })
const newVideo = ref<any>({ title: "", youtubeUrl: "" })
const editIndex = ref<number | null>(null) // track editing video

// Save (Add/Update)
const saveVideo = () => {
    if (!newVideo.value.title || !newVideo.value.youtubeUrl) return
    if (editIndex.value !== null) {
        form.value.videos[editIndex.value] = { ...newVideo.value }
        editIndex.value = null
    } else {
        form.value.videos.push({ ...newVideo.value })
    }
    newVideo.value = { title: "", youtubeUrl: "" }
}

const editVideo = (index: number) => {
    newVideo.value = { ...form.value.videos[index] }
    editIndex.value = index
}

const removeVideo = (index: number) => {
    form.value.videos.splice(index, 1)
    if (editIndex.value === index) {
        newVideo.value = { title: "", youtubeUrl: "" }
        editIndex.value = null
    }
}

const resetForm = () => {
    form.value = { videos: [] }
}

onMounted(async () => {
    if (isEditMode.value) {
        try {
            const res: any = await GetSingleVideo(route.params.id);
            if (res && res.videos) {
                form.value = { videos: res.videos || [] };
            }
        } catch (err) {
            console.error(err);
        }
    }
});

watch(() => route.params.id, (newId) => {
    if (!newId) resetForm()
})

const getYoutubeEmbed = (url: string) => {
    try {
        const videoId = new URL(url).searchParams.get("v")
        return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
    } catch {
        return ""
    }
}

const handleSubmit = async () => {
    try {
        const API_BASE = import.meta.env.VITE_API_URL
        const token = localStorage.getItem("token")
        if (isEditMode.value) {
            await axios.put(`${API_BASE}/videos/${route.params.id}`, form.value, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showMessage("Videos updated successfully!", "success")
        } else {
            await axios.post(`${API_BASE}/videos`, form.value, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showMessage("Videos added successfully!", "success")
        }
        router.push("/videos")
    } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || "Request failed")
    }
}
</script>
