module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  proxy: env.bool('TRUST_PROXY', false),
  url: env('URL', ''),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
