

const

  // check if livestream exists, else create it
  before_create = async context => {
    let livestream
    if ( !context.params.data.livestream ) {
      const { Name, slug } = context.params.data
      livestream = await strapi.documents( 'api::livestream.livestream' ).findFirst({ filters: { slug } })
      if ( !livestream ) {
        livestream = await strapi.documents( 'api::livestream.livestream' ).create({ data: { Name, slug } })
      }
      context.params.data.livestream = livestream.documentId
    }
  }

module.exports = {
  organisation_hooks() {
    return async ( context, next ) => {

      const { uid, action } = context
      if (uid == 'api::organisation.organisation' && [ 'create' ].includes( action )) {
        await before_create( context )
      }
      let result = await next()
      
      return result
    }
  }
}