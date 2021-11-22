<template>
  <div class="authorized">Authorized</div>
</template>

<script>
export default {
  name: 'Authorized',
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.authorized {
  margin: 40px 0 0;
}
</style>
