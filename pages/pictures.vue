<template>
  <v-card>
    <v-row class="mx-0">
      <v-card-title v-text="'Cuadros'" />
      <v-spacer />
      <v-dialog v-model="dialog" scrollable persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn depressed text small v-on="on" class="mt-5 mr-5">
            <v-icon>mdi-plus</v-icon>A&ntilde;adir cuadro
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            {{ formTitle }}
          </v-card-title>
          <v-divider />
          <v-card-text class="mt-5">
            <picture-form
              :instance="editedItem"
              :loading="loadingPicture"
              @submit="submit"
              @close="close"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="picture" :items-per-page="5">
          <template v-slot:[`item.image`]="{ item }">
            <v-avatar>
              <v-img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
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
    </v-row>
  </v-card>
</template>

<script lang="ts">
import listPicture from "@/apollo/queries/picture/listPicture.gql";
import insertPicture from "@/apollo/mutations/picture/insertPicture.gql";
import updatePicture from "@/apollo/mutations/picture/updatePicture.gql";
import deletePicture from "@/apollo/mutations/picture/deletePicture.gql";
import PictureForm from "@/components/forms/PictureForm.vue";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import es from "date-fns/locale/es";

import Vue from "vue";
import { Picture } from "@/types";
export default Vue.extend({
  components: {
    PictureForm
  },
  data() {
    return {
      detailsDialog: false,
      title: "",
      picture_details: "",
      dialog: false,
      loadingPicture: false,
      editedItem: {} as Picture,
      headers: [
        { text: "", value: "image", sortable: false },
        { text: "Título", value: "title", sortable: true },
        { text: "Descripción", value: "description", sortable: true },
        { text: "Categoría", value: "category.name", sortable: true },
        // { text: "Colección", value: "collection.name", sortable: true },
        { text: "Gestor", value: "author.email", sortable: true },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    };
  },
  apollo: {
    picture: {
      query: listPicture,
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
      return `${this.editedItem.id ? "Editar" : "Nuevo"} cuadro`;
    }
  },
  methods: {
    dateOf(item: any) {
      return format(parseISO(item.created_at), "d/MMM/yyyy h:mm", {
        locale: es
      });
    },
    editItem(item: any) {
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },
    deleteItem(item: any) {
      if (confirm("Seguro que desea eliminar este cuadro"))
        this.$apollo
          .mutate({
            mutation: deletePicture,
            variables: {
              id: item.id
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            update: (store: any, { data: { delete_picture } }: any) => {
              if (delete_picture.affected_rows === 1) {
                try {
                  const query = store.readQuery({
                    query: listPicture,
                    variables: {}
                  });

                  query.picture = query.picture.filter((el: any) => {
                    return el.id !== item.id;
                  });
                  store.writeQuery({
                    query: listPicture,
                    data: query
                  });
                } catch (error) {}
              } else throw new Error("No se actualizo ningun dato");
              // @ts-ignore
            }
          })
          .then(() => {
            this.$store.commit("snackbar/setSnack", {
              snack: "El cuadro se ha eliminado correctamente",
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
    showDialog(item: any) {
      this.title = item.title;
      this.picture_details = item.image;
      this.detailsDialog = true;
    },
    close() {
      this.editedItem = {} as Picture;
      this.dialog = false;
    },
    submit(editedItem: any) {
      // @ts-ignore
      editedItem.__typename = editedItem.category = editedItem.author = undefined;
      this.$apollo
        .mutate({
          mutation: editedItem.id ? updatePicture : insertPicture,
          variables: {
            ...editedItem
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          update: (store: any, { data }: any) => {
            if (editedItem.id) {
              try {
                const query = store.readQuery({
                  query: listPicture,
                  variables: {}
                });

                const index = query.picture.find((el: any, index: any) => {
                  if (data.update_picture.returning[0].id === el.id)
                    return index;
                });
                Vue.set(query.picture, index, data.update_picture.returning[0]);

                store.writeQuery({
                  query: data.update_picture,
                  data: query
                });
              } catch (error) {}
            } else {
              try {
                const query = store.readQuery({
                  query: listPicture,
                  variables: {}
                });

                query.picture.push(data.insert_picture.returning[0]);

                store.writeQuery({
                  query: data.insert_picture,
                  data: query
                });
              } catch (error) {}
            }
          }
        })
        .then(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: `El cuadro se ha ${
              editedItem.id ? "editado" : "creado"
            } correctamente`,
            color: "success"
          });
          this.editedItem = {} as Picture;
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: "Ha ocurrido un error al realizar la petición",
            color: "error"
          });
          this.editedItem = {} as Picture;
        });
      this.dialog = false;
    }
  },
  head() {
    return { title: "Cuadros" };
  }
});
</script>
