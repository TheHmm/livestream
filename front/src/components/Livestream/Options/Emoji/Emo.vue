<script>
import config from '@/config'

export default {

  name: 'Emo',

  props: {
    emo: { type: Object },
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
    
  <div
    :class="$id()"
    role="menuitemradio"
  >
    <img 
      v-if="img_url"
      :src="img_url"
      :alt="caption"
      :title="caption"
    >
    <label
      v-else 
      :title="caption"
      tabindex="0"
    >
      {{ emo.name }}
    </label>
  </div>

</template>

<style scoped>

.emo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  /* width: 2rem; */
}
img {
  height: 100%;
  /* width: 100%; */
}

</style>
