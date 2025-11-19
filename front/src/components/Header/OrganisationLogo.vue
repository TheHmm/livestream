<script>
import { mapGetters } from 'vuex'
import config from '@/config'
export default {
  name: 'OrganisationLogo',
  computed: {
    ...mapGetters( 'events', [ 'current_event' ]),
    org() {
      return this.current_event && this.current_event.organisation
    },
    org_logo_src() { 
      return this.org && config.api_img_url + this.org?.Logo?.formats?.thumbnail?.url 
    },
  }
}
</script>
<template>
  <div 
    :id="$id()"
    v-if="org"
  >
    <img :src="org_logo_src" />
  </div>
</template>
<style scoped>
#organisationlogo {
  position: absolute ;
  border-radius: 100%;
  height: calc( 5 * var(--dot-height) );
  width: calc( 5 * var(--dot-width) );
  overflow: hidden;
}
#organisationlogo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
