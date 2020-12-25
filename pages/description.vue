<template>
  <validation-observer ref="validator" v-slot="{ invalid }">
    <v-card class="elevation-12">
      <v-card-title v-text="'Quienes somos?'"></v-card-title>
      <v-col cols="12">
        <v-row style="display: flex; justify-content: center">
          <v-col cols="12" sm="7" align="center">
            <v-text-field-with-validation
              v-model="description"
              outlined
              dense
              label="Quienes somos?"
            />
          </v-col>
          <v-spacer />
          <v-btn class="mr-2" text :disabled="invalid" @click="change()"
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
import updateDescription from "@/apollo/mutations/application/updateDescription.gql";
import getApplication from "@/apollo/queries/application/getApplication.gql";
import VTextFieldWithValidation from "~/components/base/VTextFieldWithValidation.vue";
export default Vue.extend({
  components: {
    VTextFieldWithValidation,
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      description: ""
    };
  },
  apollo: {
    application_by_pk: {
      query: getApplication,
      context: {
        headers: {
          "X-Hasura-Role": "admin"
        }
      },
      prefetch: true
    }
  },
  mounted() {
    // @ts-ignore
    this.description = this.application_by_pk.description;
  },
  methods: {
    change() {
      this.$apollo
        .mutate({
          mutation: updateDescription,
          variables: { description: this.description },
          update: (store: any, { data: { delete_author } }: any) => {
            if (delete_author.affected_rows === 1) {
              try {
                const query = store.readQuery({
                  query: getApplication,
                  variables: {}
                });
                query.application_by_pk.description = this.description;
                store.writeQuery({
                  query: getApplication,
                  data: query
                });
              } catch (error) {}
            } else
              this.$store.commit("snackbar/setSnack", {
                snack: "No se actualizo ningun dato",
                color: "error"
              });
          }
        })
        .then(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: "El campo quienes somos se ha editado correctamente",
            color: "success"
          });
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
      title: "Editar quienes somos?"
    };
  }
});
</script>
