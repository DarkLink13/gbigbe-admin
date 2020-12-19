<template>
  <v-snackbar v-model="show" :color="color" :right="true">
    {{ message }}
    <v-btn class="float-right" icon x-small @click.native="show = false">
      <v-icon x-small> mdi-close </v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      color: ""
    };
  },
  created() {
    this.$store.watch(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (state) => state.snackbar.snack,
      () => {
        const msg = this.$store.state.snackbar.snack;
        if (msg !== "") {
          this.show = true;
          this.message = this.$store.state.snackbar.snack.snack;
          this.color = this.$store.state.snackbar.snack.color;
          this.$store.commit("snackbar/setSnack", "");
        }
      }
    );
  }
};
</script>
