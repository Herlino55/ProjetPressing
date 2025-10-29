<template>
  <v-app>
    <router-view />
  </v-app>
  <ToastNotification />
</template>

<script setup lang="ts">
import ToastNotification from './components/ToastNotification.vue';

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Roboto', sans-serif;
}
</style>
