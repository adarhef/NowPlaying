var newSong = "";
var newArtist = "";
var newAlbum = "";

var currentSong = "";
var currentArtist = "";
var currentAlbum = "";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkUpdate = async () => {
    const promises = [
        fetchText("Snip/Snip_Artist.txt"), 
        fetchText("Snip/Snip_Track.txt"), 
        fetchText("Snip/Snip_Album.txt")
    ];

    try {
        [newArtist, newSong, newAlbum] = await Promise.all(promises);

        if (newSong != currentSong || newArtist != currentArtist || newAlbum != currentAlbum) {
            await displayData();
        }
    } catch (error) {
        console.error(error);
    }
    await timeout(2000);
    await checkUpdate();
}

const fetchText = async (url: string) =>
    fetch(url)
    .then(response => response.text())
    .then(text => text.replace(/&/g, "&amp;"))

const displayData = async () => {
    const song = document.getElementById("song")!;
    const artist = document.getElementById("artist")!;
    const albumImage = document.getElementById("albumimage") as HTMLImageElement;

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
        if (currentAlbum != newAlbum || newAlbum.length == 0) {
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

const hideElement = async (element: HTMLElement, animation: string) => {
    await animateCSS(`#${element.id}` as keyof HTMLElementTagNameMap, animation);
    element.style.setProperty('display', 'none');
}
const showElement = async (element: HTMLElement, animation: string) => {
    element.style.removeProperty('display');
    await animateCSS(`#${element.id}` as keyof HTMLElementTagNameMap, animation);
}

const showSong = async (song: HTMLElement) => {
    song.innerHTML = newSong;
    await showElement(song, 'fadeInLeft');
}
const showArtist = async (artist: HTMLElement) => {
    artist.innerHTML = newArtist;
    await showElement(artist, 'fadeInLeft');
}

const hideSong = async (song: HTMLElement) => hideElement(song, 'fadeOutLeft')
const hideArtist = async (artist: HTMLElement) => hideElement(artist, 'fadeOutLeft')

const slideUpAlbumImage = async (albumImage: HTMLImageElement) => {
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeInUp');
}
const fadeInAlbumImage = async (albumImage: HTMLImageElement) => {
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeIn');
}

const slideDownAlbumImage = async (albumImage: HTMLElement) => hideElement(albumImage, 'fadeOutDown')
const fadeOutAlbumImage = async (albumImage: HTMLElement) => hideElement(albumImage, 'fadeOut')

const updateAlbumImage = async (albumImage: HTMLImageElement) => fetch('Snip/Snip_Artwork.jpg')
    .then(response => response.blob())
    .then(blob => {
        if (blob.size < 100) {
            throw "Image is too small, intepreting as missing artwork"
        }
        albumImage.src = URL.createObjectURL(blob);
    })


const animateCSS = (element: keyof HTMLElementTagNameMap, animation: string, prefix = 'animate__') =>
    new Promise((resolve) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        if (!node) {
            resolve("Element couldn't be found, nothing to animate");
            return;
        }

        if (node.style.display == "none") {
            resolve('Element is hidden, nothing to animate');
            return
        }
        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event: Event) {
            event.stopPropagation();
            node!.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

document.addEventListener("DOMContentLoaded", checkUpdate);