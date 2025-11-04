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
  
    before_create_or_update = async context => {
      const viewer = context.params.data
      if ( viewer.name && !viewer.uuid ) {
        context.params.data.uuid = await create_uuid( viewer, strapi )
      }
    },
  
    after_create_or_update = async result => {
      const documentId = result.documentId
      const viewer = await strapi.documents('api::viewer.viewer').findOne({ 
        documentId, fields: '*', populate: { events: { fields: 'slug' } } 
      })
      if ( !viewer ) {
        return
      }
      viewer.connected = true
      for ( const event of viewer.events ) {
        strapi.io.to(event.slug).emit( 'viewer', viewer )
      }
    }

module.exports = {
  viewer_hooks() {
    return async ( context, next ) => {

      // before create or update 
      const { uid, action } = context
      if (uid == 'api::viewer.viewer' && [ 'create', 'update' ].includes( action )) {
        await before_create_or_update( context )
      }
    
      // after create or update 
      let result = await next()
      if (uid == 'api::viewer.viewer' && [ 'create', 'update' ].includes( action )) {
        await after_create_or_update( result )
      }
      
      return result
    }
  }
}