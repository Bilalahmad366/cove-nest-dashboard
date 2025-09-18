import { useApi } from "./useApi";
const request = useApi();

export const getDashboardData = async () => {
    return await request.request('/dashboard', 'GET');
}
