/*===============================================
       Memory Game images - Dynamic Loading
===============================================*/
let imgSrc = [];
let card = document.getElementsByClassName('card');
let randomImgs=[];
let startTimeSpan = document.getElementById("startTimeSpan");//the time shown to the user when clicking the first card
let cardCount;
let matchCount;

// Function to load photos dynamically from server
async function loadPhotos() {
    try {
        const response = await fetch('/api/photos');
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Photo loading error:', errorData);
            
            if (response.status === 404) {
                showError('No game cards found. Please add images to the gameCards folder.');
            } else {
                showError(`Failed to load photos: ${errorData.message || 'Unknown error'}`);
            }
            
            // Use fallback images
            useFallbackImages();
            return;
        }
        
        const photos = await response.json();
        
        if (!photos || photos.length === 0) {
            console.warn('No photos returned from API');
            showError('No game cards available. Using fallback images.');
            useFallbackImages();
            return;
        }
        
        // Convert photos to the format expected by the game
        imgSrc = photos.map(photo => photo.path);
        console.log(`Loaded ${imgSrc.length} photos successfully`);
        
        // Initialize the game with the loaded photos
        initializeGame();
        
    } catch (error) {
        console.error('Error loading photos:', error);
        showError('Failed to load game cards. Using fallback images.');
        useFallbackImages();
    }
}

function showError(message) {
    console.error('Game Error:', message);
    
    // Create a more user-friendly error display
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff69b4, #00ff00);
        color: #111;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #8a2be2;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        text-align: center;
        font-weight: bold;
    `;
    errorDiv.innerHTML = `
        <h3>⚠️ Game Notice</h3>
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(135deg, #00ff00, #ff69b4);
            color: #111;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
        ">OK</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 10000);
}

function useFallbackImages() {
    console.log('Using fallback images...');
    
    // Create a simple set of fallback images using CSS gradients
    imgSrc = [];
    const fallbackColors = [
        'linear-gradient(45deg, #ff69b4, #00ff00)',
        'linear-gradient(45deg, #00ff00, #8a2be2)',
        'linear-gradient(45deg, #8a2be2, #ff69b4)',
        'linear-gradient(45deg, #ff69b4, #0000ff)',
        'linear-gradient(45deg, #0000ff, #00ff00)',
        'linear-gradient(45deg, #00ff00, #ff69b4)',
        'linear-gradient(45deg, #8a2be2, #00ff00)',
        'linear-gradient(45deg, #ff69b4, #8a2be2)',
        'linear-gradient(45deg, #00ff00, #0000ff)',
        'linear-gradient(45deg, #0000ff, #8a2be2)'
    ];
    
    // Create pairs of fallback images
    fallbackColors.forEach((color, index) => {
        imgSrc.push(`fallback-${index}`);
        imgSrc.push(`fallback-${index}`);
    });
    
    console.log(`Created ${imgSrc.length} fallback cards`);
    initializeGame();
}

function createCard(imgSrc, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card_front';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card_back';
    
    // Handle fallback images vs real images
    if (imgSrc.startsWith('fallback-')) {
        const fallbackIndex = parseInt(imgSrc.split('-')[1]);
        const fallbackColors = [
            'linear-gradient(45deg, #ff69b4, #00ff00)',
            'linear-gradient(45deg, #00ff00, #8a2be2)',
            'linear-gradient(45deg, #8a2be2, #ff69b4)',
            'linear-gradient(45deg, #ff69b4, #0000ff)',
            'linear-gradient(45deg, #0000ff, #00ff00)',
            'linear-gradient(45deg, #00ff00, #ff69b4)',
            'linear-gradient(45deg, #8a2be2, #00ff00)',
            'linear-gradient(45deg, #ff69b4, #8a2be2)',
            'linear-gradient(45deg, #00ff00, #0000ff)',
            'linear-gradient(45deg, #0000ff, #8a2be2)'
        ];
        
        cardFront.style.background = fallbackColors[fallbackIndex] || fallbackColors[0];
        cardFront.innerHTML = `<span style="color: #111; font-weight: bold; font-size: 24px;">🎴</span>`;
    } else {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Card ${index + 1}`;
        
        // Add error handling for image loading
        img.onerror = function() {
            console.error(`Failed to load image: ${imgSrc}`);
            this.style.display = 'none';
            this.parentElement.style.background = 'linear-gradient(45deg, #ff69b4, #00ff00)';
            this.parentElement.innerHTML = '<span style="color: #111; font-weight: bold;">❌</span>';
        };
        
        img.onload = function() {
            console.log(`Successfully loaded image: ${imgSrc}`);
        };
        
        cardFront.appendChild(img);
    }
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    return card;
}

/*===============================================
       Randomizing cards
===============================================*/

function randomizeCards() {
    console.log('Randomizing cards...');
    console.log('Available photos:', imgSrc.length);
    console.log('Card elements:', card.length);
    
    // Reset game state
    cardCount = 0;
    matchCount = 0;
    startTimeSpan.innerHTML = "";
    randomImgs = [];
    
    // Create a copy of the original photos array to avoid modifying it
    let availablePhotos = [...imgSrc];
    
    // Create pairs of images for matching
    let pairedPhotos = [];
    availablePhotos.forEach(photo => {
        pairedPhotos.push(photo); // First instance
        pairedPhotos.push(photo); // Second instance for matching
    });
    
    // Shuffle the paired photos
    for (let i = pairedPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairedPhotos[i], pairedPhotos[j]] = [pairedPhotos[j], pairedPhotos[i]];
    }
    
    for(let i = 0; i < card.length; i++){
        try {
            const cardImg = card[i].querySelector('.cardImg');
            const cardBack = card[i].querySelector('.card_back');
            
            if (!cardImg || !cardBack) {
                console.error(`Card ${i} missing required elements`);
                continue;
            }
            
            // Reset card state
            cardImg.style.display = "none"; // hide the front
            cardBack.style.display = "block"; // show the back
            
            if(pairedPhotos.length > 0){
                // Get a random photo for this card
                let randomIndex = Math.floor(Math.random() * pairedPhotos.length);
                let selectedPhoto = pairedPhotos.splice(randomIndex, 1)[0];
                randomImgs.push(selectedPhoto);
                
                // Handle fallback images vs real images
                if (selectedPhoto.startsWith('fallback-')) {
                    const fallbackIndex = parseInt(selectedPhoto.split('-')[1]);
                    const fallbackColors = [
                        'linear-gradient(45deg, #ff69b4, #00ff00)',
                        'linear-gradient(45deg, #00ff00, #8a2be2)',
                        'linear-gradient(45deg, #8a2be2, #ff69b4)',
                        'linear-gradient(45deg, #ff69b4, #0000ff)',
                        'linear-gradient(45deg, #0000ff, #00ff00)',
                        'linear-gradient(45deg, #00ff00, #ff69b4)',
                        'linear-gradient(45deg, #8a2be2, #00ff00)',
                        'linear-gradient(45deg, #ff69b4, #8a2be2)',
                        'linear-gradient(45deg, #00ff00, #0000ff)',
                        'linear-gradient(45deg, #0000ff, #8a2be2)'
                    ];
                    
                    cardImg.style.background = fallbackColors[fallbackIndex] || fallbackColors[0];
                    cardImg.innerHTML = `<span style="color: #111; font-weight: bold; font-size: 24px;">🎴</span>`;
                    cardImg.setAttribute("src", selectedPhoto); // Store the fallback ID
                } else {
                    // Clear any previous styling
                    cardImg.style.background = '';
                    cardImg.innerHTML = '';
                    
                    // Set the image source
                    cardImg.setAttribute("src", selectedPhoto);
                    
                    // Add error handling for image loading
                    cardImg.onerror = function() {
                        console.error(`Failed to load image: ${selectedPhoto}`);
                        this.style.display = 'none';
                        this.parentElement.style.background = 'linear-gradient(45deg, #ff69b4, #00ff00)';
                        this.parentElement.innerHTML = '<span style="color: #111; font-weight: bold;">❌</span>';
                    };
                    
                    cardImg.onload = function() {
                        console.log(`Successfully loaded image: ${selectedPhoto}`);
                    };
                }
            } else {
                console.warn(`No more photos available for card ${i}`);
            }
        } catch (error) {
            console.error(`Error setting up card ${i}:`, error);
        }
    }
    
    console.log(`Game randomized with ${randomImgs.length} cards`);
}//end function randomizeCards

// Initialize the game by loading photos first
function initializeGame() {
    console.log('Initializing game...');
    console.log('Card elements found:', card.length);
    
    if (card.length === 0) {
        console.log('No card elements found, retrying in 500ms...');
        setTimeout(initializeGame, 500);
        return;
    }
    
    loadPhotos();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeGame();
});


/*===============================================
       Playing the game
===============================================*/
let card_back;
let card_front;
let cardChoice=[];
let postScorePopUp = document.getElementById("postScorePopUp");
let time_start = document.getElementById("time_start");
let time_end = document.getElementById("time_end");
let total_time = document.getElementById("total_time");
let date_played = document.getElementById("date_played");
let timeSpan = document.getElementById("timeSpan");//the time completed shown to user
let hideGame = document.getElementById("hideGame");//when pop up to post scores appear game will be hidden
let player_name = document.getElementById("player_name");//input for player name each time a new game is played
let goToLeaderBoard = document.getElementById('goToLeaderBoard');//button that takes you to the leaderbgoard
let timeStart;



for(let i = 0; i < card.length; i++){
    card[i].addEventListener('click' , function () {
        cardCount++;

        console.log(cardCount , "this is the card count when clicking cards");
        if(cardCount == 1){
            timeStart = new Date();
            time_start.value = timeStart.toLocaleTimeString();//example: 10:00:16 AM
            startTimeSpan.innerHTML = timeStart.toLocaleTimeString();
            player_name.value= playerName.innerHTML;
        }//end if cardCount 

        card_back = this.lastChild;
        card_front = this.firstChild;
        card_front.style.display = 'block';//the card
        card_back.style.display = 'none';//the back of card 
        cardChoice.push(card_front);

        if(cardChoice.length == 2){
            if(cardChoice[0].getAttribute("src") == cardChoice[1].getAttribute("src")){//if cards match
                matchCount++;
                console.log(matchCount, "this is the match counter");

                document.getElementById("matchFound").style.display = 'block';
                cardChoice=[];
              
                document.getElementById("matchFound").animate([  
                    { opacity: 0, transform: 'translateY(-10px) scale(1)', },
                    { opacity: 0.25, transform: 'translateY(-20px) scale(1.25)'},
                    { opacity: 0.75, transform: 'translateY(-30px) scale(1.75)'},
                    { opacity: 1, transform: 'translateY(-40px) scale(2)'},
                    { opacity: 0.75, transform: 'translateY(-50px) scale(1.75)'},
                    { opacity: 0.25, transform: 'translateY(-60px) scale(1.25)'},
                    { opacity: 0, transform: 'translateY(-70px) scale(1)'} ], 1000);

                function matchDisplayNone () {
                  document.getElementById("matchFound").style.display = 'none';  
                }

                setTimeout(matchDisplayNone, 1000);

                //for presentation purposes you can set the matchCount to 2 to quickly show off abilities
                //Justr don't forget to set it back to 20 nwhen done
                if(matchCount == 20){
                    let timeEnd = new Date();
                    time_end.value=timeEnd.toLocaleTimeString();// example: 10:00:35 AM
                    console.log(time_end.value, "the time ended with 2 matches");
                    
                    let difference = timeEnd.getTime() - timeStart.getTime();
                    let totalTime = Math.floor(difference/1000);
                    total_time.value = totalTime;
                    date_played.value = timeEnd.toLocaleDateString();//example: 11/25/2019
                    timeSpan.innerHTML = totalTime + " seconds";

                    setTimeout(function () {
                      hideGame.style.display="none";
                      postScorePopUp.style.display="block"; 
                      goToLeaderBoard.style.display="none";
                      logOut.style.display="none";

                    }, 900);

                }//end if matchCount 
              
            }else
            if(cardChoice[0].getAttribute("src") != cardChoice[1].getAttribute("src")){//if cards don't match
                document.getElementById("noMatch").style.display = 'block';

                 document.getElementById("noMatch").animate([  
                    { opacity: 0, transform: 'translateY(-10px) scale(1)', },
                    { opacity: 0.25, transform: 'translateY(-20px) scale(1.25)'},
                    { opacity: 0.75, transform: 'translateY(-30px) scale(1.75)'},
                    { opacity: 1, transform: 'translateY(-40px) scale(2)'},
                    { opacity: 0.75, transform: 'translateY(-50px) scale(1.75)'},
                    { opacity: 0.25, transform: 'translateY(-60px) scale(1.25)'},
                    { opacity: 0, transform: 'translateY(-70px) scale(1)'} ], 1000);

                    let unMatchedCards=[]
                    unMatchedCards.push(cardChoice[0]);
                    unMatchedCards.push(cardChoice[1]);
                    cardChoice = [];
                   
                function noMatch () {
                    unMatchedCards[0].style.display = 'none';
                    unMatchedCards[1].style.display = 'none';
                    unMatchedCards[0].parentNode.lastChild.style.display = 'block';
                    unMatchedCards[1].parentNode.lastChild.style.display = 'block';
                    unMatchedCards=[];
                }//end function noMatch
                
                function noMatchDisplayNone () {
                    document.getElementById("noMatch").style.display = 'none';  
                  }
                setTimeout(noMatch, 900);
                setTimeout(noMatchDisplayNone, 1200);

            }//end if(cardChoice[0].getAttribute("src") != cardChoice[1].getAttribute("src"))
        }//end if(cardChoice.length == 2)
    })//end clicking on card
};//end for loop card length for clicking card

/*===============================================
            Don't post score
===============================================*/
let noPost = document.getElementById("noPost");

noPost.addEventListener('click', function () {
    hideGame.style.display="block";//game appears
    postScorePopUp.style.display="none";//popup disappears
    randomizeCards();
    //header buttons reappear
    goToLeaderBoard.style.display="block";
    logOut.style.display="block";

});


/*===============================================
            Post score
===============================================*/
let yesPost = document.getElementById("yesPost");

yesPost.addEventListener('click', function () {
    hideGame.style.display="block";//game appears
    postScorePopUp.style.display="none"; //popup disappears
    randomizeCards();
    //header buttons reappear so they are available for next game
    goToLeaderBoard.style.display="block";
    logOut.style.display="block";
});

/*=================================================
    PopUP when clicking  goToLeaderBoard button
==================================================*/
goToLeaderBoard.addEventListener('click', function (e) {
    if(matchCount < 20){
        e.preventDefault();
        hideGame.style.display="none";
        leavePagePopUp.style.display="block"; 
        goToLeaderBoard.style.display="none";
        logOut.style.display="none";
    }
});

let leavePage = document.getElementById('leavePage');

leavePage.addEventListener('click', function() {
    window.location = "http://localhost:3000/leaderBoard";
});

let stayOnPage = document.getElementById('stayOnPage');

stayOnPage.addEventListener('click', function() {
    hideGame.style.display="block";
    leavePagePopUp.style.display="none"; 
    goToLeaderBoard.style.display="block";
    logOut.style.display="block";
});

/*===============================================
       Button to play a new game
===============================================*/
let newGameBtn = document.getElementById("newGameBtn");
let NewGameH1 = document.getElementById("NewGameH1");

 newGameBtn.addEventListener('click', function(e) {
     e.preventDefault();
     let NewGameH1 = document.getElementById("NewGameH1");
     NewGameH1.style.display = 'block';
     NewGameH1.animate([  
        { opacity: 0, transform: 'translateY(-10px) scale(1)', },
        { opacity: 0.25, transform: 'translateY(-20px) scale(1.25)'},
        { opacity: 0.75, transform: 'translateY(-30px) scale(1.75)'},
        { opacity: 1, transform: 'translateY(-40px) scale(2)'},
        { opacity: 0.75, transform: 'translateY(-50px) scale(1.75)'},
        { opacity: 0.25, transform: 'translateY(-60px) scale(1.25)'},
        { opacity: 0, transform: 'translateY(-70px) scale(1)'} ], 1000);

    // Simply randomize the cards with the original photo set
    randomizeCards();
    
    function H1displayNone (){
      NewGameH1.style.display = 'none';  
    }
    setTimeout(H1displayNone, 1000);
});//end newGameBtn click


    
