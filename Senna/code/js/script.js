//====================== VARIABLES ======================//

//----------------- SPRITE  -----------------//

// individual movable parts fire-sprite(-arms L+R):
const fireSpriteBody = document.querySelector(".fire-sprite");
const fireSpriteArmL = document.querySelector(".fire-sprite-arm-left");
const fireSpriteArmR = document.querySelector(".fire-sprite-arm-right");

//------------- complete sprite -------------//
const fireSprite = fireSpriteBody + fireSpriteArmL + fireSpriteArmR;



//--------------- TEXT CLOUD ---------------//
// locate text path (cloud)
const textCloud = document.querySelector(".text-cloud");


// messages / jokes
const messages = [
    "The temperature is rising...",
    "You're on fire!",
    "Is it me, or is it getting hot in here?"
];

// messages content
let messageContent = document.querySelector("");



//====================== FUNCTIONS ======================//

// fire-sprite, onclick random message pop up:
fireSprite.addEventListener("click", function firedSprite() {
    // joke output:
   textCloud.innerHTML = messageContent;
});



