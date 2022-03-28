
# Back

## Environment Configuration

Configure your .env file based on [this example](/back/.env.example).
```
cd back
nano .env
```
## Installation

Then you can install the required libraries ( ~ 700MB ) and build the admin UI.

```
npm i
npm run build 
```

## Development

In a development environment, start Strapi with autoReload enabled. 
```
npm run develop
```
## Deployment

In a production environment, start Strapi with autoReload disabled.
```
npm run start
```

Strapi will start on the port configured in the .env file. If any errors occur with initializing mux or mollie clients, it will throw an error and exit.

## Apache / Nginx Configuration

At this point, you should set up a dedicated domain / subdomain for Strapi ( separate from the Vue SPA ) in your DNS manager and point it to your server's IP address. 

Next, configure a site in your apache or nginx webserver for this domain and set it up to proxy connections to the port where Strapi is running.

**Note**: Strapi will also be running a socket.io server instance to relay messages, livestream updates and emojis to connected viewers. Please make sure to configure your apache / nginx configuration file to handle these connections.

**Please refer to the [apache configuration example](/back/api.apache.example.conf).**

The example given assumes that you can generate a self-signged SSL certificate on your server, as this is recccommended for Strapi to work across origins!

# todo: maxconnections count on apache 

## Creating Users

You can head over to `https://{ your-strapi-host }/admin` and create your admin users / other users.

*( Note for Marco: please create a user for me with author/editor permissions so i can migrate content. )*

## Daemonizing

To keep the application running on the server, you need a node proccess manager / daemonizer. I am using `[pm2](https://pm2.keymetrics.io/)` for this:
```
cd back
pm2 start "npm run start" --name "API.LIVE"
```
Viewing logs:
```
pm2 logs API.LIVE
```
Stopping:
```
pm2 stop API.LIVE
```
Restarting
```
pm2 restart API.LIVE
```

## Mux

Last, head over to your mux dashboard and set up a webhook in your settings that points to the following URL scheme:
```
https://{ your-strapi-host }/api/mux-hook
```
This webhook will inform Strapi of all its video and livestream API events, and Strapi in turn informs connected clients of these events. Make sure you pick the appropriate environment. 
