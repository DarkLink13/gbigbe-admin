<template>
  <v-card>
    <v-row class="mx-0">
      <v-card-title v-text="'Gestores comerciales'" />
      <v-spacer />
      <v-dialog v-model="dialog" scrollable persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn depressed text small v-on="on" class="mt-5 mr-5">
            <v-icon>mdi-plus</v-icon>A&ntilde;adir gestor de venta
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            {{ formTitle }}
          </v-card-title>
          <v-divider />
          <v-card-text class="mt-5">
            <author-form
              :instance="editedItem"
              :loading="loadingAuthor"
              @submit="submit"
              @close="close"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="author" :items-per-page="5">
          <template v-slot:[`item.avatar`]="{ item }">
            <v-avatar>
              <v-img
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.first_name"
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
/* eslint-disable @typescript-eslint/no-unused-vars */
import listAuthor from "@/apollo/queries/author/listAuthor.gql";
import insertAuthor from "@/apollo/mutations/author/insertAuthor.gql";
import updateAuthor from "@/apollo/mutations/author/updateAuthor.gql";
import deleteAuthor from "@/apollo/mutations/author/deleteAuthor.gql";
import AuthorForm from "@/components/forms/AuthorForm.vue";
import Vue from "vue";
import { Author } from "@/types";

export default Vue.extend({
  components: {
    AuthorForm
  },
  data() {
    return {
      dialog: false,
      loadingAuthor: false,
      editedItem: {} as Author,
      headers: [
        {
          text: "Foto",
          value: "avatar",
          sortable: true
        },
        {
          text: "Nombre(s)",
          value: "first_name",
          sortable: true
        },
        {
          text: "Apellidos",
          value: "last_name"
        },
        {
          text: "Número de teléfono",
          value: "phone_number",
          sortable: true
        },
        {
          text: "Correo",
          value: "email",
          sortable: true
        },
        {
          text: "Usuario de telegram",
          value: "telegram",
          sortable: true
        },
        { text: "Acciones", value: "actions", sortable: false }
      ]
    };
  },
  apollo: {
    author: {
      query: listAuthor,
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
      return `${this.editedItem.id ? "Editar" : "Nuevo"} gestor`;
    }
  },
  methods: {
    editItem(item: Author) {
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },
    deleteItem(item: any) {
      if (confirm("Seguro que desea eliminar este gestor"))
        this.$apollo
          .mutate({
            mutation: deleteAuthor,
            variables: {
              id: item.id
            },
            // eslint-disable-next-line camelcase
            update: (store: any, { data: { delete_author } }: any) => {
              if (delete_author.affected_rows === 1) {
                try {
                  const query = store.readQuery({
                    query: listAuthor,
                    variables: {}
                  });
                  query.author = query.author.filter((el: any) => {
                    return el.id !== item.id;
                  });
                  store.writeQuery({
                    query: listAuthor,
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
              snack: "El gestor se ha eliminado correctamente",
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
      this.editedItem = JSON.parse(JSON.stringify({})) as Author;
      this.dialog = false;
    },
    submit(editedItem: any) {
      editedItem.__typename = undefined;
      this.$apollo
        .mutate({
          mutation: editedItem.id ? updateAuthor : insertAuthor,
          variables: {
            ...editedItem
          },
          update: (store: any, { data }: any) => {
            if (this.editedItem.id) {
              try {
                const query = store.readQuery({
                  query: listAuthor,
                  variables: {}
                });

                const index = query.author.find((el: any, index: any) => {
                  if (data.update_author.returning[0].id === el.id)
                    return index;
                });
                Vue.set(query.author, index, data.update_author.returning[0]);

                store.writeQuery({
                  query: listAuthor,
                  data: query
                });
              } catch (error) {}
            } else {
              try {
                const query = store.readQuery({
                  query: listAuthor,
                  variables: {}
                });
                query.author.push(data.insert_author.returning[0]);
                store.writeQuery({
                  query: listAuthor,
                  data: query
                });
              } catch (error) {}
              // @ts-ignore
            }
          }
        })
        .then(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: `El gestor se ha ${
              editedItem.id ? "editado" : "creado"
            } correctamente`,
            color: "success"
          });
          this.editedItem = JSON.parse(JSON.stringify({})) as Author;
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            snack: "Ha ocurrido un error al realizar la petición",
            color: "error"
          });
        });
      this.dialog = false;
    }
  },
  head() {
    return { title: "Gestores de venta" };
  }
});
</script>
