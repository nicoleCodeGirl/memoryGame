/*===============================================
       NicoleCodeGirl Memory Game - Index Page
===============================================*/

document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page loaded');
    
    const playerNameInput = document.getElementById('playerNameInput');
    const startGameBtn = document.getElementById('startGameBtn');
    const nameRequired = document.getElementById('nameRequired');
    
    // Focus on the name input when page loads
    if (playerNameInput) {
        playerNameInput.focus();
    }
    
    // Handle Enter key in name input
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                startGame();
            }
        });
    }
    
    // Handle Start Game button click
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startGame();
        });
    }
    
    // Function to start the game
    function startGame() {
        const playerName = playerNameInput.value.trim();
        
        if (!playerName) {
            // Show error message
            if (nameRequired) {
                nameRequired.style.opacity = '1';
                nameRequired.style.color = '#00ff00';
            }
            playerNameInput.focus();
            return;
        }
        
        // Hide error message if it was showing
        if (nameRequired) {
            nameRequired.style.opacity = '0';
        }
        
        // Submit the form
        const form = document.getElementById('enterNameForm');
        if (form) {
            form.submit();
        }
    }
    
    // Hide error message when user starts typing
    if (playerNameInput) {
        playerNameInput.addEventListener('input', function() {
            if (nameRequired && nameRequired.style.opacity === '1') {
                nameRequired.style.opacity = '0';
            }
        });
    }
});


