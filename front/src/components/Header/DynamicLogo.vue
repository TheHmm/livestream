<script>
import Tagline from './Tagline.vue';
import OrganisationLogo from './OrganisationLogo.vue';
export default {
  name: 'DynamicLogo',
  components: {
    Tagline,
    OrganisationLogo
  },
  computed: {
  }
}
</script>

<template>
  <div :id="$id()">
    <OrganisationLogo />
    <Tagline /> 
  </div>
</template>

<style scoped>
#dynamiclogo {
  padding-block: var(--padding);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
