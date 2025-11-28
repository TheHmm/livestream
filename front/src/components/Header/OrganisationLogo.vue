<script>
import config from '@/config'
export default {
  name: 'OrganisationLogo',
  computed: {
    org() {
      return this.$store.getters[ 'events/get_event' ](
        this.$route.params.slug
      )?.organisation
    },
    org_logo_src() { 
      return this.org && config.api_img_url + this.org?.Logo?.formats?.thumbnail?.url 
    },
  }
}
</script>
<template>
  <transition name="dot" mode="in-out">
    <div 
      :id="$id()"
      v-if="org"
    >
      <img :src="org_logo_src" />
    </div>
  </transition>
</template>
<style scoped>
div {
  position: absolute ;
  border-radius: 100%;
  min-height: calc( 5 * var(--dot-height) );
  min-width: calc( 5 * var(--dot-width) );
  height: calc( 5 * var(--dot-height) );
  width: calc( 5 * var(--dot-width) );
  overflow: hidden;
  scale: 1;
  transition: all var(--fast) linear;
}
div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dot-enter-active,
.dot-leave-active,
.dot-move {
  transition: all var(--fast) linear;
}
.dot-enter-to,
.dot-leave-from {

}
.dot-enter-from,
.dot-leave-to {
  scale: 0;
  min-width: 0;
  min-height: 0;
}
.dot-leave-active {
  position        : absolute;
}
</style>
