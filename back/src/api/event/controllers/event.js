'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories
const bcrypt =  require('bcryptjs')

const password_protected_fields = [
  'password',
  'livestream',
  'mux_recording',
  'viewers',
  'messages',
  'announcements'
]

async function validate_password( password, hash ) {
  return bcrypt.compare(password, hash)
}

module.exports = createCoreController('api::event.event', ({ strapi }) =>  ({


  // replace core ind controller to hide password protected
  // data from the entrie

  async find( ctx ) {
    const { data: entities } = await super.find( ctx )
    for ( const entity of entities ) {
      if ( entity.password_protected ) {
        for ( const key of Object.keys( entity ) ) {
          if ( password_protected_fields.includes( key ) ) {
            delete entity[key]
          }  
        }
      }
    }


    // We return the entities, transformed and sanitzed.

    const sanitized = await this.sanitizeOutput( entities, ctx)
    return this.transformResponse( sanitized )

  },


  // We cresate our own controller used to fetch individual
  // entries using their slug, na optional password, or even
  // just to count them

  async find_one_with_password( ctx ) {


    // We get the slug and query from ctx.

    const
      { slug } = ctx.request.params,
      { params, password } = ctx.request.body


    // Cutom "count" controller to count our events. This is used in
    // the front-end to check whether the client has the right number
    // of events locally before GETting them all. For some reason, i
    // can't register this in Strapi as it's own controller. See:
    // https://forum.strapi.io/t/how-to-count-in-rest-api-in-v4/14765

    if ( slug == 'count' ) {
      
      return strapi
      .documents( 'api::event.event' )
      .count( params )

    } else {


      // We query the database for the given entry by its slug.

      const entity = await strapi.documents( 'api::event.event' ).findFirst({
        filters : { slug },
        fields : params.fields,
        populate : params.populate
      })

      if ( entity.password_protected ) {
        if ( !password ) {
          console.log( 'no passowrd' )
          for ( const key of Object.keys( entity ) ) {
            if ( password_protected_fields.includes( key ) ) {
              delete entity[key]
            }  
          }
          // return ctx.forbidden('Please provide password')
        } else {
          const password_valid = await validate_password( password, entity.password )
          console.log( password, entity.password, password_valid )
          if ( !password_valid ) {
            // for ( const key of Object.keys( entity ) ) {
            //   if ( password_protected_fields.includes( key ) ) {
            //     delete entity[key]
            //   }  
            // }
            return ctx.forbidden('Invalid password')
          }
        }
      }


      // We return the entity, transformed and sanitzed.

      const sanitized = await this.sanitizeOutput( entity, ctx)
      return this.transformResponse( sanitized )

    }

  },


  // log nubmer of views, called in the component mounted hook

  async log_visit( ctx ) {

    const { slug } = ctx.params;
    try {
      const event = await strapi.documents('api::event.event').findFirst({ filters: { slug } })
      event.later_visits += 1
      await strapi.documents( "api::event.event" ).update({ 
        documentId: event.documentId,
        data: { later_visits: event.later_visits } 
      })
      return ctx.send({ success: true, visits: event.later_visits })
    } catch (error) {
      console.error(error)
      return ctx.send({ success: false })
    }

  }


}))
