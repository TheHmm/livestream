<script>
import config from '@/config'

export default {

  name: 'Emo',

  props: {
    emo: { type: Object },
  },

  computed: {
    name() { return this.emo.name },
    img() { return this.emo.image },
    caption() { return this.img?.caption || this.name },
    img_url() { return this.img && config.api_img_url + this.img.formats.thumbnail.url },
  },

}
</script>

<template>
    
  <li 
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
  </li>

</template>

<style scoped>

.emo {
  padding: 0rem !important;
  margin: 0.2rem !important;
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 2rem; */
  height: 2rem;
  cursor: pointer;
}
img {
  /* width: 100%; */
  height: 100%;
  object-fit: contain;

}

</style>
