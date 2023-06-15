module.exports = ({ env }) => ({
  url: env('ADMINURL', ''),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
});
