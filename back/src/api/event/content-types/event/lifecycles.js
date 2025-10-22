
/*
 *
 * ============================================================
 * WARNING: THIS FILE HAS BEEN COMMENTED OUT
 * ============================================================
 *
 * CONTEXT:
 *
 * The lifecycles.js file has been commented out to prevent unintended side effects when starting Strapi 5 for the first time after migrating to the document service.
 *
 * STRAPI 5 introduces a new document service that handles lifecycles differently compared to previous versions. Without migrating your lifecycles to document service middlewares, you may experience issues such as:
 *
 * - `unpublish` actions triggering `delete` lifecycles for every locale with a published entity, which differs from the expected behavior in v4.
 * - `discardDraft` actions triggering both `create` and `delete` lifecycles, leading to potential confusion.
 *
 * MIGRATION GUIDE:
 *
 * For a thorough guide on migrating your lifecycles to document service middlewares, please refer to the following link:
 * [Document Services Middlewares Migration Guide](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
 *
 * IMPORTANT:
 *
 * Simply uncommenting this file without following the migration guide may result in unexpected behavior and inconsistencies. Ensure that you have completed the migration process before re-enabling this file.
 *
 * ============================================================
 */

// const { difference } = require('../../../../utils')
// 
// module.exports = {
// 
// 
//   // In this function we handle updates to the 'event'.
//   // We inform all connected socket clients of new info.
//   // the frontend of this project hanndles the rest.
// 
//   async beforeUpdate( event ) {
// 
// 
//     const params    = event.params
// 
//     // fetch recording if asset_id provided
// 
//     const recording = params.data.mux_recording
// 
//     if ( recording ) {
//       const asset_id = recording.asset_id
//       const status = recording.status
//       if ( asset_id  && !status ) {
//         try {
//           const asset = await strapi.mux.get_asset( asset_id )
//           params.data.mux_recording = strapi.mux.get_public_asset_details( asset )
//           strapi.log.info(`[ * Playback ID: ${ params.data.mux_recording.playbackId }`)
//         } catch ( err ) {
//           console.error(err)
//           params.data.mux_recording = {
//             error: err,
//             asset_id: null,
//           }
//         }
//       }
//     }
// 
// 
//     // We get our new entry from event payload and our old
//     // one from Strapi.
// 
//     const
//       id        = params.where.id,
//       new_event = params.data,
//       slug      = params.data.slug,
//       api       = strapi.service( 'api::event.event' ),
//       old_event = await api.findOne( id, params ),
// 
// 
//       // We get the updates to the entry using difference
//       // function: @/back/src/utils.js
// 
//       diff      = difference( old_event, new_event )
// 
// 
//     // We delete confused differences from our diff object.
//     // Strapi is excluding the id when we use the findOne()
//     // function as well as returning dates as a string (and
//     // not an object)
// 
//     delete diff.id
//     delete diff.createdAt
//     delete diff.publishedAt
//     delete diff.createdBy
//     delete diff.updatedBy
// 
//     if ( diff.emoji_groups ) {
//       delete diff.emoji_groups
//     }
// 
//     diff.slug = slug
// 
// 
//     // If the update was meant to trigger a one off func
//     // in the front end (e.g. highlighting donate button)
//     // we switch it back off in Strapi.
// 
//     if ( diff.highlightDonateButton === true ) {
//       new_event.highlightDonateButton = false
//     }
// 
//     // We inform connected sockets.
// 
//     strapi.io.emit( 'event_update', diff )
// 
// 
// 
//   },
// 
// }
// 