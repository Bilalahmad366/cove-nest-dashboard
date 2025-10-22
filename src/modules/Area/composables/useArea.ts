import { useApi } from "@/core/composables/useApi";
const { request } = useApi();


export const AllAreas = async () => {
  return await request(`/area/`, "GET");
};
export const GetSingleArea = async (Id) => {
  return await request(`/area/${Id}`, "GET");
};
export const DeleteArea = async (Id) => {
  return await request(`/area/${Id}`, "DELETE");
};
