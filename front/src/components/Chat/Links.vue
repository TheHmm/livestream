<script>
export default {
  name: 'Links',
  props: {
    links : Object,
    name  : String
  },
}
</script>
<template>
  <ul
    class="body"
    :aria-label="`Message URLs from ${ name }`"
  >
    <li
      v-for="(url, index) in links"
      :key="index"
    >
      <a
        target="blank"
        :href="url"
        :title="url"
      >
        {{ url }}
      </a>
    </li>
  </ul>
</template>
