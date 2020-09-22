import { writable, readable } from "svelte/store"
import { Session } from "svelte-session-manager"
import { HubConnectionBuilder } from '@microsoft/signalr'
import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "http://192.168.1.104:93/api"
  // baseURL: "http://172.20.1.12:303/api"
});

export const axios = writable(axiosInstance);
// const _host = "http://172.20.1.12:303";
const _host = "http://192.168.1.104:93";
export const connection = writable(new HubConnectionBuilder()
  .withUrl(_host + "/hub", {
    accessTokenFactory: () => localStorage.getItem('access_token'),
  }).build());

export const session = writable(new Session(window.localStorage));

export const activePage = writable("home.index");
export const dataCita = writable({});
export const host = readable(_host + "/api");
