<template>
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="text-center">
                <h1 class="text-3xl font-extrabold text-gray-800">
                    {{ isEditMode ? "Update FAQs" : "Add FAQs" }}
                </h1>
                <p class="text-gray-500 mt-2">Manage your FAQs collection easily</p>
            </div>

            <!-- Input Fields -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">Question</label>
                        <input v-model="newFaq.question" type="text" placeholder="Enter question"
                            class="form-input w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">Answer</label>
                        <input v-model="newFaq.answer" type="text" placeholder="Enter answer"
                            class="form-input w-full" />
                    </div>
                </div>

                <div class="flex justify-end mt-3">
                    <button type="button" @click="saveFaq" class="btn btn-gradient">
                        {{ editIndex !== null ? "Update FAQ" : "+ Add FAQ" }}
                    </button>
                </div>
            </div>

            <!-- FAQ List -->
            <div v-if="form.faqs.length > 0" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Added FAQs</h2>
                <div class="grid grid-cols-1 gap-6">
                    <div v-for="(faq, index) in form.faqs" :key="index"
                        class="bg-gray-100 border rounded-lg shadow-sm p-4 flex justify-between items-start">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-800"><strong> Question : </strong> {{
                                faq.question }}</h3>
                            <p class="text-sm text-gray-600"> <strong> Answer : </strong> {{ faq.answer }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button @click="editFaq(index)" type="button" v-tippy:Edit>
                                <iconEdit />
                            </button>
                            <tippy target="Edit">Edit</tippy>
                            <button @click="removeFaq(index)" type="button" v-tippy:Delete>
                                <iconTrash />
                            </button>
                            <tippy target="Delete">Delete</tippy>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit -->
            <div>
                <button type="submit" class="w-full py-3 btn-gradient">
                    {{ isEditMode ? "Update FAQs" : "Add FAQs" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "@/core/composables/use-meta";
import axios from "axios";
import showMessage from "@/core/components/common/SweetAlert";
import iconTrash from "@/core/components/icon/icon-trash.vue";
import iconEdit from "@/core/components/icon/icon-edit.vue";

const route = useRoute()
const router = useRouter()
const isEditMode = computed(() => !!route.params.id)
useMeta({ title: isEditMode.value ? "Update FAQs" : "Add FAQs" })

const form = ref<any>({ faqs: [] })
const newFaq = ref<any>({ question: "", answer: "" })
const editIndex = ref<number | null>(null)

// Save (Add/Update)
const saveFaq = () => {
    if (!newFaq.value.question || !newFaq.value.answer) return
    if (editIndex.value !== null) {
        form.value.faqs[editIndex.value] = { ...newFaq.value }
        editIndex.value = null
    } else {
        form.value.faqs.push({ ...newFaq.value })
    }
    newFaq.value = { question: "", answer: "" }
}

const editFaq = (index: number) => {
    newFaq.value = { ...form.value.faqs[index] }
    editIndex.value = index
}

const removeFaq = (index: number) => {
    form.value.faqs.splice(index, 1)
    if (editIndex.value === index) {
        newFaq.value = { question: "", answer: "" }
        editIndex.value = null
    }
}

const resetForm = () => {
    form.value = { faqs: [] }
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const token = localStorage.getItem("token")
      const res: any = await axios.get(
        `${import.meta.env.VITE_API_URL}/faq/${route.params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res?.data?.faqs) {
        form.value = { faqs: res.data.faqs || [] }
      }
    } catch (err) {
      console.error(err)
    }
  }
})


watch(
    () => route.params.id,
    (newId) => {
        if (!newId) resetForm()
    }
)

const handleSubmit = async () => {
    try {
        const API_BASE = import.meta.env.VITE_API_URL
        const token = localStorage.getItem("token")
        if (isEditMode.value) {
            await axios.put(`${API_BASE}/faq/${route.params.id}`, form.value, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showMessage("FAQs updated successfully!", "success")
        } else {
            await axios.post(`${API_BASE}/faq`, form.value, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showMessage("FAQs added successfully!", "success")
        }
        router.push("/faq")
    } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || "Request failed")
    }
}
</script>
