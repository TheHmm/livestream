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


  async bootstrap(/*{ strapi }*/) {

    require( 'dotenv' ).config()


    // We get MUX_TOKEN_ details and the Mollie API key 
    // from our .env file.

    const 

      MUX_TOKEN  = {
        ID     : process.env.MUX_TOKEN_ID,
        SECRET : process.env.MUX_TOKEN_SECRET
      },
      MOLLIE_KEY = process.env.MOLLIE_API_KEY


    // We can only initialize MUX if MUX_TOKEN_ is provided;
    // else, we stop here and ask for MUX_TOKEN_ details.

    if ( !MUX_TOKEN.ID || !MUX_TOKEN.SECRET ) {
      throw new Error( 'MUX API TOKEN NOT PROVIDED!' )
    }


    // We can only initialize Mollie if the key is provided;
    // else, we stop here and ask for it.

    if ( !MOLLIE_KEY ) {
      throw new Error( 'MOLLIE API KEY NOT PROVIDED!' )
    }


    // We import and initialize our MUX, MOLLIE & IO modules. 
    // These files contain the respecitve configurations and
    // methods of these objects.

    const 

      mux    = require( './mux' )( MUX_TOKEN ),
      mollie = require( './mollie' )( MOLLIE_KEY ),
      io     = require( './io'  )( strapi.server.httpServer )

    
    // If either of the three were not initialized properly,
    // we stop here and return an error 

    if ( !mux || !mollie || !io ) {
      throw new Error( 
        'MUX, MOLLIE or IO objects were not initialized.' 
      )
    }


    // We "register" these three objects onto our strapi 
    // instance so that we can use them in controllers &
    // lifecycle hooks (eg. strapi.mux.get_start_time).

    strapi.mux    = mux
    strapi.mollie = mollie
    strapi.io     = io



    // Our main livestream initialization function. 

    const initialize = async () => {

      let 
        found,
        livestream

      
      // First we get the 'livestream' entry from Strapi.
      // This entry will contain these two JSON feilds:
      // (1) privateData: livestream that we create with MUX
      // (2) publicData: a public-safe version of it
      
      try { 
        found = await 
        strapi
        .service( 'api::livestream.livestream' )
        .find()
        
        
        // If the entry has already been created before, then
        // pull the livestream ID and request from the MUX API
        // the latest information about the stream.
        
        const id = found ?.privateData ?.id
        
        if ( id ) { 
          strapi.log.info( 'Found existing livestream.' )
          livestream = await mux.get_livestream( id )

        
        // Else, we request from the MUX API to create a new
        // livestream, using the options that we defined in the
        // 'mux.js' module.

        } else {
          strapi.log.info( 'Requesting new livestream.' )
          livestream = await mux.create_livestream()
        }


        // Then, we update the 'livestream' entry in Strapi
        // with the new or updated livestream object.

        return await 
          strapi
          .service( 'api::livestream.livestream' )
          .createOrUpdate({
            data: { livestream }
          })


      // It's possible something went wrong with MUX or
      // Strapi. We return here.
            
      } catch ( error ) {
        throw error
      }

    }


    let 
      srt = null,
      cc  = []

    io.on('connection', socket => {

      socket.on('hello', data => {
        console.log('hello', data)
        io.sockets.emit('hello', data)
      })


      // Closed Captions

      // There are two socket "rooms" for closed captions:
      // (1) srt : for the full .srt file (for html players)
      // (2) cc : for individual, timestamped captions
      
      // Marco's OBS Setup: Marco is creating captions in his
      // browser with the tool: @/misc/cc. He opens the page,
      // pipes the livestream audio OBS into it as his "mic"
      // input and it uses the Google Voice Recognition API to
      // transform audio into captions.

      // The webpage is subscirbed to both the 'cc' and 'srt' 
      // socket rooms. It produces the individual captions &
      // the srt file locally and sends them here.

      // Viewers can subscribed to either rooms: 'srt' if they
      // are using an normal <video> or <audio> player and 'cc'
      // if they are using the text-only player.


      // Viewers joining 'srt' room will get the full srt file 
      // every time it is updated by marco

      socket.on('join_SRT_room', () => {
        socket.join('srt')
        socket.emit('confirm_join_SRT', srt )
      })
      
      socket.on('leave_SRT_room', () => {
        socket.leave( 'srt' )
        socket.emit( 'confirm_leave_SRT' )
      })     
      
      
      // Viewers joining 'cc' room will get the captions that
      //  have been previously recorded.

      socket.on('join_CC_room', () => {
        socket.join('cc')
        socket.emit('confirm_join_CC', cc)
      })
      
      socket.on('leave_CC_room', () => {
        socket.leave( 'cc' )
        socket.emit( 'confirm_leave_CC' )
      })


      // An 'interim' (raw) caption event is only interesting 
      // for the viewers in 'cc' room; they see the captions  
      // update in real time.

      socket.on('interm', caption => {
        io.to( 'cc' ).emit('interm', caption )
      })


      // A 'final' caption event contains a finalized caption
      // as well as an updated srt file. The caption is for 
      // the 'cc' room and the srt is for the 'srt' room.

      socket.on('final', result => {
        cc.push( result.caption )
        io.to( 'cc' ).emit( 'final', result.caption )
        srt = result.srt
        io.to( 'srt' ).emit( 'srt' , srt)
      })


      const
        userCount = () => socket.client.conn.server.clientsCount

      strapi.log.info(`[ USER COUNT: ${userCount()} ]`)
      io.emit('count', userCount())


      socket.on('disconnect', () => {
        strapi.log.info(`[ USER COUNT: ${userCount()} ]`)
        io.emit('users', userCount() - 1)
      })


    })



    await initialize()


  },
};
