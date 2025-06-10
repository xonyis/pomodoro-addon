let timer;
let running = false;
let cycles = 0;
let endTimestamp = null;
let mode = 'work'; // 'work' ou 'break'

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const cyclesDisplay = document.getElementById('cycles');

function saveState() {
  localStorage.setItem('pomodoro_state', JSON.stringify({
    running,
    cycles,
    endTimestamp,
    mode
  }));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem('pomodoro_state'));
  if (state) {
    running = state.running;
    cycles = state.cycles;
    endTimestamp = state.endTimestamp;
    mode = state.mode || 'work';
  }
}

function getDefaultDuration() {
  return mode === 'work' ? 25 * 60 : 5 * 60;
}

function getTimeLeft() {
  if (!endTimestamp) return getDefaultDuration();
  return Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
}

function updateDisplay() {
  let timeLeft = getTimeLeft();
  if (timeLeft < 0) timeLeft = 0;
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
  cyclesDisplay.textContent = `Cycles : ${cycles}`;
}

function startInterval() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    let timeLeft = getTimeLeft();
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      running = false;
      if (mode === 'work') {
        cycles++;
        mode = 'break';
        alert('Pause !');
      } else {
        mode = 'work';
        alert('C\'est reparti !');
      }
      endTimestamp = null;
      saveState();
      updateDisplay();
    }
  }, 1000);
}

function startTimer() {
  if (running) return;
  running = true;
  let timeLeft = getTimeLeft();
  endTimestamp = Date.now() + timeLeft * 1000;
  saveState();
  startInterval();
}

function pauseTimer() {
  clearInterval(timer);
  running = false;
  // recalculer le temps restant et stocker un nouveau endTimestamp
  let timeLeft = getTimeLeft();
  endTimestamp = Date.now() + timeLeft * 1000;
  saveState();
  updateDisplay();
}

function resetTimer() {
  clearInterval(timer);
  running = false;
  endTimestamp = null;
  mode = 'work';
  cycles = 0;
  updateDisplay();
  saveState();
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}

function updateAnalogClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const hourAngle = (hours % 12) * 30 + minutes / 2;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  document.querySelector('.hours').style.transform = `rotateZ(${hourAngle}deg)`;
  document.querySelector('.minutes').style.transform = `rotateZ(${minuteAngle}deg)`;
  document.querySelector('.seconds').style.transform = `rotateZ(${secondAngle}deg)`;
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

loadState();
updateDisplay();
if (running) startInterval();
setInterval(updateClock, 1000);
updateClock();
setInterval(updateAnalogClock, 1000);
updateAnalogClock();
