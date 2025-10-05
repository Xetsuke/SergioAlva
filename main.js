const audio = document.getElementById('bg');
const btn = document.getElementById('music-toggle');
const icon = btn.querySelector('i');

// for preload
audio.preload = 'auto';
audio.load();

const setUI = (playing) => {
  btn.classList.toggle('playing', playing);
  icon.classList.toggle('fa-music', !playing);
  icon.classList.toggle('fa-volume-high', playing);
};

const fadeTo = (target = 0.1, ms = 800) => {
  const start = performance.now();
  const from = audio.volume;
  const step = (t) => {
    const p = Math.min(1, (t - start) / ms);
    audio.volume = from + (target - from) * p;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

btn.addEventListener('click', async () => {
  try {
    if (audio.paused || audio.muted || audio.volume === 0) {
      // play
      audio.muted = false;
      audio.removeAttribute('muted');
      audio.defaultMuted = false;
      audio.volume = 0.0;
      await audio.play();
      fadeTo(0.10, 800);
      setUI(true);
    } else {
      // pause
      const v0 = audio.volume;
      const start = performance.now();
      const down = (t) => {
        const p = Math.min(1, (t - start) / 250);
        audio.volume = v0 * (1 - p);
        if (p < 1) requestAnimationFrame(down);
        else {
          audio.pause();
          audio.muted = true;
          audio.defaultMuted = true;
          setUI(false);
        }
      };
      requestAnimationFrame(down);
    }
  } catch (err) {
    console.error('Playback failed:', err);
  }
});

// resume when visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !audio.muted && audio.paused) {
    audio.play().catch(() => {});
  }
});
