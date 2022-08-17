<script>

// Page for people returning form their mollie donation
// The event slug is passed to mollie through the redirect
// URL, and can be re-accessed from the route query here.

export default { name: "Donated" }
</script>

<template>
  <section class="fallback">
    <p>Thank you for donating to the Hmm!</p>
    <p>
      <router-link :to="$route.query?.from || '/'">
        Return.
      </router-link>
    </p>
  </section>
</template>

<style scoped>
section {
  max-width  : min(80%, 60rem);
  margin     : var(--marquee-height) auto;
}
</style>
