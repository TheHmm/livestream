<script>
import Banner from '../components/Header/Banner.vue'

export default { 
  name: "Donated" ,
  components: { Banner },
}
</script>

<template>

  <main>
    <Banner />
    <section>
      <p>Thank you for donating to the Hmm!</p>
      <p>
        <router-link :to="$route.query.from">
          Return to stream.
        </router-link>
      </p> 
    </section>
  </main>

</template>

<style scoped>
main {
  position: absolute;
  width: 100%;
}
main #banner {
  margin: 2rem auto;
} 
main section {
  background: var(--white);
  max-width: min(70%, 50rem);
  margin: 5rem auto;
  overflow: scroll;
}
main section p {
  margin: 0;
}
</style>
