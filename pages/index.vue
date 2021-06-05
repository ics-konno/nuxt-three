<template>
  <div class="container">
    <div>
      <div class="links">
        <nuxt-link class="links_card" to="001_instance_simplex4d">001_instance_simplex4d</nuxt-link>
        <nuxt-link class="links_card" to="002_3d-text">002_3d-text</nuxt-link>
        <nuxt-link class="links_card" to="003_cannonjs_sample1">003_cannonjs_sample1</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  components: {
  },
  computed: {

  },
};
</script>

<style lang="scss" scoped>
.container{
  padding: 40px 20px;
}
.links {
  display: grid;
  grid-auto-rows: 200px;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 24px;
}
.links_card {
  border-radius: 8px;
  display: grid;
  place-items: center;
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  background-image: linear-gradient(to right bottom, #000000, #444444);
}
</style>
