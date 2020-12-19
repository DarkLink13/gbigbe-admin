<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <v-card class="elevation-12" height="350" width="400">
      <v-col cols="12" align="center">
        <v-row class="mx-4">
          <v-col cols="3" clas>
            <v-img src="logo.png" width="75" />
          </v-col>
          <v-col cols="9">
            <v-card-title>GBIGBE - Acceder</v-card-title>
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
            prepend-icon="mdi-account"
            type="text"
            rules="required"
          />
          <v-text-field-with-validation
            v-model="password"
            label="Contraseña"
            name="password"
            prepend-icon="mdi-lock"
            type="password"
            rules="required"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="invalid"
            :loading="loading"
            @click="login()"
            >Acceder</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script>
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
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
      if (this.username === "admin" && this.password === "123gbigbe2020*") {
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
    }
  },
  head() {
    return {
      title: "Acceder"
    };
  }
});
</script>
