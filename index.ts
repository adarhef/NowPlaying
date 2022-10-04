var newSong = "";
var newArtist = "";
var newAlbum = "";

var currentSong = "";
var currentArtist = "";
var currentAlbum = "";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkMetadata = async () => {
    const promises = [
        fetchText("Snip/Snip_Artist.txt"),
        fetchText("Snip/Snip_Track.txt"),
        fetchText("Snip/Snip_Album.txt")
    ];

    try {
        [newArtist, newSong, newAlbum] = await Promise.all(promises);

        if (newSong != currentSong || newArtist != currentArtist || newAlbum != currentAlbum) {
            await animateMetadataTransition();
        }
    } catch (error) {
        console.error(error);
    }
    await timeout(2000);
    await checkMetadata();
}

const fetchText = async (url: string) =>
    fetch(url)
        .then(response => response.text())
        .then(text => text.replace(/&/g, "&amp;"))

const getValueForTopLabel = async () => {
    const result = await fetch("settings.json");
    const json = await result.json();

    switch (json["topLabel"]) {
        case "artist": return newArtist;
        case "track": return newSong;
        case "album": return newAlbum;
        default: return newArtist;
    }
}

const getValueForBottomLabel = async () => {
    const result = await fetch("settings.json");
    const json = await result.json();
    
    switch (json["bottomLabel"]) {
        case "artist": return newArtist;
        case "track": return newSong;
        case "album": return newAlbum;
        default: return newSong;
    }
}

const animateMetadataTransition = async () => {
    const topValue = await getValueForTopLabel();
    const bottomValue = await getValueForBottomLabel();

    if (currentSong.length == 0 && newSong.length > 0) {
        // Entrance transition
        await slideUpAlbumImage().catch(() => { });
        await Promise.all([showBottomLabel(bottomValue), showTopLabel(topValue)]);
    } else if (currentSong.length > 0 && bottomValue.length == 0) {
        // Exit transition
        await Promise.all([hideTopLabel(), hideBottomLabel()]);
        await slideDownAlbumImage();
    } else {
        // Update transition
        if (currentAlbum != newAlbum || newAlbum.length == 0) {
            await Promise.all([fadeOutAlbumImage(), hideTopLabel(), hideBottomLabel()]);
            await Promise.all([fadeInAlbumImage().catch(() => { }), showTopLabel(topValue), showBottomLabel(bottomValue)]);
        } else if (currentArtist != newArtist) {
            await Promise.all([hideTopLabel(), hideBottomLabel()]);
            await Promise.all([showTopLabel(topValue), showBottomLabel(bottomValue)]);
        } else {
            await hideBottomLabel();
            await showBottomLabel(bottomValue);
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

const showBottomLabel = async (innerHTML: string) => {
    const bottomLabel = document.getElementById("bottomLabel")!;
    bottomLabel.innerHTML = innerHTML;
    await showElement(bottomLabel, 'fadeInLeft');
}
const showTopLabel = async (innerHTML: string) => {
    const topLabel = document.getElementById("topLabel")!;
    topLabel.innerHTML = innerHTML;
    await showElement(topLabel, 'fadeInLeft');
}

const hideBottomLabel = async () => {
    const bottomLabel = document.getElementById("bottomLabel")!;
    await hideElement(bottomLabel, 'fadeOutLeft');
}
const hideTopLabel = async () => {
    const topLabel = document.getElementById("topLabel")!;
    await hideElement(topLabel, 'fadeOutLeft');
}

const slideUpAlbumImage = async () => {
    const albumImage = document.getElementById("albumimage") as HTMLImageElement;
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeInUp');
}
const fadeInAlbumImage = async () => {
    const albumImage = document.getElementById("albumimage") as HTMLImageElement;
    albumImage.style.removeProperty('animation-delay');
    await updateAlbumImage(albumImage);
    await showElement(albumImage, 'fadeIn');
}

const slideDownAlbumImage = async () => {
    const albumImage = document.getElementById("albumimage") as HTMLImageElement;
    await hideElement(albumImage, 'fadeOutDown');
}
const fadeOutAlbumImage = async () => {
    const albumImage = document.getElementById("albumimage") as HTMLImageElement;
    albumImage.style.setProperty('animation-delay', '0.3s');
    await hideElement(albumImage, 'fadeOut');
}

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
            return;
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

document.addEventListener("DOMContentLoaded", checkMetadata);