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

  // We initialize socket.io server with strapi and
  // return the io object for use elsewhere.

  return require( 'socket.io' )( server, options )

}
