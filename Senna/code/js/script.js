//====================== VARIABLES ======================//
//----------------- SPRITE  -----------------//

// selects special js class in all sprite elements
const firedSprite = document.querySelectorAll(".firedSprite");


//--------------- TEXT CLOUD ---------------//

// locate text path (cloud)
const fireMessage = document.querySelector(".fireMessage");


// fire  messages / jokes
const arrMessages = [
    "The temperature is rising...",
    "You're on fire!",
    "Is it me, or is it getting hot in here?",
    "Some jokes tend to burn hard",
    "Questions? Fire away"
];



//====================== FUNCTIONS ======================//

// for each sprite part
arrMessages.forEach(
);


// fire-sprite, onclick random message pop up:
firedSprite.addEventListener("click", function firedSprite() {
    // output:
    window.alert("hi");
        // randomizer index arrMessages
        const messageContent = Math.floor(Math.random() * arrMessages.length);
        fireMessage.innerHTML = arrMessages[messageContent];
});


console.log(firedSprite);


