<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <v-card class="elevation-12">
      <v-card-title v-text="'Cambiar contraseña'"></v-card-title>
      <v-col cols="12">
        <v-row style="display: flex; justify-content: center">
          <v-col cols="12" sm="7" align="center">
            <v-text-field-with-validation
              v-model="old_password"
              label="Contraseña actual"
              prepend-inner-icon="mdi-lock-outline"
              type="password"
              dense
              outlined
              rules="required"
            />
          </v-col>
          <v-col cols="12" sm="7" align="center">
            <v-text-field-with-validation
              v-model="new_password"
              label="Contraseña nueva"
              name="password"
              type="password"
              prepend-inner-icon="mdi-lock"
              dense
              outlined
              rules="required|password:confirm"
            />
          </v-col>
          <v-col cols="12" sm="7" align="center">
            <v-text-field-with-validation
              v-model="confirm"
              label="Confirmar nueva"
              prepend-inner-icon="mdi-lock-alert"
              name="confirm"
              type="password"
              dense
              outlined
              rules="required"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-spacer />
          <v-btn class="mr-2" text :disabled="invalid" @click="changePass()"
            >Cambiar</v-btn
          >
        </v-row>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
import changePass from "@/apollo/mutations/auth/changePass.gql";

export default Vue.extend({
  components: {
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      alert: false,
      error: "",
      old_password: "",
      new_password: "",
      confirm: "",
      valid: true
    };
  },
  methods: {
    async changePass() {
      this.loading = true;
      this.$apollo
        .mutate({
          mutation: changePass,
          variables: {
            old_pass: this.old_password,
            new_pass: this.new_password
          },
          update: (
            store: any,
            {
              data: {
                update_auth: { affected_rows }
              }
            }: any
          ) => {
            if (affected_rows > 0)
              this.$store.commit("snackbar/setSnack", {
                snack: "La contraseña se ha editado correctamente",
                color: "success"
              });
            else
              this.$store.commit("snackbar/setSnack", {
                snack: "La contraseña actual es incorrecta",
                color: "error"
              });
          }
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: "Ha ocurrido un error al realizar la petición",
            color: "error"
          });
        });
    }
  },
  head() {
    return {
      title: "Acceder"
    };
  }
});
</script>
