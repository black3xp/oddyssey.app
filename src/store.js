import { writable, readable } from "svelte/store"

export const activePage = writable("home.index");
export const dataCita = writable({});
// export const host = readable("http://192.168.1.101:92/api");
export const host = readable("https://localhost:5001/api");
