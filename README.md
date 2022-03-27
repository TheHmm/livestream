# The Hmm Livestream v2

Second version of the Hmm Livestream website with:
- a CMS to archive livestreams and maagge the chats
- an SPA for custom routing
- a revamped stylesheet
- multiple view modes for livestreams
- an attempt at closed captions

## Project Structure

| Directory | Function          |
|-----------|-------------------|
| back      |  Strapi CMS       |
| front     |  Vue SPA          |
| misc      |  Captions, etc... |




### Reuqirements

- A server with apache (or nginx) to serve static files and act as a proxy
- NodeJS >=12 <=14 ( this was developed with v14.19.0 )
- NPM >= 6.x
- a node process manager to handle updates like `pm2`
- enough RAM / CPU cores / network bandwidth to handle 100+ active socket connections

### Installation

Clone this repository
#### Strapi

```
cd back
npm i
npm run build 
```

#### Vue

```
cd front
npm i
npm run build
```

## Deployment

### Environment Configuration


### Apache / Nginx Configuration




## Usage



### Content Management

TODO:


### Closed Captions


### Streaming

OBS stream settings.

```
* Service: Custom
* Server: rtmps://global-live.mux.com:443/app
* Stream key: can be found at https://{ your-strapi-host }/admin/content-manager/singleType/api::livestream.livestream
```

## Development

### Post-receive hook


## License

## Author

[Karl Moubarak](https://moubarak.eu)


## Tree
```
├── README.md
├── back
│   ├── README.md
│   ├── config
│   │   ├── admin.js
│   │   ├── api.js
│   │   ├── database.js
│   │   ├── middlewares.js
│   │   ├── plugins.js
│   │   └── server.js
│   ├── database
│   ├── package.json
│   ├── public
│   │   ├── robots.txt
│   │   └── uploads
│   └── src
│       ├── admin
│       ├── api
│       │   ├── announcement
│       │   ├── emoji-group
│       │   ├── event
│       │   ├── livestream
│       │   ├── message
│       │   ├── meta
│       │   ├── mux-hook
│       │   └── viewer
│       ├── components
│       ├── extensions
│       │   └── mux-video-uploader
│       ├── index.js
│       ├── io.js
│       ├── mollie.js
│       ├── mux.js
│       ├── plugins
│       └── utils.js
├── front
│   ├── README.md
│   ├── eslintrc.js
│   ├── index.html
│   ├── package.json
│   ├── stats.html
│   ├── stats.json
│   ├── vite.config.js 
│   ├── public
│   ├── src
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── assets
│   │   ├── api
│   │   ├── config
│   │   ├── networking
│   │   ├── router
│   │   ├── store
│   │   ├── utils
│   │   └── views
│   └────── components
├── misc
│   ├── cc
│   └── mux
└── package.json
```
