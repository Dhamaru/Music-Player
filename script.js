const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playpauseBtn = wrapper.querySelector(".play-pause"),
playpauseIcon = wrapper.querySelector(".play-pause i"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => loadMusic(musicIndex));

function loadMusic(indexNumb) {
  const track = allMusic[indexNumb - 1];
  musicName.innerText = track.name;
  musicArtist.innerText = track.artist;
  musicImg.src = `${track.src}.jpg`;
  mainAudio.src = `${track.src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playpauseIcon.innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playpauseIcon.innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  musicIndex--;
  if (musicIndex < 1) musicIndex = allMusic.length;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

function nextMusic() {
  musicIndex++;
  if (musicIndex > allMusic.length) musicIndex = 1;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

playpauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

mainAudio.addEventListener("loadeddata", () => {
  let musicDuration = wrapper.querySelector(".max-duration");
  let audioDuration = mainAudio.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
  if (totalSec < 10) totalSec = `0${totalSec}`;
  musicDuration.innerText = `${totalMin}:${totalSec}`;
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time");
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
  playMusic();
});

mainAudio.addEventListener("ended", nextMusic);

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
    <li li-index="${i + 1}">
      <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
      </div>
      <audio class="${allMusic[i].src}" src="${allMusic[i].src}.mp3"></audio>
      <span id="${allMusic[i].src}" class="audio-duration">0:00</span>
    </li>
  `;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

function playingNow() {
  const allLiTags = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      audioTag.innerText = audioTag.getAttribute("t-duration");
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

playingNow();
