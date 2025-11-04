

const


  // Extract an array of unique links from string

  link_regex = /(((https?:\/\/)|(www\.))[^\s]+)/g,

  get_links = body => {
    const links = body.match( link_regex )
    if ( !links ) { return null }
    return [ ...new Set( links ) ]
  },


  // Extract an array of unique emoji from string

  emoji_regex = /\p{Emoji_Presentation}/gu,

  get_emoji = body => {
    const emoji = body.match( emoji_regex )
    if ( !emoji ) { return null }
    return [ ...new Set( emoji ) ]
  },


  // Extract links and emoji from message boy and add them
  // as their own fields.

  before_create_or_update = context => {
    const body = context.params.data.body
    if ( body ) {
      // set time based on universal agreement
      context.params.data.time  = new Date().getTime()
      context.params.data.links = get_links( body )
      context.params.data.emoji = get_emoji( body )
    }
  },


  // Inform sockets of message and send emoji as socket event
  // if it contains any. The message sender relation is an id
  // and sadly not a uuid, since thats a custom field. But the
  // uuid is what is attached to the emoji, so we have to pull
  // that from our db.

  after_create_or_update = async (context, result) => {
    const documentId = result.documentId
    const message = await strapi.documents('api::message.message').findOne({
      documentId,
      fields: '*', populate: [ 'sender', 'event', 'in_response_to', 'Reactions', "Reactions.Emoji", "Reactions.Emoji.image", "Reactions.sender" ]
    })
    if ( !message ) {
      return
    }
    if ( context.action == 'create' ) {
      message.is_new = true
    }
    strapi.io.to(message.event.slug).emit( 'message', message )
    if ( message.emoji ) {
      try {
        const { uuid } = message.sender
        const group    = '__DEFAULT__'
        const emoji    = message.emoji[0]
        strapi.io.to(message.event.slug).emit( 'emoji', { group, emoji, uuid })
      } catch ( error ) {
        console.log(error)
      }
    }
    if ( strapi.mqtt ) {
      let body = message.body
      if ( body?.startsWith( "/" ) ) {
        body = body.slice( 1 )
        const [ action, data ] = body.split(':')
        strapi.mqtt.send( `server:${ action }:${ data?.trim() }` )
      }
    }
  },


  // Inform sockets of deletion

  after_delete = result => {
    strapi.io.emit( 'message', {
      documentId : result.documentId,
      deleted : true
    })
  }

module.exports = {
  message_hooks() {
    return async ( context, next ) => {

      // before create or update 
      const { uid, action } = context

      if (uid == 'api::message.message' && [ 'create', 'update' ].includes( action )) {
        await before_create_or_update( context )
      }
    
      let result = await next()

      if (uid == 'api::message.message') {
        if ([ 'create', 'update' ].includes( action )) {
          
          // after create or update 
          await after_create_or_update( context, result )
        } else if ( action == 'delete' ) {

          // after delete
          await after_delete( result )
        }
      }
      
      return result
    }
  }
}