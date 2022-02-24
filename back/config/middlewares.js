module.exports = [
  'strapi::errors',
  'strapi::security',
  // 'strapi::cors',
  {
    name: "strapi::cors",
    config: {
      expose: [
        // "WWW-Authenticate", 
        // "Server-Authorization", 
        // 'Content-Type', 
        // 'Authorization', 
        // 'Origin', 
        // 'Accept',
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Expose-Headers"
      ]
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
