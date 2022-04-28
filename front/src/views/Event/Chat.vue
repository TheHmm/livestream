
<script>

import Chat from '@/components/Chat/index.vue'

export default {

  name : 'ChatPage',

  components : {
    Chat,
  },


  // This component inherits only the event fron it's parent
  // and handles the rest independently.

  props : {
    event: Object,
  },

}
</script>

  
<template>
  <Chat />
</template> 


<style scoped>

#chat_container {
  --fore           : var(--black);
  width            : 100%;
  margin           : 0;
  height           : 100%;
}

#chat_container >>> #chat {
  --distance       : 100vh;
  height           : 100%;
}

#chat_container >>> #chat .contents:focus-within,
#chat_container >>> #chat.expanded .contents {
  --height        : calc( 100% - var(--base-height) );

}
#chat_container >>> #chat .options .close {
  display         : none; 
}

#chat_container >>> #chat .contents {
  padding-bottom   : calc( var(--footer-height));
}

.mobile #chat_container >>> #chat .contents {
  padding-bottom   : calc( var(--footer-height) + 1rem );
}

.chatpage.hide_input #chat_container >>> #chat .contents,
.mobile.chatpage.hide_input #chat_container >>> #chat .contents {
  padding-bottom   : 0;
}



</style>
