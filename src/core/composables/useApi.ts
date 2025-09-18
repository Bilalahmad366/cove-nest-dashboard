import { AxiosRequestConfig } from 'axios';
import apiClient from '@/core/services/apiClient';
import { ref } from 'vue';

export function useApi() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const baseUrl = import.meta.env.VITE_API_URL;
    
    const request = async <T>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', data: any = null, config: AxiosRequestConfig = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient({
                url: `${baseUrl}${url}`,
                method,
                data,
                ...config
            });

            return response.data as T;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Request failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { request, loading, error };
}
