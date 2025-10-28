# The Hmm Livestream
*Frontend: Instructions by route*

## `*`

All pages on the website have the following layout:

```
+-------------------------------------------------+
| marquee                                         |
| header                                          |
| | banner | viewers | announcements | network    |
|                                                 |
| main                                            |
| | home | event | error                          |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
|                                                 |
| footer                                          |
| | about | accessibility | ...                   |
+-------------------------------------------------+
```
Below a brief description of all the components in this layout

- **marquee**: an animated text that changes based on where you are on the website. Each event has a different marquee. If a livestream is active, the marquee stops animating.
- **header**: a container for all the "status" information of the website
  - **banner**: the organization logo. May change per event.
  - **viewers**: at times this will show an array of dots representing viewers to an event. If the event is ongoing, these will show the connected viewers and their sent emotes. If the event is past, these will show the viewers that participated in the chat.
  - **announcements**: this will show per-event announcements from the organization
  - **network**: a status indicator  of the current network activity between your browser and the server.
- **main**: the main area of the website. This is where the different routes of the website display there contents. Below is a description of all the routes. These could be
  - **home**: a list of all past livestreamed events that can be filtered by year
  - **event**: the event page itself, showing the current, past, or future livestream
  - **error**: an error page, ususally after a mistyped URL.
- **footer**: the control area for the user. displays several different tabs that change per route. For example, a chat will be here in an event page but not on the home page. Important persistent tabs include:
  - **about**: an informative dialog about the organization and this website.
  - **accessibility**: the website's accessibility options, changes the behaviour and display of the entire website.

Below are the different routes of the website and instructions on how to use each of them.

## `/`

This is the home page, sometimes called the archive page. It lists all the livestreamed events that have passed, including their title, description, date and a cover image from the livestream or recording. The footer will contain an extra tab to choose a year to filter events by.

Hovering over an event item will enlarge it to display a little bit more of it's livestream cover image. Clicking on an event item will route you to that event's livestream/recording page.

## `/<event>/`

This is the event page, where an event, past, present, or future, is dispalyed.

This route is accessed by a "slug". Each event will have a different slug that will be communicated every time to the audience in advance. Each event will also have it's own color theme

The header area of the page dispalys a dot for each of the currently connected viewers. If a viewer sends an emote, it will be displayed here for a few seconds. Announcements from the organization are also displayed here.

In the middle of the page there will be a livestream player on the left, taking up most of the space, and an informative section on the right, with the event title, description and date. A close button allows you to leave the event and return to the home page.

The player area of the livestream will have 3 different states:
1. an **idle** state: this is when the event livestream is about to take place, is planned in the future, or is currently taking place but there are errors.
2. an **active** state: this is when the event livestream or a past event's recording is currently available and playing.
3. an **unavailable** state: the event took place in the past but the recording is unavailable.

The footer area of this page will have a few tabs added in addition to the persistent ones:
- **view modes**: lists options for viewing the livestream, described below
- **emotes**: lists all the event's available emotes.
- **chat**: are to send an receive message during the livestream.

### View modes

The livestream player is available in 4 different viewing modes. You can choose between these different modes by clicking on them in the view modes tab in the footer, depending on whether you want a more immersive video experience or just to listen or read. They are listed in order of most CO2 emmitting to least CO2 emmitting:
1. **video**: varying qualities of video
2. **audio**: varying qualities of audio
3. **low-low-res**: thumbnail every 15 seconds + live transcript
4. **text**: live transcript

### Emotes

During the event, you will have a list of specially made / curated emotes to react to certain things. These are available in the emotes tab in the footer. Clicking an emote will make it appear in your dot in the header area (for everyone) for 5 seconds. In this time, you are not allowed to send emotes.

### Chat

Each event that is livestreamed will have a separate chat, accessible from the chat tab in the far bottom right corner of the website. The chat is enabled before and during the event. After the event passes, it will be possible to read the chat but not send messages.

Hovering over this tab reveals some of the chat and clicking on it will maximize the chat window to take up the full height of the main area. On the top right of the chat window is a close button to minimize it again.

On the top bar of the chat window you will find controls to show only URLs, print the chat and close the window. The middle part of the window will show the messages reverse chronologically. The bottom part of the chat will have an input field to compose messages and a send button to send them.

To join the chat, simply start writing your message in the input field. If you have not yet joined, you will be prompted to create a user. Here you can pick a name and a number of days after which you'd like your user to be anonyized. User anonymization means that after the chosen number of days has passed, your user will change it's name and id and won't recognize your browser anymore.

When you've created your user, you can send messages to everyone else in the chat. As long as you have not been anonymized, you can always delete your messages. Tip: if you send an emoji, it will show up on your user dot. Please abide by the organization's Code of Conduct, else, they can censor your messages or even block you.

After you leave and return to the webpage, and if you haven't yet been anonymized, the server will recognize your browser and you can continue sending messages as you user.

## `/<event>/chat`

This is the event's dedicated chat page. You can view participate in the chat without having to load and watch the livestream. Good for participation of an event's physical audience in the chat with the online audience.

## `/<event>/chat?hide_input=true`

This is the same as the previous route, except the chat input is also hidden. Useful for when the chat is displayed on a screen somewhere in the physical space to further connect hybrid audiences.

## `/<event>/chat/save`

Displays a full screen, printer friendly webpage of the chat, without the rest of the interface, as well as a print button. This webpage is more print firendly than the previous ones and can be used to save the chat as a PDF for future reference.

Clicking on the "show only URL's" checkbox will display the chat's shared links without all the other messages.

## `/<event>/player`

The event's dedicated player page. This page can display all the livestream or recording player without the rest of the interface in a "fullscreen" way on a black background. This can be useful for screening the event in a dedicated space or listening to it while doing other activities.

The different view modes can be accessed via the below routes. The default view mode is the video route

## `/<event>/player?mode=video`
Access the fullscreen player in video mode.

## `/<event>/player?mode=audio`
Access the fullscreen player in audio mode.

## `/<event>/player?mode=thumbs`
Access the fullscreen player in low-low-res mode.

## `/<event>/player?mode=transcript`
Access the fullscreen player in text mode.

## `/<event>/captions`
Shortcut to the fullscreen player in text mode. This displays the live (or past) transcript of the event with no other interface elements. The route is useful in case the event is taking place on location and the live captions want to be projected somewhere visible. Also in case someone in the audience has poor vision and would like to read along on their mobile device.

## `/<event>/accent`
This page displays only the event accent color from edge to edge.

## `/<event>/accent?h=xx?s=yy?l==zz`
The Hmm's HSL colorpicker! Use this URL scheme to compose a color in the HSL colorspace: The H value can be set by replacing the xx with a value between 1 and 360; the s value can be set by replacing the yy with a value between 1 and 100 and the l value can be set by replacing the zz with a value between 1 and 100.

All parameters are optional and take as their default the h, s, or l of the respective event.
