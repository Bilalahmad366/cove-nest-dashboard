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
                 
                </vue3-datatable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useAppStore } from "@/core/store";
import { useMeta } from "@/core/composables/use-meta";
import axios from "axios";
useMeta({ title: `expert requests` });

onMounted(async () => {
    await fetchBlogs();
});

const isLoading = ref(false);
const store = useAppStore();
const search = ref("");

const cols = ref([
    { field: "name", title: "Name", visible: true, hide: false, disabled: true },
    { field: "email", title: "Email", visible: true, hide: false, disabled: true },
    { field: "message", title: "Message", visible: true, hide: false, disabled: true },
    { field: "mobile_no", title: "Phone", visible: true, hide: false, disabled: true },
]);

const rows = ref<any>([]);


const fetchBlogs = async () => {
    try {
        isLoading.value = true;
        let response: any = await axios.get(`${import.meta.env.VITE_API_URL}/experts`)
        rows.value = response.data;
        isLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};
</script>
