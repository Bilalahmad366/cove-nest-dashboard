import { useApi } from "@/core/composables/useApi";
const { request } = useApi();

export const AllNews = async () => {
  return await request("/news", "GET");
};

export const GetSingleNews = async (Id) => {
  return await request(`/news/${Id}`, "GET");
};
export const DeleteNews = async (Id) => {
  return await request(`/news/${Id}`, "DELETE");
};