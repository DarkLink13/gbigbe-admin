<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <form id="category-form" @submit.prevent="onSubmit">
      <v-row dense>
        <v-col cols="12">
          <v-text-field-with-validation
            v-model="form.name"
            label="Nombre"
            rules="required"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12" sm="6">
          <v-file-input
            v-model="logo.file"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Ícono"
            prepend-icon="mdi-camera"
            label="Ícono"
            @change="change"
          ></v-file-input>
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
          name: undefined,
          icon: undefined
        };
      }
    }
  },
  data() {
    return {
      form: this.instance
    };
  },
  computed: {
    icon(): { file: any } {
      return this.form.icon
        ? { file: { name: this.form.icon } }
        : { file: undefined };
    }
  },
  watch: {
    instance(newValue: any) {
      this.form = newValue;
    }
  },
  methods: {
    onSubmit(): void {
      this.form.icon = this.icon.file?.name;
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.validator.reset();
      });
      this.$emit("submit", this.form);
    },
    close() {
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.validator.reset();
      });
      this.$emit("close");
    },
    change(e: any) {
      if (e) {
        const formData = new FormData();
        const file = new File([e], `${uuidv4()}-${e.name}`, {
          type: e.type
        });
        formData.append("file", file);
        this.$axios
          .$post(`/storage/o/augecrm/${file.name}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((response) => {
            this.icon.file = { name: response.key };
          });
      } else {
        this.icon.file = undefined;
      }
    }
  }
});
</script>
