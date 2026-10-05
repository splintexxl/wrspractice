// WRS Practice — scramble timer modal

document.addEventListener('DOMContentLoaded', () => {
  const data = window.RECORD_DATA;
  if (!data) return;

  const modal = document.getElementById('timer-modal');
  const tryBtn = document.getElementById('try-btn');
  const modalScramble = document.getElementById('modal-scramble');
  const timerValue = document.getElementById('timer-value');
  const timerStatus = document.getElementById('timer-status');
  const timerDisplay = document.getElementById('timer-display');
  const timerResult = document.getElementById('timer-result');
  const yourTimeEl = document.getElementById('your-time');

  // Если кнопки или модалки нет на странице — выходим, чтобы не было ошибок
  if (!tryBtn || !modal) return;

  let state = 'idle'; // idle | readying | running | stopped
  let startTime = 0;
  let rafId = null;
  let finalTime = 0;

  function formatTime(ms) {
    const seconds = ms / 1000;
    if (seconds < 60) {
      return seconds.toFixed(2);
    }
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  }

  function updateDisplay() {
    if (state !== 'running') return;
    const elapsed = performance.now() - startTime;
    timerValue.textContent = formatTime(elapsed);
    rafId = requestAnimationFrame(updateDisplay);
  }

  function resetTimer() {
    state = 'idle';
    startTime = 0;
    finalTime = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    timerValue.textContent = '0.00';
    timerValue.style.color = '';
    timerStatus.textContent = 'Hold Space to ready';
    timerDisplay.classList.remove('is-running');
    if (timerResult) timerResult.hidden = true;
  }

  function readyTimer() {
    state = 'readying';
    timerValue.textContent = '0.00';
    timerValue.style.color = '#10b981'; // Зеленый цвет готовности
    timerStatus.textContent = 'Release Space to start!';
    if (timerResult) timerResult.hidden = true;
  }

  function startTimer() {
    state = 'running';
    startTime = performance.now();
    timerValue.style.color = '';
    timerStatus.textContent = 'Solving… press Space to stop';
    timerDisplay.classList.add('is-running');
    if (timerResult) timerResult.hidden = true;
    rafId = requestAnimationFrame(updateDisplay);
  }

  function stopTimer() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    finalTime = performance.now() - startTime;
    state = 'stopped';

    timerValue.textContent = formatTime(finalTime);
    timerValue.style.color = '';
    timerStatus.textContent = 'Press Space to reset';
    timerDisplay.classList.remove('is-running');

    if (yourTimeEl) yourTimeEl.textContent = formatTime(finalTime);
    if (timerResult) timerResult.hidden = false;
  }

  function openModal() {
    if (modalScramble && data.scramble) {
      modalScramble.textContent = data.scramble;
    }
    resetTimer();
    
    // Вычисляем ширину скроллбара и компенсируем ее
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    
    // Ждем 300мс (пока идет плавная анимация исчезновения), потом возвращаем страницу в норму
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      resetTimer();
    }, 300);
  }

  // Навешиваем клик на Try it
  tryBtn.addEventListener('click', openModal);

  // Закрытие модалки
  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // Зажатие клавиши Space
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;

    if (e.code === 'Escape') {
      closeModal();
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (e.repeat) return;

      if (state === 'running') {
        stopTimer();
      } else if (state === 'stopped') {
        resetTimer();
      } else if (state === 'idle') {
        readyTimer();
      }
    }
  });

  // Отпускание клавиши Space
  document.addEventListener('keyup', (e) => {
    if (!modal.classList.contains('is-open')) return;

    if (e.code === 'Space' && state === 'readying') {
      startTimer();
    }
  });
});