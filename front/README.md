
# Front
## Environment Configuration

Configure your .env file based on [this example](/front/.env.example).
```
cd front
nano .env
```

## Installation

Install all the required libraries to build the app.

```sh
npm i
```

## Development

Compile and Hot-Reload for Development

```sh
npm run dev
```

## Deployment

Compile and minify for Production

```sh
npm run build
```

This will produce a directory `dist` with the built SPA. You should:
1. Move or symlink this directory to a web-accessible one and
2. Point your domain to this directory. 

**Note**: Because of the way Vue works, the domain you point to your application must be the one in your environment variable `VITE_APP_URL`.
## Apache / Nginx Configuration

Please refer to the [apache configuration example](/front/apache.example.conf).


This is an SPA, so it handles routing in the browser. This means that Apache/Nginx should fallback to the index.html file for all routes. Here is an example of how to do this in apache:

First, set `AllowOverride` to `All` in your global `apache2.conf` file:
```
<Directory /var/www/>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Then navigate to the root of your public `dist` directory, the one defined as `DocumentRoot` in your site's apache config, and create a `.htaccess` file with the following line:
```
FallbackResource index.html
```
