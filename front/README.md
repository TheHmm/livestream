
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


## Layout

All pages on the website have the following layout:

```
+-------------------------------------------------+
| header                                          |
| | banner | viewers | announcements | network    |
|                                                 |
| main                                            |
| | agenda | archive | event | etc...             |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
| footer                                          |
| | emotes | accessibility | ...                  |
+-------------------------------------------------+
```
Below a brief description of all the components in this layout

- **header**: a container for all the "status" information of the website
  - **banner**: the organization logo. May change per event.
  - **viewers**: at times this will show an array of dots representing viewers to an event. If the event is ongoing, these will show the connected viewers and their sent emotes. If the event is past, these will show the viewers that participated in the chat.
  - **announcements**: this will show per-event announcements from the organization
  - **network**: a status indicator  of the current network activity between your browser and the server.
- **main**: the main area of the website. This is where the different routes of the website display there contents. Below is a description of all the routes. These could be
  - **agenda**: a list of all future livestreamed events
  - **archive**: a list of all past livestreamed events that can be filtered by organsiation
  - **event**: the event page itself, showing the current, past, or future livestream
  - **etc...**: other static pages like info, renting options, etc...
- **footer**: the control area for the user. displays several different tabs that change per route. For example, a chat will be here in an event page but not on the home page. Important persistent tabs include:
  - **accessibility**: the website's accessibility options, changes the behaviour and display of the entire website.

## Special Routes

Below are the special routes of the website and instructions on how to use each of them.

### `/<event>/chat`

This is the event's dedicated chat page. You can view participate in the chat without having to load and watch the livestream. Good for participation of an event's physical audience in the chat with the online audience.

### `/<event>/chat?hide_input=true`

This is the same as the previous route, except the chat input is also hidden. Useful for when the chat is displayed on a screen somewhere in the physical space to further connect hybrid audiences.

### `/<event>/chat/save`

Displays a full screen, printer friendly webpage of the chat, without the rest of the interface, as well as a print button. This webpage is more print firendly than the previous ones and can be used to save the chat as a PDF for future reference.

Clicking on the "show only URL's" checkbox will display the chat's shared links without all the other messages.

### `/<event>/player`

The event's dedicated player page. This page can display all the livestream or recording player without the rest of the interface in a "fullscreen" way on a black background. This can be useful for screening the event in a dedicated space or listening to it while doing other activities.

The different view modes can be accessed via the below routes. The default view mode is the video route

### `/<event>/player?mode=video`
Access the fullscreen player in video mode.

### `/<event>/player?mode=audio`
Access the fullscreen player in audio mode.

### `/<event>/player?mode=thumbs`
Access the fullscreen player in low-low-res mode.

### `/<event>/player?mode=transcript`
Access the fullscreen player in text mode.

### `/<event>/captions`
Shortcut to the fullscreen player in text mode. This displays the live (or past) transcript of the event with no other interface elements. The route is useful in case the event is taking place on location and the live captions want to be projected somewhere visible. Also in case someone in the audience has low vision and would like to read along on their mobile device.
