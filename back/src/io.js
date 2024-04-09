// SOCKET.IO fuctions are here for better legibility

module.exports = server => {


  // our socket.io options

  const options = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: false
    },
    serveClient: false
  }


  // We initialize socket.io server with strapi

  const io = require( 'socket.io' )(  server, options )


  // Dirty method to log the # of connected sockets
  // We save the count to an array of counts for reference.
  // NOTE: this array is emptied in the cron job.

  io.counts = []

  io.count = socket => {
    const count = socket.client.conn.server.clientsCount
    io.counts.push( count )
    return count
  }

  // We create a an array to hold connected viewers'
  // uuids and attach methods to add/rm uuid.

  io.uuids = []

  io.add_uuid = uuid => {
    if ( io.uuids.indexOf( uuid ) < 0 ) {
      io.uuids.push( uuid )
    }
  }

  io.rm_uuid = uuid => {
    if ( io.uuids.indexOf( uuid ) > -1 ) {
      io.uuids.splice( io.uuids.indexOf( uuid ), 1 )
    }
  }


  // We create a an array to hold closed captions cues and
  // attach methods to add/rm cues.

  io.cc = []

  io.add_cue = cue => {
    if ( io.cc.indexOf( cue ) < 0 ) {
      io.cc.push( cue )
    }
  }

  io.rm_cue = cue => {
    if ( io.cc.indexOf( cue ) > -1 ) {
      io.cc.splice( io.cc.indexOf( cue ), 1 )
    }
  }


  // When a socket sends us the viewer event, it will
  // only contain the socket's uuid and its connected
  // status. We save the uuid to our array and inform
  // the rest. Note: io.emit( 'viewer' ) is also called
  // in the viewers after create/update hooks.

  function socket_viewer( viewer ) {
    io.add_uuid( viewer.uuid )
    io.emit( 'viewer', {
      uuid      : viewer.uuid,
      name      : viewer.name,
      connected : true
    })
  }


  // Emoji proxy

  function socket_emoji( emoji ) {
    io.emit( 'emoji', emoji )
  }


  // When a viewer disconnect, we remove their uuid
  // from our array of connected viewers' uuids and
  // inform the rest.

  function socket_disconnect( uuid ) {
    io.rm_uuid( uuid )
    io.emit( 'viewer', {
      uuid,
      connected: false,
    })
  }


  // There is a socket room for closed captions: "cc".
  // Marco's OBS Setup: Marco is creating captions in his
  // browser with the tool: @/misc/cc. He opens the page,
  // pipes the livestream audio OBS into it as his "mic"
  // input and it uses the Google Voice Recognition API to
  // transform audio into captions.

  // The webpage is subscribed to the 'cc' socket room.
  // It produces captions locally and sends them here.

  // Viewers joining 'cc' room will get the captions that
  // have been previously recorded.

  function socket_join_CC_room( socket ) {
    socket.join( 'cc' )
    socket.emit( 'confirm_join_CC', io.cc )
  }

  function socket_leave_CC_room( socket ) {
    socket.leave( 'cc' )
    socket.emit( 'confirm_leave_CC' )
  }

  // An 'interim' (raw) caption event is only interesting
  // for the viewers in 'cc' room; they see the captions
  // update in real time.

  function socket_interm( cue ) {
    io.to( 'cc' ).emit( 'interm', cue )
  }


  // A 'final' caption event contains a finalized caption
  // as well as an updated srt file. The caption is for
  // the 'cc' room and the srt is for the 'srt' room.

  function socket_final( cue ) {
    io.add_cue( cue )
    io.to( 'cc' ).emit( 'final', cue )
  }


  // This is so that Marco can clear the icrememnting cc
  // array when the livestream is over.

  function socket_clear_CC() {
    io.cc.length = 0
    io.to( 'cc' ).emit( 'clear_CC', io.cc )
  }


  // any other miscellaneous functions

  function socket_misc( data ) {
    io.emit( 'misc', data )
  }



  // Live stuff !!!

  function socket_connect( socket ) {

    let uuid // soocket's uuid, client-generated.

    io.count( socket ) // get a new count


    // When a socket connect for the first time, we send
    // it our array of connected sockets' uuids.

    socket.emit( 'viewers', io.uuids )

    socket.on( 'viewer', ( viewer ) => {
      if ( viewer.uuid ) {
        uuid = viewer.uuid
        socket_viewer( viewer )
      }
    })

    socket.on( 'emoji', ( emoji ) => {
      socket_emoji( emoji )
      if ( strapi.mqtt ) {
        strapi.mqtt.hmmosphere.handler( emoji )
      }
    })

    socket.on( 'disconnect', () => {
      io.count( socket ) // get a new count
      socket_disconnect( uuid )
    })

    socket.on( 'join_CC_room', () => {
      socket_join_CC_room( socket )
    })

    socket.on( 'leave_CC_room', () => {
      socket_leave_CC_room( socket )
    })

    socket.on( 'interm', ( cue ) => {
     socket_interm( cue )
    })

    socket.on( 'final', ( cue ) => {
      socket_final( cue )
    })

    socket.on( 'clear_CC', () => {
      socket_clear_CC()
    })



  }


  io.on( 'connection', socket_connect )

  io.socket_connect       = socket_connect
  io.socket_viewer        = socket_viewer
  io.socket_emoji         = socket_emoji
  io.socket_disconnect    = socket_disconnect
  io.socket_join_CC_room  = socket_join_CC_room
  io.socket_leave_CC_room = socket_leave_CC_room
  io.socket_interm        = socket_interm
  io.socket_final         = socket_final
  io.socket_clear_CC      = socket_clear_CC
  io.socket_misc          = socket_misc



  // We return the io object for use elsewhere.

  return io

}
