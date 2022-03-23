<script>
import Banner from '../Header/Banner.vue'

export default { 
  name:  "Loading" ,
  components: { Banner }
}
</script>

<template>
  <main>
    <Banner />
    <section>
      <p>loading...</p>
    </section>
  </main>
</template>

<style scoped>
main {
  --accent: var(--light-grey);
  position: absolute;
  width: 100%;
}
main #banner {
  margin: 2rem auto;
}
main section {
  width: 100%;
  display: flex;
}
main section p {
  color: var(--accent);
  margin: 10% auto;
}
</style>
