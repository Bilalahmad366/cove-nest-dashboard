import { useApi } from "@/core/composables/useApi";
const { request } = useApi();

export const AllFaq = async () => {
  return await request("/faq", "GET");
};
export const DeleteFaq = async (Id) => {
  return await request(`/faq/${Id}`, "DELETE");
};

export const AllVideos = async () => {
  return await request("/videos", "GET");
};

export const GetSingleVideo = async (Id) => {
  return await request(`/videos/${Id}`, "GET");
};
export const DeleteVideo = async (Id) => {
  return await request(`/videos/${Id}`, "DELETE");
};