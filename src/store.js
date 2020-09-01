import { writable, readable } from "svelte/store"
import { Session } from "svelte-session-manager"
import { HubConnectionBuilder } from '@microsoft/signalr'

const _host = "http://192.168.1.101:92";
export const connection = readable(new HubConnectionBuilder()
  .withUrl(_host + "/hub", {
    accessTokenFactory: () => localStorage.getItem('token')
  }).build());

export const session = writable(new Session(window.localStorage));

export const activePage = writable("home.index");
export const dataCita = writable({});
export const host = readable(_host + "/api");
