// MQTT ; using this protocol to communicate with the ESP32
// devices that are sometimes in the sapce.

let rotate = false

module.exports = ({ HOST, TOPIC }) => {


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
      }, 10 * 60 * 1000 )
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
    }


    // set accent color for the entire event


    // make the donate button bounce


    // change volume


    // ...

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