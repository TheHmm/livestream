# Caption Ninja Usage Instructions

These are instructions to use the live caption making tool we built. The instructions are basically identical to the original caption ninja except this one has one small change:

The webpage will be colored `GREEN` if all the conditions are met:
- The Strapi server is running
- There is a livestream running with the status "active"
- The livestream has produced a `starttime` correctly.
Else, the background will be `RED` and the captured live captions won't be sent to the server.

It sometimes happens that the livestream doesn't report a start time, in which case, it is advised to stop the livestream, wait 30 seconds, and restart it.

If something doesn't work, the browser developer panel should have a log that might help.

Full readme of original caption ninja: https://github.com/steveseguin/captionninja


## Requirements
- a computer
- internet connection
- google chrome
- master audio of the stream / space
- (optional) a display to show the captions

You need to be able to pipe the master audio of the stream/space as microphone input in your computer. Usually, the audio technician will be able to provide this to your headphone/mic jack.


## Making Captions
1. Open Google Chrome 🤮
2. Visit the URL page of the caption maker
3. The site will ask permission to use your microphone; click "allow"
4. The site should just work. So if you speak out loud, it will print what you say.
5. Click the microphone icon on the right side of the address bar
6. Choose the appropriate audio input for the captions, wich dooesnt have to be your microphone.
7. If you are collecting audio from an event in a space, ask the audio technician to provide the master output to your mic jack
8. It should appear in the input list
9. Remember, the captions will only be sent to the server if the webpage is `GREEN`

**Please note that this tool is "free" to use, but uses the Google Voice API, and you must ask permission from speakers before piping their voices to google's AI..**

## Viewing Captions
Captions can be viewed anywhere in the current active livestream's page on the front-end. Let's say the event is called event-5:
1. The captions can be accessed in transcript mode by visiting https://{ YOUR-DOMAIN }/event-5?mode=transcript or in thumbnail mode at https://{ YOUR-DOMAIN }/event-5?mode=thumbs
2. Optionally, one can visit https://{ YOUR-DOMAIN }/event-5/cc for a sort of live captions only mode.
3. Anyone from anywhere can view these captions in their browser. So:
4. If your event is onsite: open URL on a secondary display where viewers in the space read the captions while listening along
5. It's possible that the display is too small, so make sure the audience can see the URL (or QR code) so they can follow in their phones too
6. If your event is online: share the URL with your audience in the chat so they can also follow along
