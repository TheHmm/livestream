<script>
export default {
  name: 'Status',
  props: { status: { type: String } },
}
</script>
  
<template>
  <div 
    :id="$id()"
    aria-label="livestream status"
  >
    <p role="status">{{ status }}</p>
  </div>
</template>   

<style scoped>

#status {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--fore);
}
</style>
