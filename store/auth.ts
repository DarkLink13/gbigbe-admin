export const state = () => ({ token: "", username: "" });
export const mutations = {
  setToken(state: any, auth: any) {
    state = auth;
  }
};

export const actions = {
  logout(state: any) {
    state = { token: "", username: "" };
  }
};
