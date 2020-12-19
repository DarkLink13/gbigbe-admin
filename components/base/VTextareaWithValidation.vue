<template>
  <ValidationProvider
    v-slot="{ errors }"
    :vid="$attrs.name"
    :name="$attrs.label"
    :rules="rules"
  >
    <v-textarea
      v-model="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-textarea>
  </ValidationProvider>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationProvider, extend } from "vee-validate";
import { regex } from "vee-validate/dist/rules";

extend("regex", {
  ...regex,
  message: "El campo no es correcto"
});

// const paramNames = ["targetValue"];
// const timeLimit;
extend("time", {
  params: ["otherValue"],
  // @ts-ignore
  validate(value, { otherValue }) {
    return (
      Number(value.replace(":", "")) >= Number(otherValue.replace(":", ""))
    );
  },
  message: "El fin debe ser después del inicio"
});

export default Vue.extend({
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ""
    },
    // must be included in props
    pattern: {
      type: [Object, String],
      default: ""
    },
    value: {
      type: [Object, String, Number, Array],
      default: null
    }
  },
  data() {
    return {
      innerValue: ""
    };
  },
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  }
});
</script>
