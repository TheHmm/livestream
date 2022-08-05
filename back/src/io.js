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

  const io = require( 'socket.io' )( server, options )


  // Dirty method to log the # of connected sockets
  // We save the count to an array of counts for reference.
  // this array is emptied in the cron job.

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


  // We return the io object for use elsewhere.

  return io

}
