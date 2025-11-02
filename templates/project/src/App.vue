<template>
  <v-app>
    <router-view />
  </v-app>
  <ToastNotification />
  <LoarderOverlay />
</template>

<script setup lang="ts">
import LoarderOverlay from './components/LoarderOverlay.vue';
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
