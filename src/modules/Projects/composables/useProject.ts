import { useApi } from "@/core/composables/useApi";
const { request } = useApi();

export const Info = async (data) => {
  return await request("/info/details", "POST", data);
};

export const AllProjects = async () => {
  return await request("/project", "GET");
};

export const addProject = async (Payload) => {
  return await request("/project", "POST", Payload);
};

export const GetSingleProject = async (Id) => {
  return await request(`/project/${Id}`, "GET");
};
export const DeleteProject = async (Id) => {
  return await request(`/project/${Id}`, "DELETE");
};
export const UpdateProject = async (Id, Payload) => {
  return await request(`/project/${Id}`, "PUT", Payload);
};
