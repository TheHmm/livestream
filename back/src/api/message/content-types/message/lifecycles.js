const

  get_links = event => {
    const links = body.match( /(((https?:\/\/)|(www\.))[^\s]+)/g)
    if ( !links ) {
      return null
    }
    return [ ...new Set( links ) ]
  },

  before_create_or_update = event => {
    const 
      message = event.params.data,
      body    = message.body

    if ( body ) {
      event.params.data.links = get_links( body )
      
    }
    
    

  },

  after_create_or_update = event => {
    const message = { ...event.params.data, ...event.result }
    console.log( message )
    strapi.io.emit( 'message', message )
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
