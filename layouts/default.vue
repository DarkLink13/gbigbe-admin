<template>
  <v-app>
    <snack-bar />
    <v-navigation-drawer app>
      <v-list>
        <v-list-item>
          <v-row>
            <v-col cols="3">
              <v-img src="logo-black.png" />
            </v-col>
            <v-col cols="12">
              <v-btn text @click="logout()">
                Salir
                <v-icon small v-text="'mdi-logout'" />
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider />
        <template v-for="(item, i) of items">
          <v-list-item :key="i" :to="item.to" router nav>
            <v-list-item-action>
              <v-icon v-text="item.icon" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <v-fade-transition hide-on-leave>
          <nuxt keep-alive />
        </v-fade-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  middleware: ["admin"],
  data() {
    return {
      items: [
        {
          icon: "mdi-lock",
          title: "Cambiar contraseña",
          to: "/account"
        },
        {
          icon: "mdi-account-circle",
          title: "Gestores",
          to: "/managers"
        },
        // {
        //   icon: "mdi-image-multiple",
        //   title: "Colecciones",
        //   to: "/collections"
        // },
        {
          icon: "mdi-image",
          title: "Cuadros",
          to: "/pictures"
        },
        {
          icon: "mdi-image-text",
          title: "Categorías",
          to: "/categories"
        }
      ]
    };
  },
  methods: {
    logout() {
      if (localStorage.getItem("user")) localStorage.removeItem("user");
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      this.$router.push("login");
    }
  }
});
</script>
