

const


  // in this funtion we break the livestream object
  // up into to components:
  // (1) privateData: the full livestream object
  // (2) publicData: it's poblically-safe counterpart

  sanitize_livestream = livestream => {
    return {
      privateData : livestream,
      publicData  : strapi.mux.get_public_stream_details(livestream),
      stream_key  : livestream.stream_key
    }
  },


  before_create = async context => {
    const livestream = await strapi.mux.create_livestream()
    context.params.data = {
      ... context.params.data,
      ... sanitize_livestream( livestream )
    }
  },


  before_update = async context => {
    // we get the event payload
    const data = context.params.data
    const livestream = data.livestream || data.privateData
    // we merge the old "data"; with the new sanitized one.
    // we conserve the old event payload here because it
    // contains strapi-generated metadata like "dateCreated"
    context.params.data = {
      ... data,
      ... sanitize_livestream( livestream )
    }
  },


  // In this function we handle updates to the 'livestream'.
  // We inform all connected socket clients of this new info.
  // the frontend of this project hanndles the rest.

  after_update = async result => {
    const livestream = await strapi.documents('api::livesteam.livestream').findOne({
      documentId: result.documentId,
      fields: '*', populate: [ 'events' ]
    })
    strapi.log.info(`[ * STREAM KEY: ${livestream.stream_key} ]`)
    delete livestream.privateData
    delete livestream.stream_key
    strapi.io.emit( 'stream_update', livestream)
  }



module.exports = {
  livestream_hooks() {
    return async ( context, next ) => {

      // before create or update 
      const { uid, action } = context

      if (uid == 'api::livestream.livestream' && action == 'create' ) {
        await before_create( context )
      } else if (uid == 'api::livestream.livestream' && action == 'update' ) {
        await before_update( context )
      }
    
      // after update 
      let result = await next()
      if (uid == 'api::livestream.livestream' && [ 'update' ].includes( action )) {
        await after_update( result )
      }
      
      return result
    }
  }
}