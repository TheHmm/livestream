module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  {
    name: "strapi::cors",
    config: {
      expose: ["WWW-Authenticate", "Server-Authorization", 'Content-Type', 'Authorization', 'Origin', 'Accept']
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
