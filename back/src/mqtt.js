// MQTT ; using this protocol to communicate with the ESP32
// devices that are sometimes in the sapce.

let rotate = false

const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports = ({ HOST, TOPIC }) => {

  // If no HOST or TOPIC is provided we warn that MQTT env vars
  // are not defined and return

  if ( !HOST || !TOPIC ) {
    console.warn[ 'MQTT variables are undefined, continuing without MQTT connectivity.' ]
    return
  }

  // We initialize mqtt client with strapi

  const mqtt = require( 'mqtt' ).connect( HOST )


  // shortcut to publish without always mentioning the TOPIC

  mqtt.send = payload => {
    mqtt.publish( TOPIC, payload )
  }


  // Connect to host and subscribe to TOPIC

  mqtt.on( 'connect', () => {
    console.log( 'MQTT connected to host: ', HOST )
    mqtt.subscribe( TOPIC )
  })





  // All the possible methods that an ESP32 module can execute
  // on the server.

  mqtt.actions = {


    // acknowledge device existence and it's ability to send
    // a payload

    say_hi : function( sender, data ) {
      console.log( "Hello!", sender, data )
    },


    // connect to livestream socket io server and appear on
    // front end as dot presenting as a viewer.

    connect : function( sender, data ) {
      const uuid = `ESP-${ sender }`
      strapi.io.socket_viewer({
        name      : sender,
        uuid      : uuid,
        connected : true,
      })
      setTimeout( () => {
        strapi.io.socket_disconnect( uuid )
      }, 4 * 60 * 60 * 1000 ) // 4 hours
    },


    // send emoji to all

    emoji : function( sender, emoji ) {
      const uuid = `ESP-${ sender }`
      strapi.io.socket_emoji({
        group : "global",
        emoji,
        uuid,
      })
    },


    // rotate website

    rotate : function( sender ) {
      rotate = !rotate
      strapi.io.socket_misc({ rotate })
    },


    // set accent color for the entire event


    // make the donate button bounce


    // change volume


    // ...

  }


  mqtt.hmmosphere = {


    // permitted trigger emojis

    TRIGGERS : [
      'nose',
      'sniffing',
      'hmmosphere'
    ],

    DURATION: 10 * 1000,    // 3 mionutes
    COMMAND_BEAT: 0.4 * 1000, // 2 seconds


    // the JS timeout to be able to send a deploy command
    // again.

    ACTIVE: false,

    // handle emoji event

    handler : function( emoji ) {
      if ( this.TRIGGERS.includes( emoji.emoji ) ) {
        if ( !this.ACTIVE ) {
          this.deploy()
        }
      }
    },


    // deploy scent: First, enable the smell and light and
    // block incoming emojis. Then, when the DURATION time
    // has passed, disable the smell alone, leaving the light
    // on to indicate that currently it is blocking emojis.
    // After the DURATION passes again, then disable the light
    // diasble the block and allow for more emotes

    deploy : async function() {
      this.ACTIVE = true
      mqtt.send( `server:scent_power:off` )       // activate power relay
      await wait( this.COMMAND_BEAT )
      mqtt.send( `server:scent_power:on` )        // activate power relay
      await wait( this.COMMAND_BEAT )
      mqtt.send( `server:scent:on` )              // activate scent diffuser
      await wait( this.COMMAND_BEAT )
      mqtt.send( `server:scent:long` )            // activate light
      await wait( 8 * this.COMMAND_BEAT )
      mqtt.send( `server:scent:long` )            // activate light colorful
      await wait( this.DURATION )
      mqtt.send( `server:scent_power:off` )       // deactivate power relay
      await wait( this.DURATION )
      this.ACTIVE = false                         // allow people to send again
    }



  }




  // parse all received messages with the following template:
  // message: "sender:action:data" where:
  // sender is the name of the device
  // action is one of the predefined "actions" methods

  mqtt.on( 'message', ( topic, payload ) => {
    const [ sender, action, data ] = payload.toString().split( ':' )
    console.log( `${ sender }:${ action }:${ data }` )

    // if the server itself (or the chat audience) is the
    // sender, don't run the command

    if ( sender == 'server' ) {
      return
    }

    // if the action is defined as a method in our actions,
    // we call the method, passing the sender and payload,
    // else we log this to the console.

    if ( mqtt.actions[action] ) {
      mqtt.actions[action]( sender, data )
    } else {
      console.log( `MQTT action "${ action }" not found.` )
    }
  })







  // We return the MQTT object for use elsewhere.

  return mqtt

}
