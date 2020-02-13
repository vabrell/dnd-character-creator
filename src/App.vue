<template>
  <div id="app" class="container mx-auto">
    <div id="nav" class="py-3 flex justify-center">
			<div>
      <router-link class="text-xl text-red-400 font-semibold" to="/">Home</router-link> |
      <router-link class="text-xl text-red-400 font-semibold" to="/spellbook">Spellbook</router-link>
			</div>
    </div>
    <router-view/>
  </div>
</template>

<style src="./assets/css/tailwind.css">
