// https://github.com/strapi/strapi/issues/23892#issuecomment-3113138234

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.request.method === 'PUT') {
      // Log for debugging
      console.log(ctx.request.body);

      // If password is null, remove it to avoid validation error
      if (ctx.request.body?.password === null) {
        console.log("Removing null password...");
        delete ctx.request.body.password;
      }
    }

    await next();
  };
};
