module.exports = ({ env }) => ({
  url: env('ADMINURL', ''),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: { 
      accessTokenLifespan: 604800, // insecure
      maxRefreshTokenLifespan: 2592000, // is default, but doesnt seem to work 
    }
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
});
