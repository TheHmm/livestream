<script>
export default {
  name: 'Title',
  props: {
    tab: { type: Object }
  },
  computed: {
    id() { return `p_${ this.tab.name }` }
  }
}
</script>
<template>
  <!-- <label
    :class="$id()"
    :for="tab.name"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      preserveAspectRatio="none" 
    >
      <path
        :id="id" 
        d="M 0,50 C0 30 50 30 50 50" 
      />
      <text text-anchor="middle">
        <textPath 
          :xlink:href="`#${ id }`"
          startOffset="50%"
          side="left"
        >
          {{ tab.label }}
        </textPath>
      </text>
    </svg>
  </label> -->
  <label 
    class="title"
    :for="tab.name"
  > 
    {{ tab.label }} 
  </label>
</template>


<style scoped>

label {
  position: relative;
  padding: 0;
}
label svg {
  fill: none;
  stroke: black;
  /* stroke-width: 0.1px; */
  height: 100%;
  width: 100%;
  /* position: absolute; */
  overflow: visible;
  /* top: 0; */
  /* left: 0; */
}
label path {
}
label svg text {
  fill: var(--fore);
  text-align: center;
  stroke: none;
  /* width: 100%; */
  /* height: 100%; */
  font-size: 0.7rem;
}
</style>
