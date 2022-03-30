module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'b625f66afe16f882ef60b85a25903a16'),
  },
  url: env('ADMINURL', ''),
});
