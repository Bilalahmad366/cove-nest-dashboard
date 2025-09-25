<template>
  <div v-if="isLoading">
    <SkeletonLoader :lines="6" height="100%" width="100%" borderRadius="8px" />
  </div>
  <div v-else>
    <div class="panel">
      <div class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="cols"
          :totalRows="rows?.length"
          :sortable="true"
          :search="search"
          :pageSize="15"
          :hasCheckbox="true"
          :pageSizeOptions="[15, 25, 50, 100, 'All']"
          :stickyHeader="true"
          :class="store.theme === 'dark' ? 'custom-table-dark' : 'custom-table'"
          :columnFilter="true"
          loader
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" ... />'
          lastArrow='<svg width="24" height="24" ... />'
          previousArrow='<svg width="24" height="24" ... />'
          nextArrow='<svg width="24" height="24" ... />'
        >
          <template #action="data">
            <div class="flex items-center gap-2">
              <div>
                <button @click="editVideo(data)" type="button" v-tippy:Edit>
                  <iconEdit />
                </button>
                <tippy target="Edit">Edit</tippy>
              </div>
              <div>
                <button @click="deleteVideo(data)" type="button" v-tippy:Delete>
                  <iconTrash />
                </button>
                <tippy target="Delete">Delete</tippy>
              </div>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useAppStore } from "@/core/store";
import router from "@/router";
import iconTrash from "@/core/components/icon/icon-trash.vue";
import iconEdit from "@/core/components/icon/icon-edit.vue";
import { AllVideos, DeleteVideo } from "../composables/useVideos";
import { showAlert } from "@/core/components/common/alertForDelete";
import showMessage from "@/core/components/common/SweetAlert";
import SkeletonLoader from "@/core/components/common/SkeletonLoader.vue";
import { useMeta } from "@/core/composables/use-meta";

useMeta({ title: `videos` })

onMounted(async () => {
  await fetchVideos()
})

const isLoading = ref(false)
const store = useAppStore()
const search = ref("")

const cols = ref([
  { field: "title", title: "Title", visible: true, hide: false, disabled: true },
  { field: "youtubeUrl", title: "YouTube URL", visible: true, hide: false, disabled: true },
  { field: "action", title: "Action", headerClass: "justify-center", filter: false, excludeactions: true },
])

const rows = ref<any>([])

const deleteVideo = async (data) => {
  const isConfirmed = await showAlert()
  if (isConfirmed) {
    const id = data.value._id
    try {
      isLoading.value = true
      await DeleteVideo(id)
      showMessage("Video deleted!", "success")
    } catch (error) {
      console.log(error)
      showMessage("Error!", "error")
    } finally {
      isLoading.value = false
      await fetchVideos()
    }
  }
}

const editVideo = (data: any) => {
  router.push({ name: "update-video", params: { id: data.value._id } })
}

const fetchVideos = async () => {
  try {
    isLoading.value = true
    let response: any = await AllVideos()
    rows.value = response.map((video: any) => {
      return {
        ...video,
        title: video?.videos?.[0]?.title || "N/A", 
        youtubeUrl: video?.videos?.[0]?.youtubeUrl || "N/A",
      }
    })
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
</script>
