<template>
  <ValidationProvider v-slot="{ errors }" :name="$attrs.label" :rules="rules">
    <v-autocomplete
      v-model="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      autocomplete="off"
      v-on="$listeners"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import Vue from "vue";
import { ValidationProvider } from "vee-validate";

export default Vue.extend({
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ""
    },
    value: {
      type: [Object, String, Array, Number],
      default: null
    }
  },
  data() {
    return {
      innerValue: ""
    };
  },
  watch: {
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
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
