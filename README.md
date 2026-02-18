# THE INBETWEEN (The Hmm Livestream v3)

Third version of the Hmm Livestream website with:
- a CMS upgrade allowing usage by multiple organisations with multiple simultaneous livestreans
- better treatment of chat moderation, view modes and live captions
- a revamped stylesheet
 
## Development
### Project Structure

| Directory | Function          |
|-----------|-------------------|
| back      |  Strapi CMS       |
| front     |  Vue SPA          |
| misc      |  Tests, etc...    |

### Reuqirements

- A server with apache (or nginx) to serve static files and act as a proxy
- NodeJS >=20 <=24 ( this was developed with v14.19.0 )
- a node process manager to handle updates like `pm2`
- enough RAM / CPU cores / network bandwidth to handle 200+ active socket connections
- a mux account and API token

### Installation & Deployment

1. Instructions for Strapi are in [back](/back/).
2. Instructions for Vue are in [front](/front/).

## Usage

This project is multi-faceted and has several usage instructions:
1. [for streaming](#streaming)
2. [for captions](#captions)
3. [for content management](#content-management)
4. [for viewing](#viewing)

### Streaming

RTMP settings:

```
* Server     : rtmps://global-live.mux.com:443/app
* Stream key : XXXXX-XXXXXXX-XXXXXXXX-XXXXXX-XXXX
```

Different organisations have different (private) stream keys assigned to them.

### Captions

Aside from the MUX-provided automated closed captioning service for our generated video stream, we run a secondary captioning service with the Google Voice API 🤮 to show a real-time transcript of the speakers of the stream online as well as in the space. Running this service can only happen on the `/send-cc` route and requires a livestream key to authenticate.

### Content Management

Please follow instructions in [back](back/)


### Viewing

Please follow instructions in [front](front/)

## License

[CC4r*](https://constantvzw.org/wefts/cc4r.en.html)

## Author

[Karl Moubarak](https://moubarak.eu)
