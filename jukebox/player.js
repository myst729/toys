var track = 0;
var audio = new Audio();
var ready = false;
var state;
var previousVolume;
var playing;
var playState = false;

var play = document.querySelector('.play');
var forward = document.querySelector('.forward');

var repeat = document.querySelector('.repeat');
var shuffle = document.querySelector('.shuffle');
var display = document.querySelector('.display');

var volume = document.querySelector('.volume');
var volumeBar = document.querySelector('.volume-bar');
var volumeKnob = document.querySelector('.volume-knob');

var elapsed = document.querySelector('.elapsed');
var total = document.querySelector('.total');
var progressBar = document.querySelector('.progress-bar');
var progressKnob = document.querySelector('.progress-knob');

var list = document.querySelector('.list');

var songs = [
  {
    artist: "Chandeen",
    title: "Jutland (One Last View)",
    link: "audio/chandeen_jutland-one-last-view.mp3"
  },
  {
    artist: "Katie Goes to Tokyo",
    title: "If It's Alright",
    link: "audio/katie-goes-to-tokyo_if-its-alright.mp3"
  }
];

function playTrack(track) {
  if(ready && audio.paused && audio.src == songs[track].link) {
    startAudio();
  } else {
    ready = false;
    playing = list.querySelector('.playing');
    if(playing) {
      playing.className = '';
    }
    list.getElementsByTagName('li')[track].className = 'playing';
    audio.src = songs[track].link;
  }
}

function startAudio() {
  if(!playState) {
    playState = true;
    playTrack(track);
  } else {
    audio.play();
    state = setInterval(updateState, 100);
  }
}

function stopAudio() {
  playState = false;
  audio.pause();
  clearInterval(state);
}

function isReady() {
  if(!ready) {
    ready = true;
    initState();
    startAudio();
  }  
}

function initState() {
  formatTime(audio.duration, total);
  formatTime(0, elapsed);
  updateProgress(0);
}

function updateState() {
  if(playState) {
    if(audio.paused && audio.currentTime === audio.duration) {
      forwardAction();
    } else {
      formatTime(audio.currentTime, elapsed);
      updateProgress(audio.currentTime, audio.duration);
    }
  }
}

function updateProgress(elapsedTime, totalTime) {
  if(elapsedTime === 0) {
    progressKnob.style.width = '0px';
  } else {
    progressKnob.style.width = (130 * elapsedTime / totalTime) + 'px';
  }
}

function formatTime(seconds, container) {
  var len = Math.ceil(seconds);
  var min = Math.floor(len / 60);
  var sec = len - min * 60;
  if(min < 10) {
    min = '0' + min;
  }
  if(sec < 10) {
    sec = '0' + sec;
  }
  container.innerHTML = min + ':' + sec;
}

function startVolume(e) {
  e.preventDefault();
  volumeKnob.dataset.modify = 'on';

  var vol = e.pageX - volumeKnob.getBoundingClientRect().left;
  
  if(vol < 0 || vol > 90) {
    return;
  }

  updateVolume(vol);
}

function moveVolume(e) {
  e.preventDefault();
  if(volumeKnob.dataset.modify != 'on') {
    return;
  }

  var vol = e.pageX - volumeKnob.getBoundingClientRect().left;
  
  if(vol < 0) {
    vol = 0;
  }
  if(vol > 90) {
    vol = 90;
  }

  updateVolume(vol);
}

function endVolume(e) {
  e.preventDefault();
  volumeKnob.dataset.modify = '';
}

function updateVolume(vol) {
  switch(true) {
    case vol == 0:
      volume.dataset.state = 'off';
      volume.title = '打开音量';
      break;
    case vol > 50:
      volume.dataset.state = 'high';
      volume.title = '静音';
      break;
    default:
      volume.dataset.state = 'low';
      volume.title = '静音';
  }

  volumeKnob.style.width = vol + 'px';
  audio.volume = vol / 90;
}

function toggleRepeat() {
  switch(true) {
    case repeat.dataset.state == 'off':
      repeat.dataset.state = 'on';
      audio.loop = false;
      break;
    case repeat.dataset.state == 'on':
      repeat.dataset.state = 'one';
      audio.loop = true;
      break;
    default:
      repeat.dataset.state = 'off';
      audio.loop = false;
  }
}

function toggleShuffle() {
  shuffle.dataset.state = (shuffle.dataset.state == 'off') ? 'on' : 'off';
}

function toggleDisplay() {
  display.dataset.state = (display.dataset.state == 'off') ? 'on' : 'off';
}

function toggleVolume() {
  if(volume.dataset.state == 'off') {
    updateVolume(previousVolume);
  } else {
    previousVolume = volumeKnob.getBoundingClientRect().width;
    updateVolume(0);
  }
}

function playAction() {
  if(play.classList.contains('on')) {
    play.classList.remove('on')
    play.classList.add('off');
    stopAudio();
  } else {
    play.classList.remove('off');
    play.classList.add('on');
    startAudio();
  }
}

function forwardAction() {
  if(track == songs.length - 1 && repeat.dataset.state == 'off') {
    track = 0;
    play.classList.remove('on');
    play.classList.add('off');
    playing = list.querySelector('.playing');
    if(playing) {
      playing.className = '';
    }
    stopAudio();
  } else {
    track = (track == songs.length - 1) ? 0 : track + 1;
    play.classList.remove('off');
    play.classList.add('on');
    playTrack(track);
  }
}

function generateList() {
  var tmpl = '<li><span class="artist">{{artist}}</span><span class="title">{{title}}</span></li>';
  var ul = document.createElement('ul');
  // front(tmpl, songs, ul);
  songs.forEach(function(song) {
    var li = document.createElement('li');
    li.innerHTML = `<span class="artist">${song.artist}</span><span class="title">${song.title}</span>`
    ul.appendChild(li)
  })
  list.appendChild(ul);
}

function init() {
  generateList();

  play.addEventListener('click', playAction, false);
  forward.addEventListener('click', forwardAction, false);

  repeat.addEventListener('click', toggleRepeat, false);
  shuffle.addEventListener('click', toggleShuffle, false);
  display.addEventListener('click', toggleDisplay, false);

  volume.addEventListener('click', toggleVolume, false);

  volumeBar.addEventListener('mousedown', startVolume, false);
  document.addEventListener('mousemove', moveVolume, false);
  document.addEventListener('mouseup', endVolume, false);

  audio.addEventListener('canplay', isReady,false);
  audio.addEventListener('canplaythrough', isReady,false);
  audio.addEventListener('loadeddata', isReady,false);
}

init();