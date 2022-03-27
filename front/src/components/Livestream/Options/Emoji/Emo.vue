<script>
import config from '@/config'

export default {

  name: 'Emo',

  props: {
    emo: Object,
  },

  computed: {
    name()    { return this.emo.name },
    caption() { return this.img?.caption || this.name },
    img()     { return this.emo.image },
    formats() { return this.img.formats },
    img_url() { 
      return (
        this.img ? this.formats ? 
        config.api_img_url + this.img.formats?.thumbnail?.url :
        config.api_img_url + this.img.url : null 
      )
    },
  },

}
</script>

<template>
    
  <label
    :class="$id()"
    role="button"
    tabindex="0"
    :title="caption || name"
  >
    <img 
      v-if="img_url"
      :src="img_url"
      :alt="caption"
    >
    <span v-else>
      {{ emo.name }}
    </span>
  </label>

</template>

<style scoped>

.emo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
}
img {
  height: 100%;
}


</style>
