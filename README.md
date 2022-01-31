# Now Playing

https://user-images.githubusercontent.com/6278531/149660344-6e381a41-6dad-4fea-b54f-d42108394e13.mp4

Now Playing is a webpage widget that tracks and visualizes what's playing on iTunes and Spotify (Desktop App only, it seems).
I made this for [my Twitch stream](https://twitch.tv/furiousgallus) and thought I'd share :)

Initially adapted from [Zyphen's Now Playing overlay](https://obsproject.com/forum/resources/zyphens-now-playing-overlay.1026/), my version fixes various issues and changes the design to something that's more to my liking.

It also does not require Tuna as it's bundled with [Snip](https://github.com/dlrudie/Snip).

## Installation

Download the latest release from the Releases page and extract it somewhere.

* Set up Snip: 
    * Navigate to the `Snip` folder and run `Snip.exe`.
    * Right click the tray icon, pick your player, check `Save Album Artwork` and `Save Information Separately`.
    * Optional: If you'd like the player to hide if you pause your music, check `Empty File if No Track Playing`.
* Right-click and quit `Snip` from the tray.
* Set up a Browser Source in OBS (**REQUIRES OBS 27.2 AND UP**): 
    * I'd say a good size for a 720p stream is 120 height and at least 500 width, and put it in the bottom left of your scene. 
    * Tick the `Local file` checkbox, click `Browse` and select the `index.html` file.

## Usage

For use in OBS, run Snip.exe and keep in the background (And if you're using iTunes, conveniently it launches it too). simply quit it when you're done.

For contributors who want to run the widget in a browser, run the `start_now_playing.bat` batch file (NOT as admin).
This will launch Snip and the Apache server. 

Shutting everything down has to be done manually:
* Close the Apache server window.
* Exit Snip from the system tray.

## Notes

Right now only Windows is supported. 
This is because at the current state of the repo, I'm using [Snip](https://github.com/dlrudie/Snip), which is Windows-only.
In principle any solution which can save a few separate files to the filesystem to be read by the widget, can still work.
It's my understanding that Tuna can be used in this way, but I could not figure out how to use it properly.

## Contributing

In order to run the widget in Chrome it's necessary to serve the html from a server. I bundled an Apache and Python servers, that can be run with `start_now_playing.bat` and `start_now_playing_python.bat` respectively. Pick whatever works, Apache works a bit better though.
This will allow you to run the widget from `http://localhost:8000` in Chrome and mess with anything you like.

Anyway, pull requests are more than welcome to address any issue you see and expand on this project further.

## Donations

I'm humbled to have been asked for a donation link, so I set one up:

[![](https://www.paypalobjects.com/en_US/IL/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=2C294FLX63PDQ)

## License
[MIT](https://choosealicense.com/licenses/mit/)
