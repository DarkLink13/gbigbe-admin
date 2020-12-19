<template>
  <v-card>
    <v-row>
      <v-col cols="12" sm="3" offset="9">
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn depressed text small v-on="on">
              <v-icon>mdi-plus</v-icon>A&ntilde;adir cuadro
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              {{ formTitle }}
            </v-card-title>
            <v-divider />
            <v-card-text>
              <picture-form
                :instance="editedItem"
                :loading="loadingPicture"
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
        <v-data-table :headers="headers" :items="picture" :items-per-page="5">
          <template v-slot:[`item.thumbnail`]="{ item }">
            <v-avatar>
              <v-img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                :alt="item.title"
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
      dialog: false,
      loadingPicture: false,
      editedItem: {} as Picture,
      headers: [
        { text: "", value: "thumbnail", sortable: false },
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
      return `${this.editedItem.id ? "Editar" : "Nueva"} cuadro`;
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

                  query.polls = query.polls.filter((el: any) => {
                    return el.id !== delete_picture.returning[0].id;
                  });
                  store.writeQuery({
                    query: delete_picture,
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
    close() {
      this.editedItem = {} as Picture;
      this.dialog = false;
    },
    submit() {
      // @ts-ignore
      this.editedItem.__typename = this.editedItem.category = this.editedItem.author = undefined;
      this.$apollo
        .mutate({
          mutation: this.editedItem.id ? updatePicture : insertPicture,
          variables: {
            ...this.editedItem
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          update: (store: any, { data }: any) => {
            if (this.editedItem.id) {
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

                query.picture.push(data.update_picture.returning[0]);

                store.writeQuery({
                  query: data.update_picture,
                  data: query
                });
              } catch (error) {}
            }
          }
        })
        .then(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: `El cuadro se ha ${
              this.editedItem.id ? "editado" : "creado"
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
