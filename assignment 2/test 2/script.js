const myVideo = document.querySelector("#my-video");
console.log(myVideo);

const progressBar = document.querySelector("#progress-bar");
console.log(progressBar);

myVideo.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const duration = (myVideo.currentTime / myVideo.duration) * 100;
  progressBar.style.width = duration + "%";
}

const playPauseButton = document.querySelector("#play-pause-button");
console.log(playPauseButton);

playPauseButton.addEventListener("click", togglePlayback);

const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);

function togglePlayback() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    myVideo.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}

const muteUnmuteButton = document.querySelector("#mute-unmute-button");
console.log(muteUnmuteButton);

muteUnmuteButton.addEventListener("click", toggleAudio);

const muteUnmuteImg = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteImg);

function toggleAudio() {
  if (myVideo.muted) {
    myVideo.muted = false;
    muteUnmuteImg.src =
      "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
  } else {
    myVideo.muted = true;
    muteUnmuteImg.src = "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png";
  }
}

function playVideo(no) {
  myVideo.src = videoList[no].src;
  console.log(myVideo.src);
  myVideo.load();
  myVideo.play();
}

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

const heartButton = document.querySelector("#heart-button");
console.log(heartButton);

heartButton.addEventListener("click", updateLikes);

const likesContainer = document.querySelector("#likes");
let likes = 0;

function updateLikes() {
  likes++;
  likesContainer.textContent = likes;
}

// ✅ Fix: Rewind 10s
const rewindButton = document.querySelector("#rewind-button");
console.log(rewindButton);

rewindButton.addEventListener("click", () => {
  myVideo.currentTime = Math.max(myVideo.currentTime - 10, 0);
});

// ✅ Fix: Forward 10s
const forwardButton = document.querySelector("#forward-button");
console.log(forwardButton);

forwardButton.addEventListener("click", () => {
  myVideo.currentTime = Math.min(myVideo.currentTime + 10, myVideo.duration);
});

const speedButton = document.querySelector("#speed-button");
const speedLabel = document.querySelector("#speed-label");

const speeds = [1.0, 1.5, 2.0];
let speedIndex = 0;

speedButton.addEventListener("click", () => {
  speedIndex = (speedIndex + 1) % speeds.length;
  myVideo.playbackRate = speeds[speedIndex];
  speedLabel.textContent = speeds[speedIndex] + "x";
});