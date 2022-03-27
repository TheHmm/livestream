
<script>


// Our bot form input component. All forms on the site havv 
// this elemment in them and reject submmit actions if it
// produces input.

export default {
  name  : 'Bt',
  props : [ 'modelValue' ],
  emits : [ 'update:modelValue' ]
}

</script>


<template>
  <div :class="$id()">
    <label
      for="website"
      class="comment"
    >
      If you are not a bot, leave the below field empty.
    </label>
    <input 
      tabindex="-1"
      type="text" 
      name="website" 
      id="website" 
      placeholder ="http://example.com" 
      :value="modelValue"
      @change="$emit( 'update:modelValue', $event.target.value )"
    />
  </div>
</template>


<style scoped>
.bt {
  position      : absolute;
  left          : -90000px;
  top           : -90000px;
}
</style>
