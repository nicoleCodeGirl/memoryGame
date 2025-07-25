/*===========================================
        Global variables
============================================*/
let backToGame = document.getElementById("backToGame");//button
let choose = document.getElementById("choose");//select tag for filtering scores
let filterNowBtn = document.getElementById("filterNowBtn");//submit button to filter scores
let playerName = document.getElementById("playerName");//the span element with the player's name  
let filterDefault = document.getElementById("filterDefault");//hidden span of the filter results

console.log(playerName.innerHTML, "player Name when page loads");

/*====================================================
    what displays based on whether player has a name
=====================================================*/

if(playerName.innerHTML == "Player"){
    backToGame.style.display="none";
    console.log(playerName.innerHTML, "player Name when no name entered");
}else{
    backToGame.style.display="block";
    console.log(playerName.innerHTML, "player Name when name entered");
}

/*====================================================
     default value of last selected
=====================================================*/
for(let i = 0; i < choose.length; i++){
   if(filterDefault.innerHTML.trim() == choose.options[i].value.trim()){
        choose.options[i].selected='selected';
   }
 }//end for loop choose.length

  
