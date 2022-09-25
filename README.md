# The Hmm Livestream v2

Second version of the Hmm Livestream website with:
- a CMS to archive livestreams and manage the chats
- an SPA for custom routing
- a revamped stylesheet
- multiple view modes for livestreams
- an attempt at closed captions

## Development
### Project Structure

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
- a mux account and API token
- a mollie account and API token

### Installation & Deployment

1. Instructions for Strapi are in [back](/back/).
2. Instructions for Vue are in [front](/front/).
3. Instructions for Closed Captions are in [misc/cc](/misc/cc/)

## Usage

This project is multi-faceted and has several usage instructions:
1. [for streaming](#streaming)
2. [for producing real time closed captions](#closed-captions)
3. [for content management](#content-management)
4. [for moderation](#moderation)
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
You need to be logged in to view it.
### Closed Captions

When viewing a livestream, the visitor can pick between several viewing modes: (1) video, (2) audio, (3) thumbnails or (4) transcript. The video mode will have captions coming in from MUX and the thumbnails and transcript mode will need something more real-time.
#### MUX Captions

These are already enabled in our MUX configuration by default. So we are always producing captions for our video mode. These are closed captions that viewers can turn on and off in the web video player. Configuration instructions can be found at [back/USAGE.md#captions](back/USAGE.md#captions)

#### own

Aside from the MUX-provided closed captioning service, we run a secondary captioning service with the Google Voice API 🤮 to show a real-time transcript of the speakers of the stream online as well as in the space. This makes it possible to follow the event only by reading it. Instructions on how to run these can be found at [misc/cc/USAGE.md](misc/cc/USAGE.md)

### Content Management

Please follow instructions in [back/USAGE.md](back/USAGE.md)
### Moderation

Please follow instructions in [back/USAGE.md#moderation](back/USAGE.md#moderation)



## License

[CC4r*](https://constantvzw.org/wefts/cc4r.en.html)
## Author

[Karl Moubarak](https://moubarak.eu)
