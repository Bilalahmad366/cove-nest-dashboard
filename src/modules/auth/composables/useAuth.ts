import { useApi } from "@/core/composables/useApi";
import { UserLoginData, UserRegisterData } from "../utils/types";

import { setLocalStorage } from '@/core/services/localStorage';
const { request } = useApi();

export const Register = async (userRegisterData: UserRegisterData) => {
  return await request("/auth/register", "POST", userRegisterData);
  //handle response ....
};

export const Login = async (userLoginData: UserLoginData) => {
  let response: any = await request("/auth/login", "POST", userLoginData);
  setLocalStorage(response);
  return response;
};
export const forget = async (data: any) => {
  let response: any = await request("/forget-password", "POST", data);
  return response;
};
export const resetpassword = async (data: any) => {
  let response: any = await request("/reset-password", "POST", data);
  return response;
};
