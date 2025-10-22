
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

// const
// 
// 
//   // in this funtion we break the livestream object
//   // up into to components:
//   // (1) privateData: the full livestream object
//   // (2) publicData: it's poblically-safe counterpart
// 
//   sanitize_livestream = livestream => {
//     return {
//       privateData : livestream,
//       publicData  : strapi.mux.get_public_stream_details(livestream),
//       stream_key  : livestream.stream_key
//     }
//   },
// 
// 
//   // Custom MUX livestream making interface
// 
//   before_create_or_update_handler = async event => {
// 
//     // we get the event payload
// 
//     const data = event.params.data
// 
//     let livestream
// 
// 
//     // We use the requestNewLivestream property to make a
//     // request for a new livestream from MUX, this way we
//     // can create a new livestream without needing to re-
//     // boot the server
// 
//     if ( data.requestNewLivestream === true ) {
//       livestream = await strapi.mux.create_livestream()
//       data.requestNewLivestream = false
// 
// 
//     // Else, we keep the event payload as the livestream
//     // Here, the payload is carried different from different
//     // events, create or update...
// 
//     } else {
//       livestream = data.livestream || data.privateData
//     }
// 
// 
//     // we merge the old "data" with the new sanitized one.
//     // we conserve the old event payload here because it
//     // contains strapi-generated metadata like "dateCreated"
// 
//     event.params.data = {
//       ... data,
//       ... sanitize_livestream( livestream )
//     }
// 
// 
//     // we log the STREAM-KEY to be able to access it
// 
//     strapi.log.info(`[ * STREAM KEY: ${livestream.stream_key} ]`)
// 
//   },
// 
// 
//   // In this function we handle updates to the 'livestream'.
//   // We inform all connected socket clients of this new info.
//   // the frontend of this project hanndles the rest.
// 
//   after_update_handler = event => {
//     strapi.io.emit( 'stream_update', event.result.publicData )
//   }
// 
// 
// 
// 
// module.exports = {
// 
//   beforeCreate : before_create_or_update_handler,
//   beforeUpdate : before_create_or_update_handler,
//   afterUpdate  : after_update_handler,
// 
// }
// 