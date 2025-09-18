<template>
  <div class="property-details">
    <h2 class="font-semibold text-lg mb-2 text-center">Details</h2>
    <div v-for="data in Propeties" :key="data._id" class="property-details">
      <h2 class="font-semibold text-lg mb-2 text-center">Property Details</h2>
      <ul class="mb-3 font-semibold">
        <h3 class="font-semibold text-lg mt-3 mb-2">
          {{ data.ownership_type }} Property
        </h3>
        <ul class="ml-5">
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Property Number: {{ data.propertyNo }}</span>
          </li>
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Property Name: {{ data.property_name }}</span>
          </li>
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Owner Name: {{ data.ownerName }}</span>
          </li>
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Address: {{ data.address }}</span>
          </li>
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Ownership Type: {{ data.ownership_type }}</span>
          </li>
          <li>
            <IconArrowLeft
              class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
            />
            <span>Property Type: {{ data.property_type }}</span>
          </li>
        </ul>

        <li>
          <h3 class="font-semibold text-lg mt-3 mb-2">Building Details</h3>
          <!-- Heading for Building Details -->
          <div class="ml-5">
            <ul>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Name: {{ data.buildingDetails.name }}</span>
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Address: {{ data.buildingDetails.address }}</span>
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Rooms: {{ data.buildingDetails.rooms }}</span>
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Kitchens: {{ data.buildingDetails.kitchens }}</span>
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Lobbies: {{ data.buildingDetails.lobbies }}</span>
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                <span>Bathrooms: {{ data.buildingDetails.bathrooms }}</span>
              </li>
            </ul>
          </div>
        </li>

        <ul>
          <h3 class="font-semibold text-lg mt-3 mb-2">Bills Details</h3>
          <div class="ml-5">
            <ul v-for="(bill, index) in data.bills" :key="index">
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                Type: {{ bill.type }}
              </li>
              <li>
                <IconArrowLeft
                  class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                />
                Account No: {{ bill.accountNo }}
              </li>
            </ul>
          </div>
        </ul>
        <li v-if="data.ownership_type === 'Rented'">
          <h3 class="font-semibold text-lg mt-3 mb-2">Contract Duration</h3>
          <div class="ml-5">
            <ul>
              <li>
                <span>
                  <IconArrowLeft
                    class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                  />
                  From: {{ formatDate(data.contractDuration.from) }}
                </span>
              </li>
              <li>
                <span>
                  <IconArrowLeft
                    class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
                  />
                  To: {{ formatDate(data.contractDuration.to) }}
                </span>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="data.ownership_type === 'Rented'">
          <IconArrowLeft
            class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
          />
          Total Amount: {{ data.totalAmount || "N/A" }}
        </li>
        <li>
          <IconArrowLeft
            class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
          />
          Created At: {{ formatDate(data.createdAt) }}
        </li>
        <li>
          <IconArrowLeft
            class="inline text-primary rtl:rotate-180 ltr:mr-2 rtl:ml-2"
          />
          Updated At: {{ formatDate(data.updatedAt) }}
        </li>
      </ul>
    </div>

    <div v-if="!loading && !Propeties.length">
      <div class="flex justify-center items-center flex-col font-semibold">
        <div class="img flex justify-center items-center">
          <img width="70%" src="/assets/images/nodata.jpeg" alt="" />
        </div>
        <div class="heading">
          <h3>No Property Available for this User</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from "vue";
import IconArrowLeft from "@/core/components/icon/icon-arrow-left.vue";
import axios from "axios";

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits();
/***************** main states**********************/
const Propeties = ref<any>([]);
const loading = ref(false);
/**************** main states**********************/
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
};
/*************** api call********************/
const allPropeties = async () => {
  try {
    let userId = props.userId;
    emit("update-loader", true);
    loading.value = true;
    let response = await axios.get(
      `${import.meta.env.VITE_API_URL}/property/${userId}`
    );
    Propeties.value = response.data.properties;
    emit("update-loader", false);
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
};
/*************** api call********************/
onMounted(async () => {
  await allPropeties();
});


</script>
