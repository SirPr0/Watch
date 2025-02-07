const elements = {
    settingsButton: document.getElementById('settingsButton'),
    settingsPanel: document.getElementById('settingsPanel'),
    slider: document.getElementById('slider'),
    toggleNotes: document.getElementById('toggleNotesButton'),
    toggleTimer: document.getElementById('toggleTimerButton'),
    toggleVideo: document.getElementById('toggleVideoPlayerButton'),
    watchingMode: document.getElementById('watchingModeButton'),
    superSecret: document.getElementById('superSecretButton'),
    videoPlayerWindow: document.getElementById('videoPlayerWindow'),
    videoUrl: document.getElementById('videoUrl'),
    runVideo: document.getElementById('runVideoButton'),
    videoPlayer: document.getElementById('videoPlayer')
};

let state = {
    dragging: null,
    offset: { x: 0, y: 0 },
    timer: { interval: null, time: 0 },
    secret: { clicks: 0, lastClick: 0 }
};

// Settings Panel Toggle
elements.settingsButton.addEventListener('click', () => {
    elements.settingsPanel.style.display = 
        elements.settingsPanel.style.display === 'block' ? 'none' : 'block';
});

// Transparency Control
elements.slider.addEventListener('input', (e) => {
    const opacity = e.target.value;
    document.querySelectorAll('.window').forEach(w => w.style.opacity = opacity);
});

// Window Toggles
elements.toggleNotes.addEventListener('click', () => toggleWindow('notesWindow'));
elements.toggleTimer.addEventListener('click', () => toggleWindow('timerWindow'));
elements.toggleVideo.addEventListener('click', () => toggleWindow('videoPlayerWindow'));

function toggleWindow(id) {
    const window = document.getElementById(id);
    window.style.display = window.style.display === 'none' ? 'block' : 'none';
}

// Enhanced Watching Mode
elements.watchingMode.addEventListener('click', () => {
    elements.videoPlayerWindow.classList.toggle('watching-mode');
    
    // Secret button activation
    const now = Date.now();
    if (now - state.secret.lastClick < 3600000) { // 1 hour
        state.secret.clicks++;
    } else {
        state.secret.clicks = 1;
    }
    state.secret.lastClick = now;

    if (state.secret.clicks >= 2) {
        elements.superSecret.style.display = 'block';
        state.secret.clicks = 0;
    }
});

// Super Secret Button
elements.superSecret.addEventListener('click', () => {
    const secretWindow = document.createElement('div');
    secretWindow.className = 'window secret-floating-window';
    secretWindow.innerHTML = `
        <iframe src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&controls=0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>`;
    
    document.body.appendChild(secretWindow);
    
    setTimeout(() => {
        secretWindow.remove();
        elements.superSecret.style.display = 'none';
    }, 12000);
});

// Dragging System
document.querySelectorAll('.title-bar').forEach(bar => {
    bar.addEventListener('mousedown', (e) => {
        const window = bar.parentElement;
        state.dragging = window;
        state.offset = {
            x: e.clientX - window.offsetLeft,
            y: e.clientY - window.offsetTop
        };
    });
});

document.addEventListener('mousemove', (e) => {
    if (state.dragging) {
        state.dragging.style.left = `${e.clientX - state.offset.x}px`;
        state.dragging.style.top = `${e.clientY - state.offset.y}px`;
    }
});

document.addEventListener('mouseup', () => {
    state.dragging = null;
});

// Video Player Functionality
elements.runVideo.addEventListener('click', () => {
    const url = elements.videoUrl.value.trim();
    let embedUrl = null;

    const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
    const twitchChannel = url.match(/twitch.tv\/(\w+)/)?.[1];
    const kickChannel = url.match(/kick.com\/(\w+)/)?.[1];

    if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (twitchChannel) {
        embedUrl = `https://player.twitch.tv/?channel=${twitchChannel}&parent=${location.hostname}`;
    } else if (kickChannel) {
        embedUrl = `https://player.kick.com/${kickChannel}`;
    }

    if (embedUrl) {
        elements.videoPlayer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    } else {
        alert('Invalid URL! Supported: YouTube, Twitch, Kick');
    }
});

// Timer System
document.querySelectorAll('.timer-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const action = e.target.id;
        if (action.includes('Minute')) {
            const minutes = parseInt(action.match(/\d+/), 10);
            state.timer.time += minutes * 60;
        } else {
            if (action === 'startTimerButton') startTimer();
            if (action === 'pauseTimerButton') pauseTimer();
            if (action === 'resetTimerButton') resetTimer();
        }
        updateTimerDisplay();
    });
});

function startTimer() {
    clearInterval(state.timer.interval);
    state.timer.interval = setInterval(() => {
        if (state.timer.time <= 0) {
            clearInterval(state.timer.interval);
            alert("Time's up!");
            return;
        }
        state.timer.time--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(state.timer.interval);
}

function resetTimer() {
    clearInterval(state.timer.interval);
    state.timer.time = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = String(Math.floor(state.timer.time / 60)).padStart(2, '0');
    const seconds = String(state.timer.time % 60).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}
