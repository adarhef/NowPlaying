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


## Configuration

In the `settings.json` file these configuration options are available:
* `topLabel` may be set to one of the following values: `artist`, `album` and `track`. Defaults to `artist`
* `bottomLabel` may be set to one of the following values: `artist`, `album` and `track`. Defaults to `track`
* `delayBeforeDisappearance` may be set to a number in seconds, which is a delay before the widget will disappear. Note that if you set this, track/playback changes will not be reflected until the delay has elapsed, as it is uninterruptible. Defaults to `null`

## Usage

For use in OBS, run Snip.exe and keep in the background (And if you're using iTunes, conveniently it launches it too). simply quit it when you're done and close Snip from the system tray.

## Notes

If you want a solution for macOS, check out [NowPlayingRetreiver](https://github.com/adarhef/NowPlayingRetriever). It can be used with this widget.

This widget comes bundled with Snip and so offers only Windows support out of the box.

In principle any solution which can save a few separate files to the filesystem to be read by the widget, can still work.
It's my understanding that Tuna can be used in this way, but I could not figure out how to use it properly.

## Contributing

Pull requests are more than welcome to address any issue you see and expand on this project further. It'd be best to discuss your ideas in an Issue first though.

## Donations

I'm humbled to have been asked for a donation link, so I set one up:

[![](https://www.paypalobjects.com/en_US/IL/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=2C294FLX63PDQ)

## License
[MIT](https://choosealicense.com/licenses/mit/)
