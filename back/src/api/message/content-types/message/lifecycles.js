const

  link_regex = /(((https?:\/\/)|(www\.))[^\s]+)/g,
  // emoji_regex = /^(?:(?!(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]))[^`~!+,!@#$%^&*();\/|<>"0-9=[\]{}_☺]){1,255}$/g,
  emoji_regex = /\p{Emoji}/gu,

  get_links = body => {
    const links = body.match( link_regex )
    if ( !links ) {
      return null
    }
    return [ ...new Set( links ) ]
  },

  get_emoji = body => {
    const emoji = body.match( emoji_regex )
    if ( !emoji ) {
      return null
    }
    return [ ...new Set( emoji ) ]
  },

  before_create_or_update = event => {
    const
      message = event.params.data,
      body    = message.body

    if ( body ) {
      event.params.data.links = get_links( body )
      event.params.data.emoji = get_emoji( body )
    }



  },

  after_create_or_update = async event => {
    const message = { ...event.params.data, ...event.result }
    strapi.io.emit( 'message', message )
    if ( message.emoji ) {
      try {
        const { uuid } = await strapi.service('api::viewer.viewer').findOne( message.sender )
        const group = '__DEFAULT__'
        const emoji = message.emoji[0]
        strapi.io.emit( 'emoji', { group, emoji, uuid })
      } catch ( error ) {
        console.log(error)
      }
    }
  },

  after_delete = event => {
    const message = {
      time: event.result.time,
      deleted: true
    }
    strapi.io.emit( 'message', message )
  }




module.exports = {

  beforeCreate: before_create_or_update,
  beforeUpdate: before_create_or_update,

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

  afterDelete: after_delete,

}
