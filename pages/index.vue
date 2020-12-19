<template>
  <div></div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  middleware: ["admin"],
  head() {
    return {
      title: "AugeCRM"
    };
  }
});
</script>
