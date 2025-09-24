import { useApi } from "@/core/composables/useApi";
const { request } = useApi();

export const AllEvents = async () => {
  return await request("/event", "GET");
};

export const GetSingleEvent = async (Id) => {
  return await request(`/event/${Id}`, "GET");
};
export const DeleteEvent = async (Id) => {
  return await request(`/event/${Id}`, "DELETE");
};