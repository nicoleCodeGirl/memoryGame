/*=========================================
Function to update clock in the header
==========================================*/
setInterval(function () {
let theDate2 = new Date();
let todaysDate2 = theDate2.toDateString();
let todaysTime2 = theDate2.toLocaleTimeString();
let headerDate = document.getElementById("headerDate");
headerDate.innerHTML = todaysDate2 + " " + todaysTime2;

},100);