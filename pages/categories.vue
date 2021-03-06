<template>
  <v-card>
    <v-row class="mx-0">
      <v-card-title v-text="'Categorías'" />
      <v-spacer />
      <v-dialog v-model="dialog" scrollable persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn depressed text small v-on="on" class="mt-5 mr-5">
            <v-icon>mdi-plus</v-icon>A&ntilde;adir categoría
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            {{ formTitle }}
          </v-card-title>
          <v-card-text class="mt-5">
            <category-form
              :instance="editedItem"
              :loading="loadingCategory"
              @submit="submit"
              @close="close"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="category" :items-per-page="5">
          <template v-slot:[`item.icon`]="{ item }">
            <v-avatar>
              <v-img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.name"
                @click="showDialog(item)"
                style="cursor: pointer !important"
              />
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
    <v-dialog v-model="detailsDialog" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title> Detalles de {{ title }} </v-card-title>
        <v-card-text class="mt-5">
          <v-img :src="picture_details" :alt="title" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="detailsDialog = false">CERRAR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      detailsDialog: false,
      title: "",
      picture_details: "",
      dialog: false,
      loadingCategory: false,
      editedItem: {} as Category,
      headers: [
        { text: "Ícono", value: "icon", sortable: true },
        { text: "Nombre", value: "name", sortable: true },
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
      return `${this.editedItem.id ? "Editar" : "Nueva"} categoría`;
    }
  },
  methods: {
    showDialog(item: any) {
      this.title = item.name;
      this.picture_details = item.icon;
      this.detailsDialog = true;
    },
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
                try {
                  const query = store.readQuery({
                    query: listCategory,
                    variables: {}
                  });
                  query.category = query.category.filter((el: any) => {
                    return el.id !== item.id;
                  });
                  store.writeQuery({
                    query: listCategory,
                    data: query
                  });
                } catch (error) {}
              } else
                this.$store.commit("snackbar/setSnack", {
                  snack: "No se actualizo ningun dato",
                  color: "error"
                });
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
      this.editedItem = JSON.parse(JSON.stringify({}));
      this.dialog = false;
    },
    submit(editedItem: any) {
      editedItem.__typename = undefined;
      this.$apollo
        .mutate({
          mutation: editedItem.id ? updateCategory : insertCategory,
          variables: {
            ...editedItem
          },
          update: (store: any, { data }: any) => {
            if (this.editedItem.id) {
              try {
                const query = store.readQuery({
                  query: listCategory,
                  variables: {}
                });

                const index = query.category.find((el: any, index: any) => {
                  if (data.update_category.returning[0].id === el.id)
                    return index;
                });
                Vue.set(
                  query.category,
                  index,
                  data.update_category.returning[0]
                );

                store.writeQuery({
                  query: listCategory,
                  data: query
                });
              } catch (error) {}
            } else {
              try {
                const query = store.readQuery({
                  query: listCategory,
                  variables: {}
                });

                query.category.push(data.insert_category.returning[0]);

                store.writeQuery({
                  query: listCategory,
                  data: query
                });
              } catch (error) {}
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
