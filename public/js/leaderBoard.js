/*===========================================
        Global variables
============================================*/
let logOut = document.getElementById("logOut");//button
let logIn = document.getElementById("logIn");//button
let backToGame = document.getElementById("backToGame");//button
let choose = document.getElementById("choose");//select tag for filtering scores
let filterNowBtn = document.getElementById("filterNowBtn");//submit button to filter scores
let playerName = document.getElementById("playerName");//the span element with the player's name  

let currentUserInput = document.getElementById("currentUserInput");//hiddden input tag of curent user
let filterDefault = document.getElementById("filterDefault");//hidden span of the filter results

console.log(playerName.innerHTML, "player Name when page loads");

/*====================================================
    what displays whether player is logged in or not
=====================================================*/

if(playerName.innerHTML == "Player"){
    logOut.style.display="none";
    logIn.style.display="block";
    backToGame.style.display="none";
    console.log(playerName.innerHTML, "player Name when logged out");
}else{
    logOut.style.display="block";
    logIn.style.display="none";
    backToGame.style.display="block";
    console.log(playerName.innerHTML, "player Name when logged in");
}


/*====================================================
    current user when clicking back to game 
=====================================================*/
 backToGame.addEventListener('click', function() {
    currentUserInput.value= playerName.innerHTML;
 });


 /*====================================================
     default value of last selected
=====================================================*/
for(let i = 0; i < choose.length; i++){
   if(filterDefault.innerHTML.trim() == choose.options[i].value.trim()){
        choose.options[i].selected='selected';
   }
 }//end for loop choose.length

  
