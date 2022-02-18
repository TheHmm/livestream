// SOCKET.IO-specific fuctions are here for better legibility

module.exports = server => {

  const 

    // our socket.io options
    options = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: false
      },
      serveClient: false
    },

    // method to initialize socket.io server with strapi
    io = require('socket.io')(server, options)

    // method to get IP address of a connected socket
    getIP = socket => (
      socket.handshake.headers['x-forwarded-for'] ||
      socket.handshake.address.address
    )

  io.getIP = getIP

  // we return the io object for use in the bootstrap.js file
  return io

}
