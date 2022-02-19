'use strict';

/**
 * mux-hook router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mux-hook.mux-hook');
