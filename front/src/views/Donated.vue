<script>
import Banner from '../components/Header/Banner.vue'

// Page for people returning form their mollie donation
// The event slug is passed to mollie through the redirect
// URL, and can be re-accessed from the route query here.

export default {

  name: "Donated" ,

  components: {
    Banner
  },

}
</script>

<template>

  <main>
    <Banner />
    <section>
      <p>Thank you for donating to the Hmm!</p>
      <p>
        <router-link :to="$route.query.from">
          Return.
        </router-link>
      </p>
    </section>
  </main>

</template>

<style scoped>

@import '@/assets/css/fallback.css';


</style>
