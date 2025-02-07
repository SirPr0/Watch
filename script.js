class FloatingSuite {
    constructor() {
        this.dragging = null;
        this.offset = { x: 0, y: 0 };
        this.timer = { interval: null, time: 0 };
        this.secretClicks = 0;
        
        this.initDraggables();
        this.initSettings();
        this.initVideoPlayer();
        this.initTimer();
    }

    initDraggables() {
        document.querySelectorAll('.title-bar').forEach(bar => {
            bar.addEventListener('mousedown', (e) => {
                this.dragging = bar.parentElement;
                const rect = this.dragging.getBoundingClientRect();
                this.offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.dragging) {
                this.dragging.style.left = `${e.clientX - this.offset.x}px`;
                this.dragging.style.top = `${e.clientY - this.offset.y}px`;
            }
        });

        document.addEventListener('mouseup', () => this.dragging = null);
    }

    initSettings() {
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.getElementById('settingsPanel');
        const slider = document.getElementById('slider');

        settingsButton.addEventListener('click', () => {
            settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        });

        slider.addEventListener('input', (e) => {
            document.querySelectorAll('.window').forEach(window => {
                window.style.opacity = e.target.value;
            });
        });

        // Watching Mode Logic
        document.getElementById('watchingModeButton').addEventListener('click', () => {
            document.querySelector('.video-window').classList.toggle('watching-mode');
            this.secretClicks++;
            
            if (this.secretClicks >= 2) {
                document.getElementById('superSecretButton').style.display = 'inline-block';
                this.secretClicks = 0;
                setTimeout(() => {
                    document.getElementById('superSecretButton').style.display = 'none';
                }, 60000);
            }
        });

        // Super Secret Button
        document.getElementById('superSecretButton').addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'secret-overlay';
            overlay.innerHTML = `
                <iframe src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&volume=25" 
                        allow="autoplay; encrypted-media" 
                        style="border:none">
                </iframe>`;
            
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.remove();
            }, 10000);
        });
    }

    initVideoPlayer() {
        const videoInput = document.getElementById('videoUrl');
        const runButton = document.getElementById('runVideo');
        
        runButton.addEventListener('click', () => {
            const url = videoInput.value.trim();
            let embedUrl = '';
            
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.split(/v=|\/|be\//)[1].split(/[?&]/)[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else if (url.includes('twitch.tv')) {
                const channel = url.split('/').pop();
                embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}`;
            } else if (url.includes('kick.com')) {
                const channel = url.split('/').pop();
                embedUrl = `https://player.kick.com/${channel}`;
            }
            
            if (embedUrl) {
                document.getElementById('videoPlayer').innerHTML = 
                    `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
            }
        });
    }

    initTimer() {
        const timerButtons = {
            add1Min: 60,
            add5Min: 300,
            add10Min: 600,
            startTimer: 'start',
            resetTimer: 'reset'
        };

        Object.entries(timerButtons).forEach(([id, value]) => {
            document.getElementById(id).addEventListener('click', () => {
                if (typeof value === 'number') {
                    this.timer.time += value;
                } else {
                    if (value === 'start') this.startTimer();
                    if (value === 'reset') this.resetTimer();
                }
                this.updateTimerDisplay();
            });
        });
    }

    startTimer() {
        clearInterval(this.timer.interval);
        this.timer.interval = setInterval(() => {
            if (this.timer.time <= 0) {
                clearInterval(this.timer.interval);
                alert("Timer Complete!");
                return;
            }
            this.timer.time--;
            this.updateTimerDisplay();
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timer.interval);
        this.timer.time = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.time / 60).toString().padStart(2, '0');
        const seconds = (this.timer.time % 60).toString().padStart(2, '0');
        document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
    }
}

// Initialize Application
new FloatingSuite();
