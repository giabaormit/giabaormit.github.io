// Select video and volume control elements
const video = document.getElementById('custom-video-player');
const volumeSlider = document.getElementById('volume-slider');
const muteButton = document.getElementById('mute-button');
const volumePercentage = document.getElementById('volume-percentage');
const playPauseImg = document.getElementById('play-pause-img');
const progressBarFill = document.getElementById('progress-bar-fill');

// Set default volume
video.volume = 1;

// Update UI (icon, percentage, color)
function updateVolumeUI() {
  const volume = video.volume;
  volumeSlider.value = volume;
  volumePercentage.textContent = Math.round(volume * 100) + '%';

  // Update mute icon
  // Inside updateVolumeUI:
if (video.muted || volume === 0) {
    muteButton.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/lucide-static/icons/volume-x.svg" width="24" height="24" />';
  } else if (volume <= 0.5) {
    muteButton.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/lucide-static/icons/volume-1.svg" width="24" height="24" />';
  } else {
    muteButton.innerHTML = '<img src="https://cdn.jsdelivr.net/npm/lucide-static/icons/volume-2.svg" width="24" height="24" />';
  }
  
  // Update slider background based on volume
  let color;
  if (volume <= 0.3) {
    color = 'green';
  } else if (volume <= 0.7) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  volumeSlider.style.background = color;
}

// Volume slider input
volumeSlider.addEventListener('input', function() {
  video.volume = parseFloat(volumeSlider.value);
  video.muted = video.volume === 0;
  updateVolumeUI();
});

// Mute button click
muteButton.addEventListener('click', function() {
  if (video.muted || video.volume === 0) {
    video.muted = false;
    video.volume = 1;
    volumeSlider.value = 1;
  } else {
    video.muted = true;
    volumeSlider.value = 0;
  }
  updateVolumeUI();
});

// Play/pause toggle
function togglePlayPause() {
  if (video.paused) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    playPauseImg.alt = "Pause Button";
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
    playPauseImg.alt = "Play Button";
  }
}

// Progress bar update
video.addEventListener('timeupdate', function() {
  const progressPercent = (video.currentTime / video.duration) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
});

// Jump forward 10 seconds
function jumpForward() {
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
    showJumpOverlay("+10s");
  }

// Jump backward 10 seconds
function jumpBackward() {
  video.currentTime = Math.max(video.currentTime - 10, 0);
  showJumpOverlay("−10s");
}
// Initialize UI
updateVolumeUI();

function showJumpOverlay(text) {
    const overlay = document.getElementById('jump-overlay');
    overlay.textContent = text;
    overlay.classList.add('show');
  
    setTimeout(() => {
      overlay.classList.remove('show');
    }, 600);
  }
  