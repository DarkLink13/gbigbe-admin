<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <v-card class="elevation-12">
      <v-card-title v-text="'Cambiar contraseña'"></v-card-title>
      <v-col cols="12">
        <v-row style="display: flex; justify-content: center">
          <v-col cols="12" sm="7" align="center">
            <v-file-input
              v-model="image.file"
              placeholder="Cuadro"
              outlined
              dense
              prepend-inner-icon="mdi-camera"
              prepend-icon=""
              label="Cuadro"
              @change="change"
            ></v-file-input>
          </v-col>
          <v-spacer />
          <v-btn class="mr-2" text :disabled="invalid" @click="upload()"
            >Subir</v-btn
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
      image: ""
    };
  },
  methods: {
    change(e: any) {
      if (e) {
        const formData = new FormData();
        const file = new File([e], `${e.name}`, {
          type: e.type
        });
        formData.append("file", file);
        this.$axios
          .$post(`https://gbigbe-admin.herokuapp.com/upload/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((response: any) => {
            // this.form.image = `https://gbigbe-admin.herokuapp.com/${file.name}`;
          });
      }
    }
  },
  head() {
    return {
      title: "Subir aplicación"
    };
  }
});
</script>
