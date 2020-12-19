export const state = () => ({
  snack: { snack: "", color: "" }
});

export const mutations = {
  setSnack(state: any, snack: any) {
    state.snack = snack;
  }
};
