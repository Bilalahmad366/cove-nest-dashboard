<template>
    <div
        class="main-section antialiased relative font-nunito text-sm font-normal"
        :class="[store.sidebar ? 'toggle-sidebar' : '', store.menu, store.layout, store.rtlClass]"
    >
        <component v-bind:is="mainLayout"></component>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    import appLayout from '@/layouts/app-layout.vue';
    import authLayout from '@/layouts/auth-layout.vue';
    import adminLayout from '@/layouts/admin-layout.vue';

    import { useAppStore } from '@/core/store/index';
    import { useMeta } from '@/core/composables/use-meta';

    const store = useAppStore();

    // meta
    useMeta({ title: 'Rent Management' });
    store.setMainLayout('auth');

    const mainLayout = computed(() => {
        if (store.mainLayout === 'admin') {
        return adminLayout; 
    }
        return store.mainLayout === 'auth' ? authLayout : appLayout;
    });
</script>
