<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <form id="picture-form" @submit.prevent="onSubmit">
      <v-row dense>
        <v-col cols="12">
          <v-text-field-with-validation
            v-model="form.title"
            label="Nombre"
            rules="required"
          ></v-text-field-with-validation>
        </v-col>
        <v-col cols="12">
          <v-textarea-with-validation
            v-model="form.description"
            label="Descripción"
            rules="required"
          ></v-textarea-with-validation>
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="image.file"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Cuadro"
            prepend-icon="mdi-camera"
            label="Cuadro"
            @change="change"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete-with-validation
            v-model="form.author_id"
            :items="author"
            :item-text="itemText"
            item-value="id"
            label="Gestor"
            rules="required"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete-with-validation
            v-model="form.category_id"
            :items="category"
            item-text="name"
            item-value="id"
            label="Categoría"
            rules="required"
          />
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
import listCategory from "@/apollo/queries/category/listCategory.gql";
import listAuthor from "@/apollo/queries/author/listAuthor.gql";
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
          author_id: "",
          category_id: "",
          title: "",
          description: "",
          image: ""
        };
      }
    }
  },
  apollo: {
    author: {
      query: listAuthor,
      prefetch: true
    },
    category: {
      query: listCategory,
      prefetch: true
    }
  },
  data() {
    return {
      form: this.instance
    };
  },
  computed: {
    image(): { file: any } {
      return this.form.image
        ? { file: { name: this.form.image } }
        : { file: undefined };
    }
  },
  watch: {
    instance(newValue: any) {
      this.form = newValue;
    }
  },
  methods: {
    itemText(item: any) {
      return `${item.first_name} ${item.last_name}`;
    },
    onSubmit(): void {
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
    },
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
            this.form.image = `https://gbigbe-admin.herokuapp.com/${file.name}`;
          });
      }
    }
  }
});
</script>
