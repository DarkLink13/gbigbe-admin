import Vue from "vue";

import { TheMask } from "vue-the-mask";
import VTextFieldWithValidation from "@/components/base/VTextFieldWithValidation.vue";
import VAutocompleteWithValidation from "@/components/base/VAutocompleteWithValidation.vue";
import VTextareaWithValidation from "@/components/base/VTextareaWithValidation.vue";
import SnackBar from "@/components/base/SnackBar.vue";

const components = {
  TheMask,
  VTextFieldWithValidation,
  VTextareaWithValidation,
  VAutocompleteWithValidation,
  SnackBar
};

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component);
});
