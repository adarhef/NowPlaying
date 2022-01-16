# Now Playing

https://user-images.githubusercontent.com/6278531/149660344-6e381a41-6dad-4fea-b54f-d42108394e13.mp4

Now Playing is a webpage widget that tracks and visualizes what's playing on iTunes (Spotify should also be possible, untested as of this moment).
I made this for [my Twitch stream](https://twitch.tv/furiousgallus) and thought I'd share :)

Initially adapted from [Zyphen's Now Playing overlay](https://obsproject.com/forum/resources/zyphens-now-playing-overlay.1026/), my version fixes various issues and changes the design to something that's more to my liking.

It also does not require Tuna as it's bundled with its own server and [Snip](https://github.com/dlrudie/Snip).

## Installation

Download the whole repo as a ZIP and extract it somewhere.

If you'd like to use this whole package as-is, these are the first-time instructions:
* Set up Snip: 
    * Navigate to the `Snip` folder and run `Snip.exe`.
    * Right click the tray icon, pick your player (I only tested iTunes), check `Save Album Artwork` and `Save Information Separately`.
    * Optional: If you'd like the player to hide if you pause your music, check `Empty File if No Track Playing`.
* Right-click and quit `Snip` from the tray.
* Set up a Browser Source in OBS (**REQUIRES OBS 27.2 AND UP**): 
    * I'd say a good size for a 720p stream is 120 height and at least 500 width, and put it in the bottom left of your scene. 
    * In the URL type `localhost:8000`, and press OK.

## Usage

Run the `start_now_playing.bat` batch file. 
This will launch Snip and the server (And if you're using iTunes, conveniently it launches it too). 

Shutting everything down has to be done manually:
* Close the Apache server window.
* Exit Snip from the system tray.

## Notes

There's a python server included as well. It is unused, but can be used if you're having trouble with the Apache server (which is more performant).
You'd have to install python and edit the `start_now_playing.bat` file to run the python server instead.

## Contributing

Right now only Windows is supported. 
This is because at the current state of the repo, I'm using [Snip](https://github.com/dlrudie/Snip), which is Windows-only.
In principle any solution which can save a few separate files to the filesystem to be read by the widget, can still work.
It's my understanding that Tuna can be used in this way, but I could not figure out how to use it properly.

Anyway, pull requests are more than welcome to address any issue you see and expand on this project further.

## License
[MIT](https://choosealicense.com/licenses/mit/)
