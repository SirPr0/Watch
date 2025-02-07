const elements = {
    settingsButton: document.getElementById('settingsButton'),
    settingsPanel: document.getElementById('settingsPanel'),
    slider: document.getElementById('slider'),
    toggleNotesButton: document.getElementById('toggleNotesButton'),
    toggleTimerButton: document.getElementById('toggleTimerButton'),
    toggleVideoPlayerButton: document.getElementById('toggleVideoPlayerButton'),
    watchingModeButton: document.getElementById('watchingModeButton'),
    superSecretButton: document.getElementById('superSecretButton'),
    videoPlayerWindow: document.getElementById('videoPlayerWindow'),
    videoUrlInput: document.getElementById('videoUrl'),
    runVideoButton: document.getElementById('runVideoButton'),
    videoPlayer: document.getElementById('videoPlayer'),
};

let dragState = {
    isDragging: false,
    currentElement: null,
    offsetX: 0,
    offsetY: 0
};

let timerState = {
    interval: null,
    timeRemaining: 0,
    isPaused: false
};

let secretState = {
    clickCount: 0,
    lastClickTime: 0
};

// Dragging functionality
document.querySelectorAll('.title-bar').forEach(bar => {
    bar.addEventListener('mousedown', (e) => {
        dragState = {
            isDragging: true,
            currentElement: bar.parentElement,
            offsetX: e.clientX - bar.parentElement.offsetLeft,
            offsetY: e.clientY - bar.parentElement.offsetTop
        };
    });
});

document.addEventListener('mousemove', (e) => {
    if (dragState.isDragging && dragState.currentElement) {
        dragState.currentElement.style.left = `${e.clientX - dragState.offsetX}px`;
        dragState.currentElement.style.top = `${e.clientY - dragState.offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    dragState.isDragging = false;
    dragState.currentElement = null;
});

// Settings Panel
elements.settingsButton.addEventListener('click', () => {
    elements.settingsPanel.style.display = 
        elements.settingsPanel.style.display === 'none' ? 'block' : 'none';
});

// Transparency Control
elements.slider.addEventListener('input', (e) => {
    const opacity = e.target.value;
    document.querySelectorAll('.window').forEach(window => {
        window.style.opacity = opacity;
    });
});

// Window Toggles
elements.toggleNotesButton.addEventListener('click', () => toggleWindow('notesWindow'));
elements.toggleTimerButton.addEventListener('click', () => toggleWindow('timerWindow'));
elements.toggleVideoPlayerButton.addEventListener('click', () => toggleWindow('videoPlayerWindow'));

function toggleWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = window.style.display === 'none' ? 'block' : 'none';
}

// Watching Mode
elements.watchingModeButton.addEventListener('click', () => {
    document.body.classList.toggle('no-borders');
    
    // Track double click within 60 minutes
    const now = Date.now();
    if (now - secretState.lastClickTime < 3600000) { // 1 hour
        secretState.clickCount++;
    } else {
        secretState.clickCount = 1;
    }
    secretState.lastClickTime = now;

    if (secretState.clickCount >= 2) {
        elements.superSecretButton.style.display = 'block';
        secretState.clickCount = 0;
    }
});

// Super Secret Button
elements.superSecretButton.addEventListener('click', () => {
    const secretWindow = document.createElement('div');
    secretWindow.className = 'window secret-floating-window';
    secretWindow.innerHTML = `
        <iframe src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&controls=0&modestbranding=1"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
        </iframe>`;
    
    document.body.appendChild(secretWindow);
    
    setTimeout(() => {
        secretWindow.remove();
        elements.superSecretButton.style.display = 'none';
    }, 12000);
});

// Video Player
elements.runVideoButton.addEventListener('click', () => {
    const url = elements.videoUrlInput.value.trim();
    let embedUrl = null;

    const platformHandlers = {
        youtube: (url) => url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1],
        twitch: (url) => url.match(/twitch.tv\/([a-zA-Z0-9_]+)/)?.[1],
        kick: (url) => url.match(/kick.com\/([a-zA-Z0-9_]+)/)?.[1]
    };

    for (const [platform, handler] of Object.entries(platformHandlers)) {
        if (url.includes(platform)) {
            const id = handler(url);
            if (id) {
                embedUrl = platform === 'youtube' 
                    ? `https://www.youtube.com/embed/${id}?autoplay=1`
                    : platform === 'twitch'
                    ? `https://player.twitch.tv/?channel=${id}&parent=${location.hostname}`
                    : `https://player.kick.com/${id}`;
                break;
            }
        }
    }

    if (embedUrl) {
        elements.videoPlayer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    } else {
        alert("Invalid URL! Supported platforms: YouTube, Twitch, Kick");
    }
});

// Timer System
document.querySelectorAll('#add1Minute, #add5Minutes, #add10Minutes').forEach(button => {
    button.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.id.replace(/\D/g, ''), 10);
        timerState.timeRemaining += minutes * 60;
        updateTimerDisplay();
    });
});

document.getElementById('startTimerButton').addEventListener('click', startTimer);
document.getElementById('pauseTimerButton').addEventListener('click', pauseTimer);
document.getElementById('stopTimerButton').addEventListener('click', resetTimer);
document.getElementById('resetTimerButton').addEventListener('click', resetTimer);

function startTimer() {
    clearInterval(timerState.interval);
    timerState.interval = setInterval(() => {
        if (timerState.timeRemaining <= 0) {
            clearInterval(timerState.interval);
            alert("Time's up!");
            return;
        }
        timerState.timeRemaining--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerState.interval);
}

function resetTimer() {
    clearInterval(timerState.interval);
    timerState.timeRemaining = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerState.timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timerState.timeRemaining % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}
