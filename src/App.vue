<script setup></script>

<template>
  <h4><router-link to="/about">go about</router-link></h4>
  <div>
    <router-view />
  </div>
</template>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
