<script>
import { RouterLink } from 'vue-router';
import { mapGetters } from 'vuex'
export default {
  name: 'RentingOptions',
  computed: {
    ...mapGetters( 'meta', [ 'renting_options' ]),
  }
}
</script>
<template>
  <section :id="$id()">
    <h1>Renting Options</h1>
    <ul>
      <li tabindex="0" v-for="option in renting_options">
        <h2 class="name">{{ option.Name }}</h2>
        <p class="desc">{{ option.short_description }}</p>
        <p v-if="option.is_add_on" class="addon">Add-on</p>
        <div class="more_info">
          <p class="desc">{{ option.long_description }}</p>
          <p><a :href="option.email_link">Send us an email</a></p>
          <p><RouterLink :to="`/renting-options/${option.id}`">Read more</RouterLink></p>
        </div>
      </li>
    </ul>
  </section>
</template>
<style scoped>
#rentingoptions ul {
  display: flex;
  gap: 1rem;
  justify-content: stretch;
  align-items: flex-start;
}
#rentingoptions ul li::before{
  content: '';
}
#rentingoptions ul li {
  min-width: calc( 33.33% - 1rem);
  text-align: center;
  padding: 0.5rem;
  background-color: lightgrey;
  border: var(--solid);
  border-radius: var(--radius);
  max-height: 20rem;
  transition: all var(--fast) linear;
  overflow: scroll;
}
#rentingoptions ul li h2 {
  font-size: 2rem;
}
#rentingoptions ul:has( li:focus-within ) li:not(:focus-within){
  min-width: calc(25% - 1rem);
}
#rentingoptions ul li:focus-within {
  min-width: calc(50% - 1rem);
  max-height: 20rem;
}
#rentingoptions ul li .more_info {
  display: none;
}
#rentingoptions ul li:focus-within .more_info {
  display: block;
}
.mobile #rentingoptions ul {
  flex-direction: column;
}
.mobile #rentingoptions ul li:last-of-type {
  margin-bottom: var(--footer-height);
}
</style>