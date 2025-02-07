// script.js
class MediaSuite {
    constructor() {
        this.draggingElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.timerState = { interval: null, time: 0 };
        this.secretClicks = [];
        
        this.initializeDraggableWindows();
        this.initializeSettingsPanel();
        this.initializeVideoPlayer();
        this.initializeTimer();
        this.initializeSecretButton();
    }

    initializeDraggableWindows() {
        document.querySelectorAll('.title-bar').forEach(bar => {
            bar.addEventListener('mousedown', (e) => {
                this.draggingElement = bar.parentElement;
                const rect = this.draggingElement.getBoundingClientRect();
                this.dragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.draggingElement) {
                this.draggingElement.style.left = `${e.clientX - this.dragOffset.x}px`;
                this.draggingElement.style.top = `${e.clientY - this.dragOffset.y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            this.draggingElement = null;
        });
    }

    initializeSettingsPanel() {
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.getElementById('settingsPanel');
        const transparencySlider = document.getElementById('transparencySlider');

        // Toggle settings panel visibility
        settingsButton.addEventListener('click', () => {
            settingsPanel.style.display = 
                settingsPanel.style.display === 'block' ? 'none' : 'block';
        });

        // Handle transparency changes
        transparencySlider.addEventListener('input', (e) => {
            document.querySelectorAll('.window').forEach(window => {
                window.style.opacity = e.target.value;
            });
        });

        // Window toggle controls
        document.getElementById('toggleNotes').addEventListener('click', () => {
            this.toggleWindowVisibility('.notes-window');
        });

        document.getElementById('toggleTimer').addEventListener('click', () => {
            this.toggleWindowVisibility('.timer-window');
        });

        document.getElementById('toggleVideo').addEventListener('click', () => {
            this.toggleWindowVisibility('.video-window');
        });
    }

    initializeVideoPlayer() {
        const runButton = document.getElementById('runVideo');
        const urlInput = document.getElementById('videoUrl');

        runButton.addEventListener('click', () => {
            const url = urlInput.value.trim();
            let embedUrl = '';

            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } 
            else if (url.includes('twitch.tv')) {
                const channel = url.split('/').pop();
                embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}`;
            } 
            else if (url.includes('kick.com')) {
                const channel = url.split('/').pop();
                embedUrl = `https://player.kick.com/${channel}`;
            }

            if (embedUrl) {
                document.getElementById('videoPlayer').innerHTML = `
                    <iframe src="${embedUrl}" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>`;
            }
        });
    }

    initializeTimer() {
        const timerControls = {
            add1Min: 60,
            add5Min: 300,
            add10Min: 600,
            startTimer: 'start',
            resetTimer: 'reset'
        };

        Object.entries(timerControls).forEach(([id, value]) => {
            document.getElementById(id).addEventListener('click', () => {
                if (typeof value === 'number') {
                    this.timerState.time += value;
                } else {
                    if (value === 'start') this.startTimer();
                    if (value === 'reset') this.resetTimer();
                }
                this.updateTimerDisplay();
            });
        });
    }

    initializeSecretButton() {
        const watchingModeButton = document.getElementById('watchingMode');
        const secretButton = document.getElementById('superSecretButton');

        watchingModeButton.addEventListener('click', () => {
            // Toggle watching mode borders
            document.querySelector('.video-window').classList.toggle('watching-mode');
            
            // Handle secret button activation
            const now = Date.now();
            this.secretClicks = this.secretClicks.filter(clickTime => 
                now - clickTime < 3600000 // 60 minutes
            );
            this.secretClicks.push(now);

            if (this.secretClicks.length >= 2) {
                secretButton.style.display = 'block';
                this.secretClicks = [];
            }
        });

        secretButton.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'secret-overlay';
            overlay.innerHTML = `
                <iframe src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&volume=25&mute=0" 
                        allow="autoplay; encrypted-media" 
                        allowfullscreen>
                </iframe>`;
            
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.remove();
                secretButton.style.display = 'none';
            }, 10000);
        });
    }

    toggleWindowVisibility(selector) {
        const window = document.querySelector(selector);
        window.style.display = window.style.display === 'none' ? 'block' : 'none';
    }

    startTimer() {
        clearInterval(this.timerState.interval);
        this.timerState.interval = setInterval(() => {
            if (this.timerState.time <= 0) {
                clearInterval(this.timerState.interval);
                alert("Timer Complete!");
                return;
            }
            this.timerState.time--;
            this.updateTimerDisplay();
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerState.interval);
        this.timerState.time = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerState.time / 60)
            .toString().padStart(2, '0');
        const seconds = (this.timerState.time % 60)
            .toString().padStart(2, '0');
        document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
    }
}

// Initialize the application
new MediaSuite();
