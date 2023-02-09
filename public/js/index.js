/*========================================================
    Variables Home Page - for when logged in or not
=========================================================*/
let playerName = document.getElementById("playerName");//the span element with the player's name
let homePopupWrapper = document.getElementById("homePopupWrapper");
let backToGame = document.getElementById("backToGame");//button
let logOut = document.getElementById("logOut");//button
let selectProfileWrapper = document.getElementById("selectProfileWrapper");//div to select profile

console.log(playerName.innerHTML, "player Name when page loads");


if(playerName.innerHTML == "Player"){
    selectProfileWrapper.style.display="block";
    homePopupWrapper.style.display="none";
    logOut.style.display="none";
    backToGame.style.display="none"; 
    
}else
{
    selectProfileWrapper.style.display="none";
    homePopupWrapper.style.display="block";
    logOut.style.display="block";
    backToGame.style.display="block";
}

backToGame.addEventListener('click', function() {
    currentUserInput.value= playerName.innerHTML;
 });

/*===============================================
        Creating profiles
===============================================*/
let playersWrapper = document.getElementById("playersWrapper");//the main div that wraps the profiles
let profileNames = document.getElementsByClassName("profileNames");//the player profiles
let createBtn = document.getElementById("createBtn");//button to create the player
let incorrectPswd = document.getElementById("incorrectPswd");
let createPlayerWrapper = document.getElementById("createPlayerWrapper");
let doneCreate = document.getElementById("doneCreate");
let cancelCreate = document.getElementById("cancelCreate");
let selectProfileBody = document.getElementById("selectProfileBody");
let warningTxt = document.getElementById("warningTxt");
let confirmPswd = document.getElementById("confirmPswd");
let createdPswd = document.getElementById("createdPswd");
let nameTaken = document.getElementById("nameTaken");
let spacesTxt = document.getElementById("spacesTxt");
let enterPswdTxt = document.getElementById("enterPswdTxt");
let newPlayer = document.getElementById("newPlayer");
let creationError_Name = false;
let creationError_Pswd = false;
let creationError_Spaces = false;
let creationError_PswdLength = false;

//the array to hold the created users
let users = [];
console.log(users, "users before creation");


createBtn.addEventListener('click' , function () {
    selectProfileWrapper.style.display="none";
    createPlayerWrapper.style.display="block";
    newPlayer.focus();
})//end createBtn.addEventListener

document.addEventListener('keydown', function() {
    warningTxt.style.opacity = '0';
    incorrectPswd.style.opacity = '0';
    nameTaken.style.opacity = '0';
    enterPswdTxt.style.opacity = '0';
});


//When clicking the "Done" button,new users must create pswd that 
//matches confirmation, and can't use same user name as someone else
doneCreate.addEventListener('click' , function (e) {
    
    confirmPswd.value.trim();
    createdPswd.value.trim();
    let symbols = confirmPswd.value.match(/[!@#$%^&*()_+-={}:;"'? /><,.`~|]/g);
   
    if(symbols){
        spacesTxt.style.opacity= "1";
        creationError_Spaces = "true";
    }else
    {
        spacesTxt.style.opacity= "0";
        creationError_Spaces = "false";
        }//end else

    //Checks whether or not passwords are same
    if(confirmPswd.value != createdPswd.value){
        warningTxt.style.opacity = "1";
        creationError_Name = "true";
    }else
    if(confirmPswd.value == createdPswd.value){
        warningTxt.style.opacity = "0";
        creationError_Name = "false";
    }

    //Checks whether or not a password has been entered
    if(createdPswd.value.length == 0){
        console.log('Please enter a password!');
        enterPswdTxt.style.opacity = '1';
        creationError_PswdLength = "true";
    }else
    if(createdPswd.value.length > 0){
        enterPswdTxt.style.opacity = '0';
        creationError_PswdLength = "false";
    }
   

    //Checks whether or not user name is taken
    for(let i = 0; i < users.length; i++){
        if(newPlayer.value == users[i].name){//if user names same
            nameTaken.style.opacity = "1";
            creationError_Pswd = "true";
        }else
        if(newPlayer.value != users[i].name){//if user names not same
            nameTaken.style.opacity = "0";
            creationError_Pswd = "false";
        }
    }//end for loop 

    //If the error msgs appear, do not submit. Otherwise submit
    if(creationError_Pswd == "true" || creationError_Name == "true" || creationError_Spaces == "true" || creationError_PswdLength == "true"){
        e.preventDefault();
    }else
    if(creationError_Pswd == "false" || creationError_Name == "false" || creationError_Spaces == "false" || creationError_PswdLength == "false"){
       profileNamesClick ();
       selectProfileWrapper.style.display="block";
       createPlayerWrapper.style.display="none";
       playersWrapper.style.display="none";
       
    }//end if else false
})//end doneCreate.addEventListener

let  hiddenPswds = document.getElementsByClassName("hiddenPswds");

for(let i = 0; i < profileNames.length; i++){
    users.push({"name":profileNames[i].innerHTML.trim(), "pswd":hiddenPswds[i].innerHTML.trim() });
}

cancelCreate.addEventListener('click' , function () {
    selectProfileWrapper.style.display="block";
    createPlayerWrapper.style.display="none";
    newPlayer.value="";
});


/*===============================================
        Selecting profiles
===============================================*/
let profileSelected = 'Player';//the name that has been selected
let selectBtn = document.getElementById("selectBtn");//button to select the player
let enterPswdWrapper = document.getElementById("enterPswdWrapper");
let yourName = document.getElementById("yourName");
let pswdStat;
let stat = document.getElementById("stat");
let selectPlayerPlzWrapper = document.getElementById("selectPlayerPlzWrapper");
let deleteSelected = [];


function profileNamesClick () {
    for(let i = 0; i < profileNames.length ; i++){

    profileNames[i].addEventListener('click' , function () {
        profileSelected = this.innerHTML.trim();
        console.log(profileSelected, "this is the profile selected");

        deleteSelected[0]= this;
    })//end profileNames[i].addEventListener
 }//end for loop profileNames.length   
}
profileNamesClick ();

selectBtn.addEventListener('click' , function () {
    if(profileSelected == 'Player'){
        selectProfileWrapper.style.display="none";
        selectPlayerPlzWrapper.style.display="block";
    }else 
    {
        enterPswdWrapper.style.display = "block";
        selectProfileWrapper.style.display="none";
        pswdStat = "play";

        //sent to the pswd popup
        yourName.innerHTML = profileSelected;
        stat.value = "play";
    }
})//end selectBtn.addEventListener


/*===============================================
        Password confirmation
===============================================*/
let pswdEntered = document.getElementById("pswdEntered");
let pswdConfirmBtn = document.getElementById("pswdConfirmBtn");
let pswdCancelBtn = document.getElementById("pswdCancelBtn");
let yourNamePost = document.getElementById("yourNamePost");//hidden input field to post name to server
let pswdSubmit = "false";


console.log(users, "       --> this is the users array manipulated from server-side"); 

pswdConfirmBtn.addEventListener('click', function(e){

    for(let i = 0; i <users.length; i++){
        if(users[i].name.trim() == profileSelected.trim()){
            if(users[i].pswd.trim() == pswdEntered.value.trim()){//if correct password
              
                pswdSubmit = "true";
                console.log(pswdStat, "this is the password status");
                incorrectPswd.style.opacity = "0";

                if(pswdStat == "delete"){
                   selectProfileWrapper.style.display = "block";
                   enterPswdWrapper.style.display = "none";
                   deleteSelected[0].parentNode.removeChild(deleteSelected[0]);
            
                    //what gets posted along with password entered
                   yourNamePost.value = profileSelected;
                   stat.value = "delete";
                }//end if delete
                else
                if(pswdStat == "play"){
                   playerName.innerHTML= profileSelected;
                   yourNamePost.value = profileSelected;
                   stat.value = "play";
                }

            }else//end if correct password
            if(users[i].pswd != pswdEntered.value){//if not the correct password
                incorrectPswd.style.opacity = "1";
                pswdSubmit = "false";
            }//end else if passwords are or are not equal
            console.log(pswdSubmit, "this is the pswdSubmit status");
            
        }//end profile selected in users array
    }//end for loop users.length

    if(pswdSubmit == "false"){
        e.preventDefault();//don't submit form
       }
});//end pasword confirm


pswdCancelBtn.addEventListener('click', function () {
    selectProfileWrapper.style.display = "block";
    enterPswdWrapper.style.display = "none";
    profileSelected = "player";
    pswdEntered.value = "";//clear password
})

/*===============================================
        Deleting profiles
===============================================*/
let deletetBtn = document.getElementById("deleteBtn");//button to delete the player
let deletePlayerWrapper = document.getElementById("deletePlayerWrapper");
let deleteName = document.getElementById("deleteName");//the span for the name to be deleted
let noDelete = document.getElementById("noDelete");//button that says no to deleting profile
let yesDelete = document.getElementById("yesDelete");//button that says yes to deleting profile

deletetBtn.addEventListener('click' , function () {
    if(profileSelected == 'Player'){
        selectProfileWrapper.style.display="none";
        selectPlayerPlzWrapper.style.display="block";
    }else
    {
        deletePlayerWrapper.style.display="block";
        selectProfileWrapper.style.display="none";
        deleteName.innerHTML = profileSelected;
    }
 })//end deleteBtn.addEventListener

noDelete.addEventListener('click' , function () {
    deletePlayerWrapper.style.display="none";
    selectProfileWrapper.style.display="block";
    pswdStat = "";
})//end noDelete.addEventListener

yesDelete.addEventListener('click' , function () {
    deletePlayerWrapper.style.display="none";
    enterPswdWrapper.style.display = "block";
    pswdStat = "delete";
    yourName.innerHTML = profileSelected;
    
})//end yesDelete.addEventListener


/*===============================================
       okBtn when asked to please select player
===============================================*/
let okBtn = document.getElementById('okBtn');//ok button when asked to select a player to play

okBtn.addEventListener('click' , function () {
    selectProfileWrapper.style.display="block";
    selectPlayerPlzWrapper.style.display="none";
    profileSelected = 'Player';
})//end okBtn.addEventListener


