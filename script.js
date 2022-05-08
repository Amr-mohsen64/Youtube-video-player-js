const playPauseBtn = document.querySelector('.play-pause-btn')
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const videoContainer = document.querySelector('.video-container')
const volumeSlider = document.querySelector('.volume-slider')
const muteBtn = document.querySelector('.mute-btn')
const currentTimeElem = document.querySelector('.current-time')
const totalTimeElem = document.querySelector('.total-time')
const captionsBtn = document.querySelector('.captions-btn')
const video = document.querySelector('video')


document.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLocaleLowerCase();

    switch (e.key.toLocaleLowerCase()) {
        case ' ':
            if (tagName == 'button') return
        case 'k':
            togglePlay()
            break;
        case 'f':
            toggleFullScreenMode()
            break;
        case 't':
            toggleTheaterMode()
            break;
        case 'i':
            toggleMiniPlayerMode()
            break;
        case 'm':
            toggleMute()
            break;
        case 'arrowleft':
        case 'j':
            skip(-5)
            break;
        case 'arrowright':
        case 'l':
            skip(5)
            break;
        case 'c':
            toggleCaptions()
            break;
        default:
            break;
    }
})

//captions
const captions = video.textTracks[0]
captions.mode = 'hidden'

captionsBtn.addEventListener('click', toggleCaptions)

function toggleCaptions() {
    const isHidden = captions.mode === 'hidden'
    captions.mode = isHidden ? "showing" : 'hidden'
    videoContainer.classList.toggle('captions', isHidden)
}
//Duration
video.addEventListener('loadeddata', () => {
    totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener('timeupdate', () => {
    currentTimeElem.textContent = formatDuration(video.currentTime)
})

//adding zeros to number if its one number
const leadingZeroFormater = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 })

function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormater.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormater.format(minutes)}:${leadingZeroFormater.format(seconds)}`
    }
}


function skip(duration) {
    video.currentTime += duration
}

//volume
muteBtn.addEventListener('click', toggleMute)
volumeSlider.addEventListener('input', e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}


video.addEventListener('volumechange', () => {
    volumeSlider.value = video.volume
    let volumeLevel

    if (video.muted || video.volume === 0) {
        volumeLevel = 'muted'
    } else if (video.volume > .5) {
        volumeLevel = 'high'
    } else {
        volumeLevel = 'low'
    }

    videoContainer.dataset.volumeLevel = volumeLevel
})

//view modes

theaterBtn.addEventListener('click', toggleTheaterMode)
fullScreenBtn.addEventListener('click', toggleFullScreenMode)
miniPlayerBtn.addEventListener('click', toggleMiniPlayerMode)


function toggleTheaterMode() {
    videoContainer.classList.toggle('theater')
}

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}



function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains('mini-player')) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }

}


document.addEventListener('fullscreenchange', () => {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
})

video.addEventListener('enterpictureinpicture', () => {
    videoContainer.classList.add('mini-player')
})

video.addEventListener('leavepictureinpicture', () => {
    videoContainer.classList.remove('mini-player')
})

// play/pause
function togglePlay() {
    video.paused ? video.play() : video.pause()
}

playPauseBtn.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)

video.addEventListener('play', () => {
    videoContainer.classList.remove('paused')
})

video.addEventListener('pause', () => {
    videoContainer.classList.add('paused')
})

