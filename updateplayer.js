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

        if (newSong != currentSong || newArtist != currentArtist || newAlbum != currentAlbum) {
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
        await slideUpAlbumImage(albumImage).catch(() => {});
        await Promise.all([showSong(song), showArtist(artist)])

    } else if (currentSong.length > 0 && newSong.length == 0) {
        // Exit transition
        await Promise.all([hideArtist(artist), hideSong(song)]);
        await slideDownAlbumImage(albumImage);
    } else {
        // Update transition
        if (currentAlbum != newAlbum) {
            albumImage.style.setProperty('animation-delay', '0.3s');
            await Promise.all([fadeOutAlbumImage(albumImage), hideArtist(artist), hideSong(song)]);
            albumImage.style.removeProperty('animation-delay');
            await Promise.all([fadeInAlbumImage(albumImage).catch(() => {}), showArtist(artist), showSong(song)]);
        } else if (currentArtist != newArtist) {
            await Promise.all([hideArtist(artist), hideSong(song)]);
            await Promise.all([showArtist(artist), showSong(song)]);
        } else {
            await hideSong(song);
            await showSong(song);
        }
    }
    currentArtist = newArtist;
    currentSong = newSong;
    currentAlbum = newAlbum;
}

const hideElement = async(element, animation) => {
    await animateCSS(`#${element.id}`, animation);
    element.style.setProperty('display', 'none');
}
const showElement = async(element, animation) => {
    element.style.removeProperty('display');
    await animateCSS(`#${element.id}`, animation);
}

const showSong = async(song) => {
    song.innerHTML = newSong;
    await showElement(song, 'fadeInLeft');
}
const showArtist = async(artist) => {
    artist.innerHTML = newArtist;
    await showElement(artist, 'fadeInLeft');
}

const hideSong = async(song) => hideElement(song, 'fadeOutLeft')
const hideArtist = async(artist) => hideElement(artist, 'fadeOutLeft')

const slideUpAlbumImage = async(albumImage) => {
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeInUp');
}
const fadeInAlbumImage = async(albumImage) => {
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeIn');
}

const slideDownAlbumImage = async(albumImage) => hideElement(albumImage, 'fadeOutDown')
const fadeOutAlbumImage = async(albumImage) => hideElement(albumImage, 'fadeOut')

const updateAlbumImage = async(albumImage) => fetch('Snip/Snip_Artwork.jpg')
    .then(response => response.blob())
    .then(blob => {
        if (blob.size < 100) {
            throw "Image is too small, intepreting as missing artwork"
        }
        albumImage.src = URL.createObjectURL(blob);
    })


const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        if (node.style.display == "none") {
            resolve('Element is hidden, nothing to animate');
            return
        }
        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });