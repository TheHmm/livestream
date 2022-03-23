const

  get_links = ( event, strapi ) => {

    const 
      message = event.params.data,
      body    = message.body,
      links   = body && body.match( /(((https?:\/\/)|(www\.))[^\s]+)/g)

    if ( links ) {
      event.params.data.links = [ ...new Set( links ) ]
    } else {
      event.params.data.links = null
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

  async beforeCreate( event ) { get_links( event, strapi ) },
  async beforeUpdate( event ) { get_links( event, strapi ) },

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,
  afterDelete: after_delete,

}
