<script>

// Tab title component

import CircleType from 'circletype'

export default {
  name: 'Title',
  props: {
    tab     : Object,
    longest : Number,
  },
  computed: {
    id() { return `p_${ this.tab.name }` }
  },
  mounted() {

    const
      label = document.getElementById( this.id ),
      arc   = new CircleType( label ),
      par_w = label.parentElement.offsetHeight * 2,
      rad   = par_w * ( this.tab.label.length + 3 ) / this.longest

    arc.radius( rad )
    arc.forceHeight( false )
    window.addEventListener( 'resize', () => {
      arc.radius( rad )
    })
  }


}
</script>
<template>
  <label
    class="title"
    :for="tab.name"
    :id="id"
    :title="tab.label"
    aria-hidden="true"
  >
    {{ tab.label }}
  </label>
</template>


<style scoped>

label {
  position                : relative;
  overflow                : visible;
  justify-content         : center;
  align-items             : center;
  text-align              : center;
  border-radius           : inherit;
  font-size               : var(--size-m);

  /* background-color     : transparent !important; */
}

  /* label                : :before {
  content                 : '';
  position                : absolute;
  bottom                  : 0;
  width                   : 100%;
  height                  : 4rem;
  --radius                : calc( 2rem + var(--base-height) ) 100%;
  --radius                : var( --tab-width );
  --radius                : 100%;
  background-color        : var(--back);
  border-top-left-radius  : var(--radius);
  border-top-right-radius : var(--radius);
} */


label div,
label >>> div {
  height                  : 100%;
  padding                 : 0.2rem var(--size-s);
}

.reduce_motion label >>> div span {
  font-size               : var(--size-s);
  position                : relative !important;
  left                    : unset !important;
  bottom                  : calc( -0.5 * var(--size-s)) !important;
}

.mobile label {
  font-size               : var(--size-s);
}

.mobile.reduce_motion label >>> div {
  padding: 0.2rem 0;
  bottom: -0.1rem;
}

</style>
