var newSong = "";
var newArtist = "";
var newAlbum = "";

var currentSong = "";
var currentArtist = "";
var currentAlbum = "";

const checkUpdate = async() => {
    const promises = [fetchText("Snip/Snip_Artist.txt"), fetchText("Snip/Snip_Track.txt"), fetchText("Snip/Snip_Album.txt")];

    try {
        [newArtist, newSong, newAlbum] = await Promise.all(promises);

        if (newSong != currentSong && newArtist != currentArtist && newAlbum != currentAlbum) {
            await displayData();
        }
    } catch (error) {
        console.error(error);
    }

    setTimeout(checkUpdate, 2000);
}

const fetchText = async url =>
    fetch(url)
    .then(response => response.text())
    .then(text => text.replace(/&/g, "&amp;"))

const displayData = async() => {
    const song = document.getElementById("song");
    const artist = document.getElementById("artist");
    const albumImage = document.getElementById("albumimage");

    if (currentSong.length == 0 && newSong.length > 0) {
        // Entrance transition
        await getAlbumImage().then((image) => {
            albumImage.src = image;
        });
        await animateCSS('#albumimage', 'fadeInUp');

        song.innerHTML = newSong;
        artist.innerHTML = newArtist;
        await Promise.all([animateCSS('#song', 'fadeInLeft'), animateCSS('#artist', 'fadeInLeft')]);

    } else if (currentSong.length > 0 && newSong.length == 0) {
        // Exit transition
        await Promise.all([
            animateCSS('#artist', 'fadeOutLeft').then(() => { artist.innerHTML = ""; }),
            animateCSS('#song', 'fadeOutLeft').then(() => { song.innerHTML = ""; })
        ]);
        await animateCSS('#albumimage', 'fadeOutDown').then(() => {
            albumImage.removeAttribute('src');
        });
    } else {
        // Update transition
        var promises = [];

        if (currentAlbum != newAlbum) {
            promises.push(updateAlbumImage(albumImage));
        }

        if (currentArtist != newArtist) {
            promises.push(updateArtist(artist));
        }

        promises.push(updateSong(song));

        await Promise.all(promises);
    }
    currentArtist = newArtist;
    currentSong = newSong;
    currentAlbum = newAlbum;
}

const updateAlbumImage = async(albumImage) => {
    albumImage.style.setProperty('--animate-duration', '0.5s');
    await animateCSS('#albumimage', 'fadeOut').then(() => { albumImage.src = ""; });
    albumImage.src = await getAlbumImage();
    await animateCSS('#albumimage', 'fadeIn');
    albumImage.style.removeProperty('--animate-duration');
}

const updateSong = async(song) => {
    await animateCSS('#song', 'fadeOutLeft').then(() => { song.innerHTML = ""; });
    song.innerHTML = newSong;
    await animateCSS('#song', 'fadeInLeft');
}

const updateArtist = async(artist) => {
    await animateCSS('#artist', 'fadeOutLeft').then(() => { artist.innerHTML = ""; });
    artist.innerHTML = newArtist;
    await animateCSS('#artist', 'fadeInLeft');
}

const getAlbumImage = () => fetch('Snip/Snip_Artwork.jpg')
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });