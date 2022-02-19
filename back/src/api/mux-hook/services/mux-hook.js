'use strict';

/**
 * mux-hook service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mux-hook.mux-hook');
