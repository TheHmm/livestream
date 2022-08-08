const


  create_uuid = async viewer => {
    try {
      return await strapi
      .plugins['content-manager']
      .services
      .uid
      .generateUIDField({
        contentTypeUID : 'api::viewer.viewer',
        field          : 'uuid',
        data           : viewer,
      })
    } catch ( error ) {
      console.error( error )
    }
  },

  before_create_or_update = async event => {
    const viewer = event.params.data
    if ( viewer.name && !viewer.uuid ) {
      event.params.data.uuid = await create_uuid( viewer, strapi )
    }
  },

  after_create_or_update = event => {
    event.result.connected = true
    strapi.io.emit( 'viewer', event.result )
  }


module.exports = {
  beforeCreate : before_create_or_update,
  beforeUpdate : before_create_or_update,
  afterCreate  : after_create_or_update,
  afterUpdate  : after_create_or_update,
}
