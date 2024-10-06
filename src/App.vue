<template>
  <div>

    <div id="app">
    
      <ParticleEffect/>
      <NavBar />
      <router-view />
      <DockHub />
    </div>
    </div>
</template>
<script setup>
import NavBar from './components/NavBar.vue'
import ParticleEffect from './components/ParticleEffect.vue';
import DockHub from './components/DockHub.vue';
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: rgba(255, 255, 255, 0.1);
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
