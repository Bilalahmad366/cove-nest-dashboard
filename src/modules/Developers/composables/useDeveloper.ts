import { useApi } from "@/core/composables/useApi";
const { request } = useApi();


export const AllDevelopers = async () => {
  return await request(`/developer/`, "GET");
};
export const GetSingleDeveloper = async (Id) => {
  return await request(`/developer/${Id}`, "GET");
};
export const DeleteDeveloper = async (Id) => {
  return await request(`/developer/${Id}`, "DELETE");
};
