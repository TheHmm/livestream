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




## Reuqirements

- A server with apache (or nginx) to serve static files and act as a proxy
- NodeJS >=12 <=14 ( this was developed with v14.19.0 )
- NPM >= 6.x
- a node process manager to handle updates like `pm2`
- enough RAM / CPU cores / network bandwidth to handle 100+ active socket connections
- a mux account and API token
- a mollie account and API token

## Installation & Deployment

1. Instructions for Strapi are in [back](/back/).
2. Instructions for Vue are in [front](/front/).
3. Instructions for Closed Captions are in [misc/cc](/misc/cc/)

## Usage
### Streaming

OBS stream settings:

```
* Service    : Custom
* Server     : rtmps://global-live.mux.com:443/app
* Stream key : XXXXX-XXXXXXX-XXXXXXXX-XXXXXX-XXXX
```
The stream key can be found in the strapi admin panel at:
```
https://{ your-strapi-host }/admin/content-manager/singleType/api::livestream.livestream
```

### Closed Captions
TODO



### Content Management
TODO
### Moderation
TODO
## Development Workflow
### Post-receive hook
TODO
  



## License
[CC4r*](https://constantvzw.org/wefts/cc4r.en.html)
## Author

[Karl Moubarak](https://moubarak.eu)
