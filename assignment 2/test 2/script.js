// Get the video element
const myVideo = document.querySelector("#my-video");
console.log(myVideo);

// Get the progress bar element
const progressBar = document.querySelector("#progress-bar");
console.log(progressBar);

// Update the progress bar as the video plays
myVideo.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const duration = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = duration + "%";
}

// Get the play/pause button and image
const playPauseButton = document.querySelector("#play-pause-button");
console.log(playPauseButton);
const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);

// Toggle play/pause and update the button image
playPauseButton.addEventListener("click", togglePlayback);

function togglePlayback() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    myVideo.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}

// Get mute/unmute button and image
const muteUnmuteButton = document.querySelector("#mute-unmute-button");
console.log(muteUnmuteButton);
const muteUnmuteImg = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteImg);

// Toggle mute and update the icon
muteUnmuteButton.addEventListener("click", toggleAudio);

function toggleAudio() {
  if (myVideo.muted) {
    myVideo.muted = false;
    muteUnmuteImg.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
  } else {
    myVideo.muted = true;
    muteUnmuteImg.src = "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png";
  }
}

// Load and play a video by index (used with playlist)
function playVideo(no) {
  myVideo.src = videoList[no].src;
  console.log(myVideo.src);
  myVideo.load();
  myVideo.play();
}

// Fullscreen toggle
const fullscreenButton = document.querySelector("#fullscreen-button");
console.log(fullscreenButton);

fullscreenButton.addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Like button functionality
const heartButton = document.querySelector("#heart-button");
console.log(heartButton);
const likesContainer = document.querySelector("#likes");
let likes = 0;

heartButton.addEventListener("click", updateLikes);

function updateLikes() {
  likes++;
  likesContainer.textContent = likes;
}

// Rewind 10s: Decrease current playback time by 10 seconds, but not below 0
const rewindButton = document.querySelector("#rewind-button");
console.log(rewindButton);

rewindButton.addEventListener("click", () => {
  myVideo.currentTime = Math.max(myVideo.currentTime - 10, 0);
});

// Forward 10s: Increase current playback time by 10 seconds, but not beyond the video duration
const forwardButton = document.querySelector("#forward-button");
console.log(forwardButton);

forwardButton.addEventListener("click", () => {
  myVideo.currentTime = Math.min(myVideo.currentTime + 10, myVideo.duration);
});

// Speed Toggle: Cycles through playback speeds (1x, 1.5x, 2x)
const speedButton = document.querySelector("#speed-button");
const speedLabel = document.querySelector("#speed-label");

const speeds = [1.0, 1.5, 2.0];
let speedIndex = 0;

speedButton.addEventListener("click", () => {
  speedIndex = (speedIndex + 1) % speeds.length;
  myVideo.playbackRate = speeds[speedIndex];
  speedLabel.textContent = speeds[speedIndex] + "x";
});