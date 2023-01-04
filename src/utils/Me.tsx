import { http } from "./Http"
import { AxiosResponse } from 'axios';

export let mePromise: Promise<AxiosResponse<{
  resource: {
      id: number;
  };
}, any>> | undefined

export const fetchMeInfo = () => {
  mePromise = http.get<{ resource: { id: number } }>('/me')
  return mePromise
}