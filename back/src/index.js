'use strict';

module.exports = {


  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */


  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */


  bootstrap(/*{ strapi }*/) {


    // CUSTOM CODE STARTS HERE

    process.nextTick(() => {


      // We get MUX_TOKEN_ details from root .env file.
  
      require('dotenv').config({ path: '../.env' })

      const MUX_TOKEN = {
        ID     : process.env.MUX_TOKEN_ID,
        SECRET : process.env.MUX_TOKEN_SECRET
      }
  
  
      // We can only initialize MUX if MUX_TOKEN_ is provided;
      // else, we stop here and ask for MUX_TOKEN_ details.
  
      if (!MUX_TOKEN.ID || !MUX_TOKEN.SECRET) {
        return console.error('MUX API TOKEN NOT PROVIDED!')
      }
  
  
      // We import and initialize our MUX and IO objects. 
      // These files contain the respecitve configurations 
      // and methods of the two objects.
  
      const 
  
        mux = require( './mux' )( MUX_TOKEN ),
        io  = require( './io'  )( strapi.server.httpServer )
  
      
      // If either of the two were not initialized properly,
      // we stop here and return an error 
  
      if (!mux || !io) {
        console.error('The MUX object or IO server was not initialized properly.')
        return
      }


      // We register these two objects onto our strapi 
      // instance so that we can use them in other parts
      // of our App.

      strapi.mux = mux
      strapi.io  = io

      
      // Our livestream object

      let livestream


      // Our main livestream initialization function. 

      const initialize = async () => {


        // First we get the 'livestream' entry from Strapi.
        // This entry will contain these two JSON feilds:
        // (1) privateData: livestream that we create with MUX
        // (2) publicData: a public-safe version of it
        
        strapi
        .service('api::livestream.livestream')
        .find()
        .then( async response => {


          // If the entry has already been created before, then
          // pull the livestream ID and request from the MUX API
          // the latest information about the stream.

          if (response?.privateData?.id) {
            strapi.log.info('Found existing livestream.')
            await mux
            .getLiveStream(response.privateData.id)
            .then(result => livestream = result)
            .catch(err => {
              strapi.log.fatal('mux err')
              console.log(err)
            })


          // Else, we request from the MUX API to create a new
          // livestream, using the options that we defined in the
          // 'mux.js' module.

          } else {
            strapi.log.info('Requesting new livestream.')
            await mux
            .createLiveStream()
            .then(result => livestream = result)
            .catch(err => {
              strapi.log.fatal('mux err')
              console.log(err)
            })
          }

          if (livestream) {

            // Then, we update the 'livestream' entry in Strapi
            // with the new or updated livestream object.

            await strapi
            .service('api::livestream.livestream')
            .createOrUpdate({
              data: { livestream }
            })

          }

      })
      .catch(err => {
        strapi.log.fatal('strapi err')
        console.log(err)
      })

    }
  
  
  
      io.on('connection', socket => {
  
        const
          userCount = () => socket.client.conn.server.clientsCount,
          ip = io.getIP(socket)
  
        strapi.log.info(`[ USER COUNT: ${userCount()} ]`)
        io.emit('count', userCount())
  
        socket.on('user', user => {
          user.ip  = ip
          user.uid = ip.replace(/\./g, '') + user.name
          io.sockets.emit('user', user)
          // strapi.services.users.createOrUpdate(user)
          socket.emit('userConfirm', user.uid)
        })
  
        socket.on('block', user => {
          io.sockets.emit('user', user)
          // strapi.services.users.createOrUpdate(user)
        })
  
        socket.on('message', message => {
          io.sockets.emit('message', message)
          // strapi.services.messages.createOrUpdate(message)
        })
  
        socket.on('announcement', ann => {
          io.sockets.emit('announcement', ann)
          // strapi.services.announcements.createOrUpdate(ann)
        })
  
        socket.on('clearusers', () => {
          io.sockets.emit('clearusers')
          // strapi.services.deletealluser
        })
  
        socket.on('clearchat', () => {
          io.sockets.emit('clearchat')
          // strapi.services.deleteallmessafgew
        })
  
        socket.on('geothenticate', () =>  {
          const country = geoip.lookupCountry(ip)
          socket.emit('geothenticated', {
            ip, country, authenticated: geoAuth(country)
          })
        })
  
        socket.on('smog', smog => {
          io.sockets.emit('smog', smog)
        })
  
        socket.on('effect3D', effect3D => {
          io.sockets.emit('effect3D', effect3D)
        })
  
        socket.on('disconnect', () => {
          strapi.log.info(`[ USER COUNT: ${userCount()} ]`)
          io.emit('users', userCount() - 1)
        })
  
  
  
  
      })
  
  
  
      initialize('livestream')
  
  
  
  
    })

  },
};
