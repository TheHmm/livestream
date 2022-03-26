<script>

import CircleType from 'circletype'

export default {
  name: 'Title',
  props: {
    tab: { type: Object },
    longest: { type: Number }
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
  > 
    {{ tab.label }}
  </label>
</template>


<style scoped>

label {
  position                : relative;
  overflow                : visible;
  align-items             : center !important;
  align-content           : flex-start !important;
  justify-content         : center;
  text-align              : center;
  border-top-left-radius  : 4.5em 100%;
  border-top-right-radius : 4.5em 100%;
}

label div,
label >>> div {
  height                  : 100%;
}
</style>
