<script>

//  based on this: https://github.com/steveseguin/captionninja

export default {

  name : 'SendCaptions',

  data() {
    return {
      message: 'Fetching livestreams...',
      authenticated: false,
      livestreams: [],
      counter: 0,
      final_transcript: '',
      interim_transcript: "",
    }
  },

  computed: {
    selected_stream() {
      return this.livestreams.find( l => l.slug == this.$route.hash.replace( '#', '' ))
    }
  },

  async created() {
    if ('webkitSpeechRecognition' in window) {
      this.livestreams = await this.$store.dispatch( 'livestream/fetch_all' )
      this.message = null
      console.log( this.livestreams )
    } else {
      this.message = 'Unfortunately, this tool will only work in Google Chrome 🤮'
    }
  },

  watch: {
    selected_stream( new_selection ) {
      this.authenticated = false
    }
  },

  methods: {

    transcribe() {
      const { mux_id, slug, publicData } = this.selected_stream
      const { start_time, status } = publicData
	
      this.livestream_slug = slug
      this.$socket.client.emit( 'join_CC_room', this.livestream_slug )
      this.timestamp_start = +start_time

      console.log(this.timestamp_start, 'livestream start time')
      console.log(Date.now(), 'current time')

      let recognition = new webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.onstart = () => console.log("started transcription")
      recognition.onerror = e => console.error(e)
      recognition.onend = () => console.log("Stopped transcription") && this.transcribe()
     
      recognition.onresult = this.handle_result
      recognition.start()
    },

    handle_result( result ) {
      this.counter += 1
      this.interim_transcript = ''
      if ( typeof( event.results ) == 'undefined' ) {
        return
      }
      for ( let i = event.resultIndex; i < event.results.length; ++i ) {
        if( event.results[i].isFinal ){
          this.final_transcript += event.results[i][0].transcript
          console.log( "FINAL:", this.final_transcript )
          try {
            this.$socket.client.emit( 'final', {
              id   : this.counter,
              time : new Date().getTime(),
              text : this.final_transcript,
              room : this.livestream_slug
            })
            this.interim_transcript=""
          } catch(e){
            console.error(e)
          }
        } else {
          this.final_transcript=""
          this.interim_transcript += event.results[i][0].transcript
          console.log("INTERM:", this.interim_transcript)
          try {
            this.$socket.client.emit('interm', {
              id   : this.counter,
              time : new Date().getTime(),
              text : this.interim_transcript,
              room : this.livestream_slug
            })
          } catch(e){
            console.error(e)
            this.interim_transcript=""
          }
        }
      }
    },

    async handle_authentication(e) {
      const slug = e.target[0].value 
      const key = e.target[1].value 
      try {
        this.authenticated = await this.$store.dispatch( 'livestream/request_access', { slug, key })
        this.transcribe()
      } catch ( error ) {
        this.message = error.message
      }
    },

    socket_streamUpdate( livestream ) {
		  if ( livestream.slug ) { 
        const found = this.livestreams.find( l => l.slug == livestream.slug )
        if ( found ) {
          this.livestreams[this.livestreams.indexOf( found )] = livestream
          const { publicData } = livestream
          if ( publicData.status == 'active' && publicData.start_time ) {
            this.timestamp_start = publicData.start_time
          }
        }
      }
    },

    clear() {
      console.log( 'clearing captions' )
		  this.$socket.client.emit( 'clear_CC', this.livestream_slug )
		  window.location.reload()
    },

  }


}
</script>

<template>
  <section v-if="message" id="send_cc">
    {{ message }}
  </section>
  <section v-else id="send_cc">
    <menu>
      <button
        id="clear"
        name="clear"
        @click="clear"
      >
        clear transcription
      </button>
      <div id="livestreams">
        <p v-if="!selected_stream" >Choose a livestream to push closed captions to:</p>
        <ul>
          <li
            v-for="livestream in livestreams"
            :key="livestream.slug"
            :class="[ 
              'livestream', 
              livestream.publicData.status,
              { target: livestream.slug == selected_stream?.slug }
            ]"
            :id="livestream.slug"
          >
            <a :href="`#${ livestream.slug }`">
              <p>_SLUG_: {{ livestream.slug }}</p>
              <p>MUX_ID: {{ livestream.mux_id }}</p>
              <p>STATUS: {{ livestream.publicData.status }}</p>
              <p>STARTS: {{ livestream.publicData.start_time }}</p>
            </a>
            <form 
              v-if="!authenticated"
              @submit.prevent="handle_authentication"
            >
              <label>Enter stream key:</label>
        			<input type="text" :value="livestream.slug" />
        			<input type="password" placeholder="XXXX-XXXXXX-XXXX-..." />
			        <input type="submit" value="authenticate" />
            </form>
            <p v-else>🎙️ transcribing... 🎙️</p>
          </li>
        </ul>
      </div>
    </menu>
    <div id="interm" class="output">{{ interim_transcript }}</div>
	  <div id="final" class="output">{{ final_transcript }}</div>
  </section>
</template>

<style scoped>
#send_cc {
  height: 100%;
}
.output {
  margin:0;
  color: grey;
  font-size: 3em;
  line-height: 1em;
  letter-spacing: 0.0em;
  padding: 0em;
}
.output p {
  padding: 8px 8px 0px 8px;
  margin:0;
}
#final.output {
  color: black;
}
menu {
  margin: 0.5rem;
  padding: 0;
}
#livestreams {
  margin-top: 0.5rem;
}
ul li::before {
  content: '';
}
.livestream p {
  color:white;
  margin: 0;
  color:inherit;
}
.livestream a + p {
  margin-top: 1rem;
}
#livestreams .livestream {
  border: 1px solid black;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: lightgrey;
  white-space: pre;
  font-family: monospace;
}
#livestreams .livestream a {
  text-decoration: none;
}
#livestreams .livestream form {
  display: none;
  margin-top: 1rem;
  white-space: normal;
  align-items: center;
}
#livestreams .livestream form input[type="text"] {
  visibility: hidden;
}
#livestreams .livestream form input[type="password"] {
  flex-grow: 1;
  margin-inline: 0.5rem;
}
#livestreams .livestream.active {
  background-color: limegreen;
}
#livestreams .livestream.idle {
  background-color: rgb(255, 84, 84);
}
#livestreams:has(.target) .livestream {
  display: none;
}
#livestreams:has(.target) .livestream.target {
  display: block;
}
#livestreams:has(.target) .livestream.target form {
  display: flex;
}
  </style>