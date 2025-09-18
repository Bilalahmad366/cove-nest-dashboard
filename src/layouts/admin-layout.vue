<template>
  <!--  BEGIN MAIN CONTAINER  -->
  <div class="relative">
    <div class="main-content flex flex-col min-h-screen">
      <div class="p-6 animation">
        <router-view></router-view>
      </div>
      <!--  END CONTENT AREA  -->

      <!-- BEGIN FOOTER -->
      <Footer />
      <!-- END FOOTER -->
    </div>
  </div>
</template>
<script setup lang="ts">
import Footer from "@/core/components/layout/Footer.vue";
</script>
