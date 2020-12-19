<template>
  <v-card>
    <v-row>
      <v-col cols="12" sm="3" offset="9">
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn depressed text small v-on="on">
              <v-icon>mdi-plus</v-icon>A&ntilde;adir categoría
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              {{ formTitle }}
            </v-card-title>
            <v-card-text>
              <category-form
                :instance="editedItem"
                :loading="loadingCategory"
                @submit="submit"
                @close="close"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="category" :items-per-page="5">
          <template v-slot:[`item.icon`]="{ item }">
            <v-avatar>
              <v-img v-if="item.icon" :src="item.icon" :alt="item.name" />
              <v-icon v-else>mdi-file-image</v-icon>
            </v-avatar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data> No hay datos disponibles </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import listCategory from "@/apollo/queries/category/listCategory.gql";
import insertCategory from "@/apollo/mutations/category/insertCategory.gql";
import updateCategory from "@/apollo/mutations/category/updateCategory.gql";
import deleteCategory from "@/apollo/mutations/category/deleteCategory.gql";
import CategoryForm from "@/components/forms/CategoryForm.vue";
import Vue from "vue";
import { Category } from "@/types";

export default Vue.extend({
  components: {
    CategoryForm
  },
  data() {
    return {
      dialog: false,
      loadingCategory: false,
      editedItem: { address: {} } as Category,
      headers: [
        { text: "Ícono", value: "icon", sortable: true },
        { text: "Nombre", value: "name", sortable: true },
        { text: "Cuadros", value: "pictures", sortable: false },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    };
  },
  apollo: {
    category: {
      query: listCategory,
      context: {
        headers: {
          "X-Hasura-Role": "admin"
        }
      },
      prefetch: true
    }
  },
  computed: {
    formTitle(): string {
      return `${this.editedItem.id ? "Editar" : "Nueva"} categoria`;
    }
  },
  methods: {
    editItem(item: any) {
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },
    deleteItem(item: any) {
      if (confirm("Seguro que desea eliminar esta categoría"))
        this.$apollo
          .mutate({
            mutation: deleteCategory,
            variables: {
              id: item.id
            },
            update: (store: any, { data: { delete_category } }: any) => {
              if (delete_category.affected_rows === 1) {
              }
              // @ts-ignore
            }
          })
          .then(() => {
            this.$store.commit("snackbar/setSnack", {
              snack: "La categoria se ha eliminado correctamente",
              color: "success"
            });
          })
          .catch(() => {
            this.$store.commit("snackbar/setSnack", {
              snack: "Ha ocurrido un error al realizar la petición",
              color: "error"
            });
          });
    },
    close() {
      this.editedItem = JSON.parse(JSON.stringify({ address: {} }));
      this.dialog = false;
    },
    submit() {
      // @ts-ignore
      thisthis.editedItem.__typename = undefined;
      this.$apollo
        .mutate({
          mutation: this.editedItem.id ? updateCategory : insertCategory,
          variables: {
            icon: this.editedItem.icon,
            name: this.editedItem.name
          },
          update: (store: any, { data }: any) => {
            if (this.editedItem.id) {
              // @ts-ignore
              // const index = this.category.findIndex((category: any) => {
              //   return category.id === this.editedItem.id;
              // });
              // Vue.set(
              //   // @ts-ignore
              //   this.category,
              //   index,
              //   data.update_categories.returning[0]
              // );
            } else {
              // @ts-ignore
              // this.categories.push(data.insert_categories.returning[0]);
            }
          }
        })
        .then(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: `La categoria se ha ${
              this.editedItem.id ? "editado" : "creado"
            } correctamente`,
            color: "success"
          });
          this.editedItem = {};
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: "Ha ocurrido un error al realizar la petición",
            color: "error"
          });
          this.editedItem = {};
        });
      this.dialog = false;
    }
  },
  head() {
    return { title: "Categorías" };
  }
});
</script>
