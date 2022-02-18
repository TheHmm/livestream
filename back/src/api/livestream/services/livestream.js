'use strict';

/**
 * livestream service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::livestream.livestream');
