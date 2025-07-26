// Update the start time display
function updateStartTime() {
    const startTimeSpan = document.getElementById('startTimeSpan');
    if (startTimeSpan) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        startTimeSpan.textContent = timeString;
    }
}

// Update start time every second
setInterval(updateStartTime, 1000);

// Initial update
updateStartTime();