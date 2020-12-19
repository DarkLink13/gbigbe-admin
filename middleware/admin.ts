// @ts-ignore
import { Context } from "@nuxt/types";

export default function (state: any) {
  if (
    localStorage.getItem("token") !==
    "fafdaa2dae75edb5fd37a3d9fca820e2af2cce8a2ce9b7c0497bd647aaf3a57c"
  ) {
    state.app.router.push("login");
  }
}
