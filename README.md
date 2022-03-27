# The Hmm Livestream v2

Second version of the Hmm Livestream website with:
- a CMS to archive livestreams and maagge the chats
- an SPA for custom routing
- a revamped stylesheet
- multiple view modes for livestreams
- an attempt at closed captions

## Project Structure

```

```

## Deployment


### Reuqirements

- A server with apache (or nginx) that can proxy requests to 
- NodeJS >=12 <=14 ( this was developed with v14.19.0 )
- NPM >= 6.x
- a node process manager to handle updates like `pm2`
- enough RAM / CPU cores / network bandwidth to handle 100+ active socket connections

### Installation




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
* Stream key: https://{ your-strapi-host }/admin/content-manager/singleType/api::livestream.livestream.
```
