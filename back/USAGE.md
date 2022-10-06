# Strapi Usage Instructions

## 🌍 Context

There are two types of users on Strapi:

1. admin: can create content types, update the infrastructure, change the API, and create and delete users.
2. author/editor: can upload files, create content, edit it, publish it, unpublish it and delete it.

## 🖥️ Environment

Once authenticated, you will be presented with the content management environment. On the bottom left, there are the buttons to log out and change the interface language. On the left side, there is a navigation menu with all the collections and single types (more info below). The rest of the interface is the editing area. It changes based on the part of the navigation that you are in. The navigation can always be collapsed with the arrow buttom on the bottom left corner.

From now on in this document, when something is formatted like this: `Nav > Content Manager > Something`, this is a way to indicate that the location of an option is in the navigation menu followed by a nested sub menu.

## 👥 Users

These are the users of the CMS. If you need a new user account created, have an admin do it by going to `Nav > Settings > Users`. This is also where user accounts can be deleted.

## 🗄️ Content Manager

Most of the work will happen in the content manager. This is accessible at `Nav > Content Manager`. A sub-menu will list all the different content types, organized in two categories: **singles** and **collections**.

### 📄 Single Types

In Strapi, Single Types are only one entry. Our single types are: **meta** and **livestream**.

#### Livestream

This is the core of the CMS and where our server connects with MUX's services. There must always be a livestream defined here. If it's not, it will should be created. If you go to `Nav > Content Manager > Livestream` you will see the following 3 fields:

- **privateData**: this is all the information about the livestream that we currently have, including the stream key.
- **publicData**: this is necessary information that is safe to show to our veiwers, excludes things like the streamkey
- **stream_key**: the current livestream streamkey to use in OBS.

##### Creating a livestream

If it's not defined, the livestream is created automatically when the server restarts. There is the possibility that you want to create a new livestream to replace this one, in case something has changed about your configuration or so. If you'd like to create a new livestream and replace the current one, just click the toggle `requestNewLivestream` to ON and then save. This will override the current livestream with a new one from MUX.

#### Meta

This will contain all the meta information about our website such as the about section, default texts, etc... Below is an explanation of all the fields:

- **about**: the website's about text, visible in the
- **defaultMarquee**: the default text to show in the top marquee of the website. This text will show in the home page as well as in event pages if they don't have their custom marquees set.
- **censorMessage**: this is the text that replaces a message's text if it's been censored.

The above 3 fields have to be set for the website to work.

##### Captions

Here you will also see a couple options for closed captions.

###### editing transcription vocabulary

The **transcription_vocabulary** field shows a list of phrases. This is a list that MUX uses to enhance its automated text-to-speech output for certain specific words. Add or remove from this list words or phrases that are uncommon, such as proper nouns, jargon, acronyms, names, etc... Hit Save after every time you edit this list.

Do not edit the **transcription_vocabulary_id**. It is an automatically generated ID used by MUX to identify our transcription vocabulary.

###### Disabling closed captions completely

Turning off MUX's auto-generated captions completely for everyone can only be done by editing the code. Enter the file [src/mux.js](src/mux.js) and remove the captions part from the livestream configuration and request a new livestream.


### 🗄️ Collections

In Strapi, Collections contain many entries. When viewing a collection, you can view, filter, sort, search, create, edit, publish, unpublish or delete an entry.

Any data-type in the project that can be enumerated is handled as a collection. Below is an explanation of all our collection types. Every other collection type that you see can be ignored.

##### Events

The most important collection type, these are the Hmm events that show up on the Homepage and are livestreamed.

An event will have the following fields:
- **title**: the title of the event
- **slug**: the URL path of the event
- **starts**: the datetime that the event starts
- **ends**: the datetime that the event ends
- **marquee**: the text to show in the marquee
- **info**: short event information
- **accent**: the event accent color in HSL format ( e.g. hsl(23, 100%, 50%) ). If you are not familiar with this format, please use a color picker
- **allowEmoji**: wether emojis are allowed
- **highlightDonateButton**: toggle to make the donate button jump
- **count**: the total number of visitors for this event. automatically generated.
- **recording**: the event recording. This is a JSON object that is automatically retreived from MUX after the event has ended. Do not edit

###### Creating an event

When you create an event, you should fill out the information as you normally would, the title, starts, ends and slug are mandatory. Everything else is optional or will be automatically filled in later.

Please note: As soon as you've written a title, a slug will automatically be generated based on the title. This is a very guessable slug probably and you should manually set it to something else.

When picking an accent color, it's important to note that there will be lighter and darker variations generated for the interface; which may not always look good. A good way to test is to send around 10 messages into the chat; this will show the different color variations.

The homepage will only ever show events that happened in the past, so you are welcome to create as many events for the future as you like in advance.

###### Editing an event

Any edits you make on the event itself while the event is taking place will always be sent immediately to everyone watching when you click save. So you can change the accent color or even info and it updates for everyone.

###### Highlighting the donate button

If you want to highlight the donate button on the frontend, you can turn the toggle  **highlightDonateButton** on and click save. Strapi will freeze for a few seconds while it animates on the front-end and then resume to back to off.

###### Post-processing an event

When the event is over, a nightly script will run. This script does a lot of guess work.

This will first update the event with a **count**, which is the *largest recorded number of concurrent connected visitors to the webpage since the previous event ended, including those that have not signed up to the chat*.

The more difficult task of the nightly script is to fetch from MUX the recording of the event with its transcript. This is difficult because it is possible that the livestream had to be cut off during the event, in which case 2 or more recordings are generated. The nightly script will only ever pick the last recording.

The only way to correct this mistake is to do it manually. You can do this by:
1. going to the MUX dashboard and signing in.
2. going to the video > assets area and making sure you have the right envirnoment set (production)
3. going through the recorded video assets and picking the finding the correct Once
4. copy the Asset ID (at the top of the asset page)
5. Go to the event's page in strapi and scroll to the bottom
6. In the **`mux_recording`** field, paste the following:
```
{
  "asset_id": "THE-ASSET-ID-YOU-JUST-COPIED"
}
```

In case the assets are cut up or need editing. First download them from MUX, stitch / edit them as you deem fit, and then reupload them to MUX as an asset. If this works, you will have an asset id for the video you uploaded and can follow the steps above with it.
##### Announcements

Announcements are temporary or permanent messages that show up on the top left part of the event page. There can only ever be 1 announcement on display. Announcements have the folowing fields:

- **title**: the title of the announcement (not visible publically)
- **slug**: the auto-generated slug
- **body**: the contents of the announcement
- **expires**: the time (in seconds) that you'd like this announcement to be visible. Keep empty if you want the announcement to remain there permanently
- **event**: relation to events collection

When an announcement is created, it must be added to the event that is relates to. Otherwise it will not show up when published. Several events can share the same announcement.

##### Emoji Groups

Emoji Groups are collections of cutom emojis related to specific theme. An emoji group will have these fields:
- **name**: the name of the group, visible in the frontend
- **slug**: unique autogenerated slug
- **emoji**: an ordered list of emojis

EmojiGroups must be added to an event so that they show up there. Otherwise they will not show up when published. Events can have many emoji groups and emoji groups can belong to many events.

An emoji will only have a name and an image. Please make sure the name is unique for this emoji. Also make sure that the images you apload for emojis are small. THe biggest an emoji will be displayed is 20px * 20px. Anything bigger is just going to consume a lot of data downloading.

In case you'd like to have an ascii emoji such as `(╯°□°）╯︵ ┻━┻`, just name it that and don't include an image.

##### Viewers

A viewer is any visitor that has signed up to the chat during an event. A viewer will have the following fields:

- **name**: viewer's chosen display name, can be changed/
- **uuid**: automatically generated unique ID
- **moderator**: whether a viewer has moderator rights
- **blocked**: wether a viewer is blocked
- **expires**: when the viewer will become anonymized
- **events**: the events that a viewer has attended
- **messages**: the messages the viewer has sent

When a viewer is created, edited, or deleted, everyone is informed in real time (for security reasons).

###### Creating a viewer

A viewer is created when someone watching a livestream decides they want to participate in the chat. They pick a name, decide how long their account remains attached to their name, and agree to the conditions. Here is when a unique identifier is randomly created for them and stored in their browser as well as on the server. This is the kind of authentication we are using, no passwords.

###### Making a viewer a moderator

To make a viewer a moderator, go to the CMS then `Nav > Content Manager > Viewers` and search for their name. There you will be able to toggle the moderator switch for them. Everyone is immediately informed of this change.

When a viewer becomes moderator they get access to moderation tools in the frontend next to every message: to censor or delete the message or to block the sender.

###### Blocking & Unblocking a viewer

A viewer can be blocked by a moderator in the frontend or, in case you want to stay in strapi, you can search for that viewer in the viewers collection and toggle their blocked status.

###### Viewer post-processing

The nightly script mentioned earlier will also take care of viewer maintanence. When it runs, it goes through the whole collection of viewers in the database and (if requested by the user) anonymizes them by replacing their chosen display name with that of an animal.

##### Messages

The messages sent by viewers. Fields:

- **body**: the contents of the message
- **time**: datetime message was sent
- **censored**: whether the message has been censored
- **links**: a list of all the links derived from the message body
- **emoji**: a list of all the emoji derived from the message body
- **sender**: which viewer sent the message
- **event**: the event in which the message was sent

When a message is created, edited, censored or deleted, everyone is informed in real time (for security reasons).

###### Censoring & Uncensoring a message

A message can be censored by a moderator in the frontend or, in case you want to stay in strapi, you can search for that message in the messages collection and toggle it's censored status.

###### Editing the censor message

The censor message for all messages in the platform is defined in `Nav > Content Manager > Meta` and can be changed there.

### ✏️ Editing

All entries have different fields. Most of them are self-explanatory.

Some fields support rich text and are edited in Markdown. There is a built-in editor for rich text fields that will provide all the formatting options as buttons. When you select text and click the 'Bold' button, it will create the syntax that will make that text bold. To see how a rich text is going to be formatted on the website, you can click the Switch to Preview button on the upper right corner of the rich text editors.

Markdown cheat sheet: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet/.

When you want to include an image in a rich text, you can click the image icon on the editor and either choose a previously uploaded image, or upload a new one. This will paste a URL to the image in the text. You can see this in action on the entries that are already there.

Please upload as many files as you like to the Media Library. When uploading images, please take care to:
- shrink them to the appropriate size, especially if they are only ever going to be displayd very small (like emoji).
- write an image description in the alt field. Screen readers can not read images the way our eyes do!

Please note the following about links: all aboslute links (starting with "http...") will open in a new tab when clicked in the website. All relative links (starting with "/...") will use the website's custom router to scroll to the different part of the canvas.

So if you want to link from one part of the website to another, and you are using the rich text editor, please use relative links based on the slugs from other fields, and format them as follows:

```
[Internal Link](/slug)                    <!-- internal link template -->
[Go to Meditation!](/meditation)          <!-- internal link example  -->
[External Link](https://domain.org)       <!-- external link template -->
[Visit our site!](http://meltionary.com/) <!-- external link example  -->
```


## Moderation
