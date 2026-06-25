//====================== VARIABLES ======================//

const firedSprite = document.querySelectorAll(".firedSprite");

const fireMessage = document.querySelector(".fire-message");

const arrMessages = [
    "The temperature is rising...",
    "You're on fire!",
    "Is it me, or is it getting hot in here?",
    "Some jokes tend to burn hard",
    "Questions? Fire away"
];


//====================== FUNCTIONS ======================//

// fire-sprite + text-cloud, onclick random message pop up:
firedSprite.forEach(function(sprite) {
    sprite.addEventListener("click", function firedSprite() {
        const messageContent = Math.floor(Math.random() * arrMessages.length);
        fireMessage.innerHTML = arrMessages[messageContent];

    });
});