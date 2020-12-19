<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <form id="author-form" @submit.prevent="onSubmit">
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field-with-validation
            v-model="form.first_name"
            label="Nombre(s)"
            rules="required"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field-with-validation
            v-model="form.last_name"
            label="Apellidos"
            rules="required"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field-with-validation
            v-model="form.email"
            label="Correo"
            rules="required|email"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field-with-validation
            v-model="form.phone_number"
            label="Número de teléfono"
            rules="required"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12" sm="6">
          <v-file-input
            v-model="avatar.file"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Perfil"
            prepend-icon="mdi-account-circle"
            label="Perfil"
            @change="change"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field-with-validation
            v-model="form.telegram"
            label="Telegram"
          ></v-text-field-with-validation>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn text small title="cancel" @click="close()">Cancelar</v-btn>
        <v-btn
          :disabled="invalid"
          type="submit"
          color="indigo"
          :loading="loading"
          text
          small
          title="save"
          >Guardar</v-btn
        >
      </v-card-actions>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
import { v4 as uuidv4 } from "uuid";

export default Vue.extend({
  components: {
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    instance: {
      type: Object,
      default() {
        return {
          email: undefined
        };
      }
    }
  },
  computed: {
    avatar(): { file: any } {
      return this.form.avatar
        ? { file: { name: this.form.avatar } }
        : { file: undefined };
    }
  },
  data() {
    return {
      change_password: false,
      confirm: "",
      form: this.instance
    };
  },
  watch: {
    instance(newValue: any) {
      this.form = newValue;
    }
  },
  methods: {
    change(e: any) {
      if (e && e.type && e.type.startsWith("image")) {
        const formData = new FormData();
        const file = new File([e], `${uuidv4()}-${e.name}`, {
          type: e.type
        });
        formData.append("file", file);
        this.$axios
          .$post(`https://gbigbe-admin.herokuapp.com/upload/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((response) => {
            this.form.avatar = `https://gbigbe-admin.herokuapp.com/${file.name}`;
          });
      }
    },
    onSubmit() {
      this.$emit("submit", this.form);
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.validator.reset();
      });
    },
    close() {
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.validator.reset();
      });
      this.$emit("close");
    }
  }
});
</script>
