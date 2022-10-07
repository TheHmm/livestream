// SOCKET.IO fuctions are here for better legibility

module.exports = ({ HOST, TOPIC }) => {


  // We initialize mqtt client with strapi

  const mqtt = require( 'mqtt' ).connect( HOST )

  mqtt.send = payload => {
    mqtt.publish( TOPIC, payload )
  }

  mqtt.actions = {

    say_hi( sender, data ) {
      console.log( "Hello!", sender, data )
    },

    connect( sender, data ) {
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

    emoji( sender, emoji ) {
      const uuid = `ESP-${ sender }`
      strapi.io.socket_emoji({
        group : "global",
        emoji,
        uuid,
      })
    },

  }


  mqtt.on( 'connect', () => {
    console.log( 'MQTT connected to host: ', HOST )
    mqtt.subscribe( TOPIC )
    // let i = 0
    // setInterval(() => {
    //   mqtt.send( `server:say_hi:${ i }` )
    //   i ++
    //   if ( i == 10 ) {
    //     i = 0
    //   }
    // }, 5000 )
  })

  mqtt.on( 'message', ( topic, payload ) => {
    const [ sender, action, data ] = payload.toString().split( ':' )
    console.log( sender, action, data )
    if ( mqtt.actions[action] ) {
      mqtt.actions[action]( sender, data )
    } else {
      console.log( `MQTT action "${ action }" not found.` )
    }
  })


  // We return the mqtt object for use elsewhere.

  return mqtt

}
