import { http } from "./Http"
import { AxiosResponse } from 'axios';
import { Resource, User } from './types';

export let mePromise: Promise<AxiosResponse<Resource<User>, any>> | undefined

export const fetchMeInfo = () => {
  mePromise = http.get<Resource<User>>('/me')
  return mePromise
}