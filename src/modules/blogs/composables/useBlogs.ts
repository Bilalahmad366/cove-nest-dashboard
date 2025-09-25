import { useApi } from "@/core/composables/useApi";
const { request } = useApi();

export const AllBlogs = async () => {
  return await request("/blog", "GET");
};

export const GetSingleBlog = async (Id) => {
  return await request(`/blog/${Id}`, "GET");
};
export const DeleteBlog = async (Id) => {
  return await request(`/blog/${Id}`, "DELETE");
};