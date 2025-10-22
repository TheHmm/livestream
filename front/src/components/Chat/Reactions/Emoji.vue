<script>
import config from '@/config'

export default {

  name: 'Emoji',

  props: {
    emoji: Object,
  },

  computed: {
    name()    { return this.emoji.name },
    caption() { return this.img?.caption || this.name },
    img()     { return this.emoji.image },
    formats() { return this.img.formats },
    img_url() {
      return (
        this.img ? this.formats ?
        config.api_img_url + this.img.formats?.thumbnail?.url :
        config.api_img_url + this.img.url : null
      )
    },
    is_default_emoji() {
      return this.emoji.group && this.emoji.group == '__DEFAULT__'
    }
  },

}
</script>


<template>

  <label
    :class="[ $id(), { is_default_emoji } ]"
    role="button"
    tabindex="0"
    :title="name || caption"
  >
    <img
      v-if="img_url"
      :src="img_url"
      :alt="name || caption"
    >
    <span v-else>
      {{ emoji.name }}
    </span>
  </label>

</template>


<style scoped>

.emoji {
  display         : flex;
  justify-content : center;
  align-items     : center;
  height          : 2rem;
}
img {
  height          : 100%;
}
.emoji.is_default_emoji span {
  font-size       : 2.2rem;
}

</style>
