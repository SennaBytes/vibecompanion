//====================== VARIABLES ======================//

// sprite
const firedSprite = document.querySelectorAll(".firedSprite");

const kawaiiClick = document.querySelectorAll(".kawaii-click");

// messages
const fireMessage = document.querySelector(".fire-message");

const arrMessages = [
  "The temperature is rising... before, it was my stress.",
  "You're on fire! Please stop, this is a rental.",
  "Is it hot in here or am I just glad to see you?",
  "Some jokes tend to burn hard... like my last attempt at cooking.",
  "Questions? Fire away. I probably won't extinguish them.",
  
  "I told a fire joke once. It sparked a reaction.",
  "I tried to start a fire pun war, but it fizzled out.",
  "What do you call a fire that tells jokes? A pun-ignite.",
  "Why did the fire break up with oxygen? It needed space.",
  "I'm great at fire jokes… they're lit.",
  
  "That joke was so bad it should be put out immediately.",
  "Fire sprites don't do drama… unless it's heated.",
  "I'm not saying it's hot, but even my code is sweating.",
  "Water and I... it was trickling, until it went up in smoke.",
  "Stop, drop, and roll… because that joke was too good.",
  
  "I came here to burn calories, but this is ridiculous.",
  "My humor is like fire: occasionally useful, mostly dangerous.",
  "I asked for warmth, not emotional damage.",
  "If this gets any hotter, I'm calling a wizard.",
  "You can't handle the heat? Good, neither can my CPU.",
  
  "That pun was so hot it needs a fire extinguisher and therapy.",
  "Fire sprites don't lie… we just exaggerate with smoke.",
  "I tried to be cool, but I spontaneously combusted.",
  "Warning: excessive clicking may cause emotional ignition.",
  "We pull up with the smoke."
];


//====================== FUNCTIONS ======================//

// fire-sprite + text-cloud == onclick random message pop up:
firedSprite.forEach(function(sprite) {
    sprite.addEventListener("click", function firedSprite() {
        setTimeout(() => {
         const messageContent = Math.floor(Math.random() * arrMessages.length);
            fireMessage.innerHTML = arrMessages[messageContent];
        }, 1000);
    });
});


// fire-sprite == onclick cute sound:
kawaiiClick.forEach((kawaii) => {
  kawaii.addEventListener("click", () => {
    new Audio("./assets/audio/sprite/kawaii-audio.mp3").play();
  });
});