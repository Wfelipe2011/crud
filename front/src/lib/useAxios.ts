import { useCookies } from ".";
import { http as httpCrud, httpLogin } from "../infra";

export const useHttp = (type: 'login' | 'crud' = 'crud') => {
  const http = type === 'login' ? httpLogin : httpCrud;
  const cookie = useCookies();

  http.interceptors.request.use((config) => {
    const token = cookie.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        cookie.erase("token");
      }
      return Promise.reject(error);
    }
  );

  return http;
};
