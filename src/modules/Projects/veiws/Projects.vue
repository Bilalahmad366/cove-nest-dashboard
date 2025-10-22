<template>
    <div v-if="isLoading">
        <SkeletonLoader :lines="6" height="100%" width="100%" borderRadius="8px" />
    </div>
    <div v-else>
        <div class="panel">

            <!-- data table -->
            <div class="datatable">
                <vue3-datatable :rows="rows" :columns="cols" :totalRows="rows?.length" :sortable="true" :search="search"
                    :pageSize="15" :hasCheckbox="true" :pageSizeOptions="[15, 25, 50, 100, 'All']" :stickyHeader="true"
                    :class="store.theme === 'dark' ? 'custom-table-dark' : 'custom-table'" :columnFilter="true" loader
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'>

                    <template #action="data">
                        <div class="flex items-center gap-2">
                            <div>
                                <button @click="editProject(data)" type="button" v-tippy:Edit>
                                    <iconEdit />
                                </button>
                                <tippy target="Edit">Edit</tippy>
                            </div>
                            <div>
                                <button @click="deleteProject(data)" type="button" v-tippy:Delete>
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
import { AllProjects, DeleteProject, Info } from "../composables/useProject";
import { showAlert } from "@/core/components/common/alertForDelete";
import showMessage from "@/core/components/common/SweetAlert";
import SkeletonLoader from "@/core/components/common/SkeletonLoader.vue";
import { useMeta } from '@/core/composables/use-meta';
useMeta({ title: `projects` });
onMounted(async () => {
    await fetchProjects();
});

const isLoading = ref(false);
const store = useAppStore();
const search = ref("");
const cols = ref([
    { field: "project_name", title: "Project Name", visible: true, hide: false, disabled: true },
    { field: "developer.label", title: "Developer Name", visible: true, hide: false, disabled: true },
    { field: "area.label", title: "Area", visible: true, hide: false, disabled: true },
    { field: "location", title: "Location", visible: true, hide: false, disabled: true },
    { field: "city", title: "City", visible: true, hide: false, disabled: true },
    { field: "size", title: "Size (sq ft)", visible: true, hide: false, disabled: true },
    { field: "property_type", title: "Property Type", visible: true, hide: false, disabled: true },
    { field: "min_price", title: "Min Price", visible: true, hide: false, disabled: true },
    { field: "max_price", title: "Max Price", visible: true, hide: false, disabled: true },
    { field: "plan_status", title: "Plan Status", visible: true, hide: false, disabled: true },
    { field: "handover", title: "Handover Period", visible: true, hide: false, disabled: true, filter: false },
    { field: "action", title: "Action", headerClass: "justify-center", filter: false, excludeactions: true, },
]);
const rows = ref<any>([]);

const deleteProject = async (data) => {
    const isConfirmed = await showAlert();
    if (isConfirmed) {
        const id = data.value._id;
        try {
            isLoading.value = true;
            await DeleteProject(id);
            showMessage("project deleted !", "success");
        } catch (error) {
            console.log(error);
            showMessage("Error !", "error");
        } finally {
            isLoading.value = false;
            await fetchProjects();
        }
    }
};

const editProject = async (data: any) => {
    router.push({ name: 'update-project', params: { id: data.value._id } });
};


const fetchProjects = async () => {
    try {
        isLoading.value = true;
        let response: any = await AllProjects();
        const projectsWithDetails = await Promise.all(
            response.map(async (project: any) => {
                try {
                    const data = {
                        developerId: project.developer,
                        areaId: project.area
                    }
                    const infoRes:any = await Info(data);
                    return {
                        ...project,
                        developer: {
                            label: infoRes.developer.name,
                        },
                        area: {
                            label: infoRes.area.name,
                        },
                    };
                } catch (error) {
                    console.error("Error fetching info:", error);
                    return project;
                }
            })
        );

        rows.value = projectsWithDetails;

        // rows.value = response.map((project: any) => {
        //     return {
        //         ...project,

        //     };
        // });
        isLoading.value = false;
    } catch (error) {
        console.log(error);
    }
};
</script>
