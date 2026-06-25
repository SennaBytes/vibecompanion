//====================== VARIABLES ======================//

//----------------- SPRITE  -----------------//

// selects special js class in all sprite elements
const firedSprite = document.querySelector(".firedSprite");



//--------------- TEXT CLOUD ---------------//

// locate text path (cloud)
const textCloud = document.querySelector(".text-cloud");


// fire  messages / jokes
const messages = [
    "The temperature is rising...",
    "You're on fire!",
    "Is it me, or is it getting hot in here?"
];

// messages content
let messageContent = document.querySelector(".messageContent");




//====================== FUNCTIONS ======================//

// fire-sprite, onclick random message pop up:
firedSprite.addEventListener("click", function firedSprite() {
    // output:
    window.alert("hi");
//    textCloud.innerHTML = messageContent[1];
});



