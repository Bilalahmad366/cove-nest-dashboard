<template>
  <div v-if="isLoading">
    <SkeletonLoader :lines="6" height="100%" width="100%" borderRadius="8px" />
  </div>
  <div v-else>
    <div class="panel">
      <!-- export table -->
      <div class="flex justify-end my-2">
        <button
          type="button"
          class="btn btn-primary btn-sm m-1"
          @click="exportTable('csv')"
        >
          <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          CSV
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm m-1"
          @click="backToLogin()"
        >
          <icon-file class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
          Back to login
        </button>
      </div>
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
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #details="data">
            <div>
              <button @click="userDetail(data)" class="btn btn-gradient">
                Details
              </button>
            </div>
          </template>

          <template #action="data">
            <div class="flex items-center gap-2">
              <div>
                <button @click="editUser(data)" type="button" v-tippy:Edit>
                  <iconEdit />
                </button>
                <tippy target="Edit">Edit</tippy>
              </div>
              <div>
                <button @click="deleteUser(data)" type="button" v-tippy:Delete>
                  <iconTrash />
                </button>
                <tippy target="Delete">Delete</tippy>
              </div>
            </div>
          </template>
        </vue3-datatable>

        <TransitionRoot appear :show="detailsModal" as="template">
          <Dialog as="div" @close="detailsModal = false" class="relative z-50">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full items-start justify-center px-4 py-8">
                <DialogPanel
                  class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark animate__animated animate__fadeInUp"
                >
                  <button
                    type="button"
                    class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    @click="detailsModal = false"
                  >
                    <iconCross />
                  </button>

                  <div class="p-5">
                    <viewUserDetailComponent
                      :userId="userId"
                      @update-loader="setLoader"
                    />
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
        <!-- Modal -->
        <TransitionRoot appear :show="editUserModal" as="template">
          <Dialog as="div" @close="editUserModal = false" class="relative z-50">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full items-start justify-center px-4 py-8">
                <DialogPanel
                  class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark animate__animated animate__fadeInUp"
                >
                  <button
                    type="button"
                    class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    @click="editUserModal = false"
                  >
                    <iconCross />
                  </button>

                  <div class="p-5">
                    <editUserComponent
                      :data="exisitingData"
                      @close="handleClose"
                    />
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/core/store/index";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogOverlay,
} from "@headlessui/vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import iconTrash from "@/core/components/icon/icon-trash.vue";
import iconEdit from "@/core/components/icon/icon-edit.vue";
import iconCross from "@/core/components/icon/icon-x-circle.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { showAlert } from "@/core/components/common/alertForDelete";
import showMessage from "@/core/components/common/SweetAlert";
import SkeletonLoader from "@/core/components/common/SkeletonLoader.vue";
import editUserComponent from "@/core/views/editUserComponent.vue";
import viewUserDetailComponent from "@/core/views/viewUserDetailComponent.vue";
import { useRouter } from "vue-router";
const store = useAppStore();
const router = useRouter();

/***************** main states**********************/
const exisitingData = ref({});
const userId = ref("");
const editUserModal = ref(false);
const loader = ref(false);
const detailsModal = ref(false);
const isLoading = ref(false);
const search = ref("");
const cols = ref([
  { field: "name", title: "Name", visible: true, hide: false, disabled: true },
  {
    field: "email",
    title: "Email",
    visible: true,
    hide: false,
    disabled: true,
  },
  {
    field: "details",
    title: "details",
    headerClass: "justify-center",
    filter: false,
    excludeactions: true,
  },
  {
    field: "action",
    title: "Action",
    headerClass: "justify-center",
    filter: false,
    excludeactions: true,
  },
]);
const rows = ref([]);
let baseUrl = import.meta.env.VITE_API_URL;
let token = localStorage.getItem("token");
/**************** main states**********************/
/**************** Export **********************/
const exportTable = (type) => {
  let columns: any = cols.value.map((d) => {
    return d.field;
  });

  let records = rows.value;
  let filename = "table";

  let newVariable: any;
  newVariable = window.navigator;

  if (type == "csv") {
    let coldelimiter = ";";
    let linedelimiter = "\n";
    let result = columns
      .map((d) => {
        return capitalize(d);
      })
      .join(coldelimiter);
    result += linedelimiter;
    records.map((item) => {
      columns.map((d: any, index) => {
        if (index > 0) {
          result += coldelimiter;
        }
        let val = item[d] ? item[d] : "";
        result += val;
      });
      result += linedelimiter;
    });

    if (result == null) return;
    if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
      var data =
        "data:application/csv;charset=utf-8," + encodeURIComponent(result);
      var link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", filename + ".csv");
      link.click();
    } else {
      var blob = new Blob([result]);
      if (newVariable.msSaveOrOpenBlob) {
        newVariable.msSaveBlob(blob, filename + ".csv");
      }
    }
  }
};

const capitalize = (text) => {
  return text
    .replace("_", " ")
    .replace("-", " ")
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

/**************** Export **********************/
/**************** Actions  **********************/
const userDetail = (data) => {
  detailsModal.value = true;
  userId.value = data.value._id;
  console.log(userId.value);
};
const editUser = (data) => {
  editUserModal.value = true;
  exisitingData.value = data.value;
};
const setLoader = async (value) => {
  loader.value = value;
};
const deleteUser = async (data) => {
  const isConfirmed = await showAlert();
  if (isConfirmed) {
    const id: any = data.value._id;
    try {
      isLoading.value = true;
      await axios.delete(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id }, // Correct way to send data in a DELETE request
      });
      showMessage("user deleted !", "success");
    } catch (error) {
      console.log(error);
      showMessage("Error !", "error");
    } finally {
      await fetchUsers();
      isLoading.value = false;
    }
  }
};

const handleClose = () => {
  editUserModal.value = false;
};
const backToLogin = () => {
  store.setIsAdmin(false);
  router.push("/");
};
/**************** Actions   **********************/
/*************** api call********************/
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    let response = await axios.get(`${baseUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("data", response);
    rows.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

/*************** api call********************/
onMounted(async () => {
  await fetchUsers();
});
</script>
