import { writable, readable } from "svelte/store"

export const activePage = writable("home.index");
export const dataCita = writable({});
// export const host = readable("http://192.168.1.102:91/api");
export const host = readable("http://192.168.1.104:93/api");
// export const host = readable("https://localhost:5001/api");
