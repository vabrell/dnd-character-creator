<template>
  <div class="home">
    <CharacterCreator></CharacterCreator>
  </div>
</template>

<script>
// @ is an alias to /src
import CharacterCreator from '@/components/CharacterCreator.vue'

export default {
  name: 'Home',
  components: {
    CharacterCreator
  }
}
</script>
