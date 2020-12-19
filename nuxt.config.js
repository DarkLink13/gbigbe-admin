export default {
  ssr: false,
  head: {
    titleTemplate: "GBIGBE - Admin",
    title: "GBIGBE - Admin" || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }]
  },
  axios: {
    baseURL: process.env.AUGECRM_API
  },
  css: [process.env.NODE_ENV ? "@mdi/font/css/materialdesignicons.css" : ""],
  plugins: ["@/plugins/base.ts", "@/plugins/vee-validate.ts"],
  components: false,
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/vuetify"],
  modules: ["@nuxtjs/axios", "@nuxtjs/apollo", "@nuxtjs/pwa"],
  apollo: {
    clientConfigs: {
      default: "@/plugins/apollo.ts"
    }
  },
  vuetify: {
    defaultAssets: false,
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true
    }
  },
  build: {
    transpile: ["vee-validate/dist/rules"]
  }
};
