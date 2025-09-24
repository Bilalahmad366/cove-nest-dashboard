<template>
    <div v-if="isLoading">
        <SkeletonLoader :lines="6" height="100%" width="100%" borderRadius="8px" />
    </div>
    <div v-else>
        <div class="panel">
            <!-- data table -->
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
                                <button @click="editNews(data)" type="button" v-tippy:Edit>
                                    <iconEdit />
                                </button>
                                <tippy target="Edit">Edit</tippy>
                            </div>
                            <div>
                                <button @click="deleteNews(data)" type="button" v-tippy:Delete>
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
import { AllNews, DeleteNews } from "../composables/useNews"; // 👈 news composable
import { showAlert } from "@/core/components/common/alertForDelete";
import showMessage from "@/core/components/common/SweetAlert";
import SkeletonLoader from "@/core/components/common/SkeletonLoader.vue";
import { useMeta } from '@/core/composables/use-meta';

useMeta({ title: `news` });

onMounted(async () => {
    await fetchNews();
});

const isLoading = ref(false);
const store = useAppStore();
const search = ref("");

const cols = ref([
    { field: "title", title: "Title", visible: true, hide: false, disabled: true },
    { field: "date", title: "Date", visible: true, hide: false, disabled: true },
    { field: "action", title: "Action", headerClass: "justify-center", filter: false, excludeactions: true },
]);

const rows = ref<any>([]);

const deleteNews = async (data) => {
    const isConfirmed = await showAlert();
    if (isConfirmed) {
        const id = data.value._id;
        try {
            isLoading.value = true;
            await DeleteNews(id);
            showMessage("News deleted !", "success");
        } catch (error) {
            console.log(error);
            showMessage("Error !", "error");
        } finally {
            isLoading.value = false;
            await fetchNews();
        }
    }
};

const editNews = async (data: any) => {
    router.push({ name: 'update-news', params: { id: data.value._id } });
};

const fetchNews = async () => {
    try {
        isLoading.value = true;
        let response: any = await AllNews();
        rows.value = response.map((news: any) => {
            return {
                ...news,
                date: news.date ? news.date.split("T")[0] : "N/A", // 👈 format date
            };
        });
        isLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};
</script>
