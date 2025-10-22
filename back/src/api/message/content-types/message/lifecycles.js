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

  before_create_or_update = event => {
    const body = event.params.data.body
    if ( body ) {
      // set time based on universal agreement
      event.params.data.time  = new Date().getTime()
      event.params.data.links = get_links( body )
      event.params.data.emoji = get_emoji( body )
    }
  },


  // Inform sockets of message and send emoji as socket event
  // if it contains any. The message sender relation is an id
  // and sadly not a uuid, since thats a custom field. But the
  // uuid is what is attached to the emoji, so we have to pull
  // that from our db.

  after_create_or_update = async event => {
    let message
    if ( event.action == 'afterCreate' ) {
      message = { ...event.params.data, ...event.result }
      message.is_new = true
    } else if ( event.action == 'afterUpdate' ) {
    // new solution is much slower but includes all emoji reactions:
      message = await strapi.entityService.findOne( 'api::message.message', event.params.data.id, {
        fields: '*',
        populate: {
          sender: {},
          event: {},
          in_response_to: { fields: '*' },
          Reactions: { populate: [ 'Emoji', 'Emoji.image', 'sender' ] }
        },
      })
      // const message = await strapi.entityService.findOne( 'api::message.message', event.params.data.id, {
      //   fields: '*',
      //   populate: {
      //     sender: true,
      //     event: true,
      //     in_response_to: true,
      //     Reactions: { 
      //       populate: {
      //         Emoji:  { 
      //           populate: {
      //             image: true
      //           }
      //         },
      //         sender: true
      //       }
      //     }
      //   },
      // })
    }
    strapi.io.emit( 'message', message )
    if ( message.emoji ) {
      try {
        const { uuid } = await strapi.service('api::viewer.viewer').findOne( message.sender )
        const group    = '__DEFAULT__'
        const emoji    = message.emoji[0]
        strapi.io.emit( 'emoji', { group, emoji, uuid })
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

  after_delete = event => {
    strapi.io.emit( 'message', {
      time    : event.result.time,
      deleted : true
    })
  }




module.exports = {

  beforeCreate : before_create_or_update,
  beforeUpdate : before_create_or_update,
  afterCreate  : after_create_or_update,
  afterUpdate  : after_create_or_update,
  afterDelete  : after_delete,

}
