<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <v-card class="elevation-12" height="auto" width="375">
      <v-row style="display: flex; justify-content: center">
        <v-card-title>Acceder</v-card-title>
      </v-row>
      <v-col cols="12" align="center">
        <v-row class="mx-4">
          <v-col cols="12" style="display: flex; justify-content: center">
            <v-col cols="12">
              <v-img src="logo-black.png" height="250" width="250" />
            </v-col>
          </v-col>
        </v-row>
        <v-card-text v-if="alert">
          <v-alert v-model="alert" type="error" border="left" dismissible>
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <v-text-field-with-validation
            v-model="username"
            label="Usuario"
            name="username"
            prepend-inner-icon="mdi-account"
            type="text"
            outlined
            dense
            rules="required"
          />
          <v-text-field-with-validation
            v-model="password"
            label="Contraseña"
            name="password"
            outlined
            dense
            prepend-inner-icon="mdi-lock"
            type="password"
            rules="required"
            @keyup.enter="login()"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :disabled="invalid" :loading="loading" @click="login()"
            >Acceder</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
import auth from "@/apollo/queries/auth/auth.gql";
import bcrypt from "bcryptjs";

export default Vue.extend({
  layout: "login",
  middleware: ["auth"],
  components: {
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      alert: false,
      error: "",
      username: "",
      password: "",
      valid: true
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.$apollo
        .query({
          query: auth,
          variables: {
            user: this.username,
            password: this.password
          }
        })
        .then(({ data: { auth } }: any) => {
          if (auth.length > 0) {
            localStorage.setItem("user", this.username);
            localStorage.setItem(
              "token",
              "fafdaa2dae75edb5fd37a3d9fca820e2af2cce8a2ce9b7c0497bd647aaf3a57c"
            );
            this.loading = false;
            this.$router.push("pictures");
          } else {
            this.alert = true;
            this.error = "Usuario y/o contraseña inválidos";
            this.valid = false;
            this.loading = false;
          }
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
