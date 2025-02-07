const notesWindow = document.getElementById('notesWindow');
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const slider = document.getElementById('slider');
const toggleNotesButton = document.getElementById('toggleNotesButton');
const toggleTimerButton = document.getElementById('toggleTimerButton');
const toggleVideoPlayerButton = document.getElementById('toggleVideoPlayerButton');
const watchingModeButton = document.getElementById('watchingModeButton');
const superSecretButton = document.getElementById('superSecretButton');
const videoPlayerWindow = document.getElementById('videoPlayerWindow');
const videoUrlInput = document.getElementById('videoUrl');
const runVideoButton = document.getElementById('runVideoButton');
const videoPlayer = document.getElementById('videoPlayer');

// Dragging functionality
let isDragging = false;
let currentDraggable = null;
let offsetX, offsetY;

document.querySelectorAll('.title-bar').forEach(bar => {
    bar.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentDraggable = bar.parentElement;
        offsetX = e.clientX - currentDraggable.offsetLeft;
        offsetY = e.clientY - currentDraggable.offsetTop;
    });
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentDraggable) {
        currentDraggable.style.left = `${e.clientX - offsetX}px`;
        currentDraggable.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentDraggable = null;
});

// Settings panel
settingsButton.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

// Transparency control
slider.addEventListener('input', (e) => {
    const opacity = e.target.value;
    document.querySelectorAll('.window').forEach(window => {
        window.style.opacity = opacity;
    });
});

// Window visibility toggles
toggleNotesButton.addEventListener('click', () => toggleWindow('notesWindow', toggleNotesButton));
toggleTimerButton.addEventListener('click', () => toggleWindow('timerWindow', toggleTimerButton));
toggleVideoPlayerButton.addEventListener('click', () => toggleWindow('videoPlayerWindow', toggleVideoPlayerButton));

function toggleWindow(windowId, button) {
    const window = document.getElementById(windowId);
    window.style.display = window.style.display === 'none' ? 'block' : 'none';
    button.textContent = window.style.display === 'none' ? `Show ${button.id.replace('toggle', '')}` : `Hide ${button.id.replace('toggle', '')}`;
}

// Watching Mode functionality
let watchingModeClicks = 0;
let watchingModeTimeout = null;

watchingModeButton.addEventListener('click', () => {
    videoPlayerWindow.classList.toggle('watching-mode');
    watchingModeClicks++;
    
    if (watchingModeTimeout) clearTimeout(watchingModeTimeout);
    watchingModeTimeout = setTimeout(() => watchingModeClicks = 0, 21600000); // 60 minutes
    
    if (watchingModeClicks >= 2) {
        superSecretButton.style.display = 'block';
        watchingModeClicks = 0;
    }
});

// Super Secret Button
superSecretButton.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'secret-overlay';
    overlay.innerHTML = `
        <iframe src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>`;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
        window.close();
    }, 9000);
});

// Video player functionality
runVideoButton.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    let embedUrl = null;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
        if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes("twitch.tv")) {
        const channel = url.match(/twitch.tv\/([a-zA-Z0-9_]+)/)?.[1];
        if (channel) embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}`;
    } else if (url.includes("kick.com")) {
        const channel = url.match(/kick.com\/([a-zA-Z0-9_]+)/)?.[1];
        if (channel) embedUrl = `https://player.kick.com/${channel}`;
    }

    if (embedUrl) {
        videoPlayer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    } else {
        alert("Invalid URL! Supported platforms: YouTube, Twitch, Kick");
    }
});

// Timer functionality
let timerInterval;
let timeRemaining = 0;

document.querySelectorAll('#add1Minute, #add5Minutes, #add10Minutes').forEach(button => {
    button.addEventListener('click', (e) => {
        timeRemaining += parseInt(e.target.id.replace('add', '').replace('Minutes', '')) * 60;
        updateTimerDisplay();
    });
});

document.getElementById('startTimerButton').addEventListener('click', startTimer);
document.getElementById('pauseTimerButton').addEventListener('click', () => clearInterval(timerInterval));
document.getElementById('stopTimerButton').addEventListener('click', resetTimer);
document.getElementById('resetTimerButton').addEventListener('click', resetTimer);

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            return;
        }
        timeRemaining--;
        updateTimerDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeRemaining = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}
