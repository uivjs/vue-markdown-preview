<template>
  <div>
    <simple title="001"></simple>
    <v-base title="002"></v-base>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import Simple from '@vue-simple-package/simple';
import VBase from '@vue-simple-package/base';

export default defineComponent({
  components: {
    Simple,
    VBase,
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
