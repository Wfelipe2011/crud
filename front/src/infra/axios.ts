import axios from "axios";

const TEN_SECONDS_MS = 30000;
const timeout = TEN_SECONDS_MS;
export const http = axios.create({
  baseURL: "https://tpe.wfelipe.com.br/",
  timeout,
});

export const httpLogin = axios.create({
  baseURL: "https://api.tpedigital.com.br/hmg",
  timeout,
});

export type Http = typeof http;
