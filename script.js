const notesWindow = document.getElementById('notesWindow');
const notesTitleBar = document.getElementById('notesTitleBar');
const notesTextArea = document.getElementById('notesTextArea');
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const slider = document.getElementById('slider');
const toggleNotesButton = document.getElementById('toggleNotesButton');
const toggleTimerButton = document.getElementById('toggleTimerButton');
const toggleVideoPlayerButton = document.getElementById('toggleVideoPlayerButton');
const watchingModeButton = document.getElementById('watchingModeButton');
const superSecretButton = document.getElementById('superSecretButton');

const videoPlayerWindow = document.getElementById('videoPlayerWindow');
const videoPlayerTitleBar = document.getElementById('videoPlayerTitleBar');
const videoUrlInput = document.getElementById('videoUrl');
const runVideoButton = document.getElementById('runVideoButton');
const videoPlayer = document.getElementById('videoPlayer');

const timerWindow = document.getElementById('timerWindow');
const timerTitleBar = document.getElementById('timerTitleBar');
const add1Minute = document.getElementById('add1Minute');
const add5Minutes = document.getElementById('add5Minutes');
const add10Minutes = document.getElementById('add10Minutes');
const timerDisplay = document.getElementById('timerDisplay');
const startTimerButton = document.getElementById('startTimerButton');
const pauseTimerButton = document.getElementById('pauseTimerButton');
const stopTimerButton = document.getElementById('stopTimerButton');
const resetTimerButton = document.getElementById('resetTimerButton');

let isDraggingNotes = false;
let isDraggingVideoPlayer = false;
let isDraggingTimer = false;
let offsetX, offsetY;

let timerInterval;
let timeRemaining = 0;
let isPaused = false;

let watchingModeClicks = 0;
let lastWatchingModeClickTime = 0;

// Make the Notes Window draggable
notesTitleBar.addEventListener('mousedown', (e) => {
    isDraggingNotes = true;
    offsetX = e.clientX - notesWindow.getBoundingClientRect().left;
    offsetY = e.clientY - notesWindow.getBoundingClientRect().top;
});

// Make the Video Player Window draggable
videoPlayerTitleBar.addEventListener('mousedown', (e) => {
    isDraggingVideoPlayer = true;
    offsetX = e.clientX - videoPlayerWindow.getBoundingClientRect().left;
    offsetY = e.clientY - videoPlayerWindow.getBoundingClientRect().top;
});

// Make the Timer Window draggable
timerTitleBar.addEventListener('mousedown', (e) => {
    isDraggingTimer = true;
    offsetX = e.clientX - timerWindow.getBoundingClientRect().left;
    offsetY = e.clientY - timerWindow.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingNotes) {
        notesWindow.style.left = `${e.clientX - offsetX}px`;
        notesWindow.style.top = `${e.clientY - offsetY}px`;
    }
    if (isDraggingVideoPlayer) {
        videoPlayerWindow.style.left = `${e.clientX - offsetX}px`;
        videoPlayerWindow.style.top = `${e.clientY - offsetY}px`;
    }
    if (isDraggingTimer) {
        timerWindow.style.left = `${e.clientX - offsetX}px`;
        timerWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDraggingNotes = false;
    isDraggingVideoPlayer = false;
    isDraggingTimer = false;
});

// Toggle settings panel visibility
settingsButton.addEventListener('click', () => {
    if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
    }
});

// Control all windows' transparency using the slider
slider.addEventListener('input', () => {
    const opacity = slider.value;
    notesWindow.style.opacity = opacity;
    videoPlayerWindow.style.opacity = opacity;
    timerWindow.style.opacity = opacity;
});

// Toggle Notes Window visibility
toggleNotesButton.addEventListener('click', () => {
    if (notesWindow.style.display === 'none') {
        notesWindow.style.display = 'block';
        toggleNotesButton.textContent = 'Hide Notes';
    } else {
        notesWindow.style.display = 'none';
        toggleNotesButton.textContent = 'Show Notes';
    }
});

// Toggle Timer Window visibility
toggleTimerButton.addEventListener('click', () => {
    if (timerWindow.style.display === 'none') {
        timerWindow.style.display = 'block';
        toggleTimerButton.textContent = 'Hide Timer';
    } else {
        timerWindow.style.display = 'none';
        toggleTimerButton.textContent = 'Show Timer';
    }
});

// Toggle Video Player Window visibility
toggleVideoPlayerButton.addEventListener('click', () => {
    if (videoPlayerWindow.style.display === 'none') {
        videoPlayerWindow.style.display = 'block';
        toggleVideoPlayerButton.textContent = 'Hide Video Player';
    } else {
        videoPlayerWindow.style.display = 'none';
        toggleVideoPlayerButton.textContent = 'Show Video Player';
    }
});

// Watching Mode functionality
watchingModeButton.addEventListener('click', () => {
    videoPlayerWindow.classList.toggle('watching-mode');

    // Track clicks for Super Secret Button
    const currentTime = Date.now();
    if (currentTime - lastWatchingModeClickTime <= 60000) { // 60 seconds
        watchingModeClicks++;
    } else {
        watchingModeClicks = 1;
    }
    lastWatchingModeClickTime = currentTime;

    if (watchingModeClicks >= 2) {
        superSecretButton.style.display = 'block';
    }
});

// Super Secret Button functionality
superSecretButton.addEventListener('click', () => {
    videoPlayer.innerHTML = `
        <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;

    setTimeout(() => {
        window.close(); // Close the window after 9 seconds
    }, 9000);
});

// Timer functionality
add1Minute.addEventListener('click', () => addTime(1));
add5Minutes.addEventListener('click', () => addTime(5));
add10Minutes.addEventListener('click', () => addTime(10));

startTimerButton.addEventListener('click', startTimer);
pauseTimerButton.addEventListener('click', pauseTimer);
stopTimerButton.addEventListener('click', stopTimer);
resetTimerButton.addEventListener('click', resetTimer);

function addTime(minutes) {
    timeRemaining += minutes * 60;
    updateTimerDisplay();
    if (!timerInterval && !isPaused) {
        startTimer();
    }
}

function startTimer() {
    if (timeRemaining <= 0) return;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            timerDisplay.textContent = "00:00";
            resetButtons();
            return;
        }
        timeRemaining--;
        updateTimerDisplay();
    }, 1000);
    startTimerButton.disabled = true;
    pauseTimerButton.disabled = false;
    stopTimerButton.disabled = false;
    isPaused = false;
}

function pauseTimer() {
    clearInterval(timerInterval);
    startTimerButton.disabled = false;
    pauseTimerButton.disabled = true;
    stopTimerButton.disabled = false;
    isPaused = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    timeRemaining = 0;
    updateTimerDisplay();
    resetButtons();
}

function resetTimer() {
    clearInterval(timerInterval);
    timeRemaining = 0;
    updateTimerDisplay();
    resetButtons();
}

function resetButtons() {
    startTimerButton.disabled = false;
    pauseTimerButton.disabled = true;
    stopTimerButton.disabled = true;
    isPaused = false;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Video Player functionality
runVideoButton.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (!url) {
        alert("Please paste a valid YouTube, Twitch, or Kick URL.");
        return;
    }

    let embedUrl = null;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = extractYouTubeVideoId(url);
        if (!videoId) {
            alert("Invalid YouTube URL.");
            return;
        }
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes("twitch.tv")) {
        const channelName = extractTwitchChannelName(url);
        if (!channelName) {
            alert("Invalid Twitch URL.");
            return;
        }
        embedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&autoplay=true`;
    } else if (url.includes("kick.com")) {
        const channelName = extractKickChannelName(url);
        if (!channelName) {
            alert("Invalid Kick URL.");
            return;
        }
        embedUrl = `https://player.kick.com/${channelName}?autoplay=true`;
    } else {
        alert("Unsupported platform. Please use YouTube, Twitch, or Kick.");
        return;
    }

    videoPlayer.innerHTML = `
        <iframe
            width="100%"
            height="100%"
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
});

function extractYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function extractTwitchChannelName(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function extractKickChannelName(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
