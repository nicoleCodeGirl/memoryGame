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
        console.log('Loading photos from API...');
        
        const response = await fetch('/api/photos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const photos = await response.json();
        
        if (photos.error) {
            console.error('Failed to load photos:', photos.error);
            console.log('Attempting to use fallback images...');
            useFallbackImages();
            return;
        }
        
        if (photos.length === 0) {
            console.log('No photos found in API, using fallback images...');
            useFallbackImages();
            return;
        }
        
        // Create array of photo paths, duplicated for pairs
        imgSrc = [];
        photos.forEach(photo => {
            imgSrc.push(photo.path); // First instance
            imgSrc.push(photo.path); // Second instance for matching
        });
        
        console.log(`Loaded ${photos.length} unique photos, ${imgSrc.length} total cards`);
        
        // Initialize the game after photos are loaded
        randomizeCards();
    } catch (error) {
        console.error('Error loading photos:', error);
        console.log('Attempting to use fallback images...');
        useFallbackImages();
    }
}

function showError(message) {
    const gameWrapper = document.getElementById('gameWrapper');
    if (gameWrapper) {
        gameWrapper.innerHTML = `<div style="text-align: center; padding: 20px; color: #ff69b4; font-size: 16px;">${message}</div>`;
    }
    console.error('Game Error:', message);
}

// Fallback function to use default images if API fails
function useFallbackImages() {
    console.log('Using fallback images');
    const defaultImages = [
        '/photos/gameCards/img1.jpeg',
        '/photos/gameCards/img2.jpg',
        '/photos/gameCards/img3.jpeg',
        '/photos/gameCards/img4.jpg',
        '/photos/gameCards/img5.jpeg',
        '/photos/gameCards/img6.jpeg',
        '/photos/gameCards/img7.jpeg',
        '/photos/gameCards/img8.jpg',
        '/photos/gameCards/img9.jpeg',
        '/photos/gameCards/img10.jpeg'
    ];
    
    imgSrc = [];
    defaultImages.forEach(img => {
        imgSrc.push(img); // First instance
        imgSrc.push(img); // Second instance for matching
    });
    
    randomizeCards();
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
    
    for(let i = 0; i < card.length; i++){
        if (card[i].firstChild && card[i].lastChild) {
            card[i].firstChild.style.display = "none"; // all the front of cards don't display
            card[i].lastChild.style.display = "block"; // all the backs of the cards display
            
            if(availablePhotos.length > 0){
                // Get a random index from the remaining photos
                let randomIndex = Math.floor(Math.random() * availablePhotos.length);
                let selectedPhoto = availablePhotos.splice(randomIndex, 1)[0];
                randomImgs.push(selectedPhoto);
                card[i].firstChild.setAttribute("src", selectedPhoto); // set card attribute to that image
            }
        } else {
            console.error(`Card ${i} missing child elements`);
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


    
