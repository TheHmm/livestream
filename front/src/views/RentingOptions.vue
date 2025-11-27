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
        <p class="name">{{ option.Name }}</p>
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
  gap: 0.5rem;
  justify-content: stretch;
  align-items: flex-start;
}
#rentingoptions ul li::before{
  content: '';
}
#rentingoptions ul li {
  min-width: 33.33%;
  text-align: center;
  padding: 0.5rem;
  background-color: lightgrey;
  border: var(--solid);
  border-radius: var(--radius);
  max-height: 10rem;
  transition: all var(--fast) linear;
  overflow: scroll;
}
#rentingoptions ul:has( li:focus-within ) li:not(:focus-within){
  min-width: 25%;
}
#rentingoptions ul li:focus-within {
  min-width: 50%;
  max-height: 20rem;
}
#rentingoptions ul li .more_info {
  display: none;
}
#rentingoptions ul li:focus-within .more_info {
  display: block;
}
</style>