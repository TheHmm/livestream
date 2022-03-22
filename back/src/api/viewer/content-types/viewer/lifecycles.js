const


  create_uuid = async ( viewer, strapi ) => {
    try {
      return await strapi
      .plugins['content-manager']
      .services
      .uid
      .generateUIDField({
        contentTypeUID: 'api::viewer.viewer',
        field: 'uuid',
        data: viewer,
      })
    } catch ( error ) {
      console.error( error )
    }
  }

  before_create_or_update = async ( event, strapi ) => {

    // we get the event payload

    const viewer = event.params.data
    
    if ( viewer.name && !viewer.uuid ) {
      event.params.data.uuid = await create_uuid( viewer, strapi )
    }
    console.log(event.params.data)

  },

  after_create_or_update = event => {
    strapi.io.emit( 'viewer', event.result )
  }




module.exports = {

  async beforeCreate( event ) { await before_create_or_update( event, strapi ) },
  async beforeUpdate( event ) { await before_create_or_update( event, strapi ) },

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

}
