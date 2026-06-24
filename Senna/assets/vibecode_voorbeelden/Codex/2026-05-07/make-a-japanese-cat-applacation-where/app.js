const STORAGE_KEY = "neko-task-companion";

const tasks = [
  {
    title: "Three slow breaths",
    text: "Breathe in gently, breathe out slowly, and let your shoulders drop three times.",
  },
  {
    title: "Sip of water",
    text: "Take a small drink of water, then give your cat water too.",
  },
  {
    title: "Unclench",
    text: "Relax your jaw, loosen your hands, and rest your eyes for ten seconds.",
  },
  {
    title: "Quiet sentence",
    text: "Write one gentle sentence for yourself, even if it is just: I can go slowly.",
  },
  {
    title: "Clear one corner",
    text: "Move one small thing out of your way so your space feels easier to be in.",
  },
  {
    title: "Fresh air pause",
    text: "Open a window or step outside for a short breath of fresh air.",
  },
  {
    title: "Let one thought land",
    text: "Write down one thought that has been circling in your head, then leave it there.",
  },
];

const defaultState = {
  catName: "",
  food: 70,
  water: 70,
  mood: "neutral",
  loginDates: [],
  lastSeenDate: "",
  taskDate: "",
  taskStatus: "waiting",
  lastMessage: "Welcome back. Take one slow breath with your cat.",
};

const elements = {
  catNameTitle: document.querySelector("#catNameTitle"),
  editNameButton: document.querySelector("#editNameButton"),
  catPortrait: document.querySelector("#catPortrait"),
  moodBubble: document.querySelector("#moodBubble"),
  nameForm: document.querySelector("#nameForm"),
  catNameInput: document.querySelector("#catNameInput"),
  loginDays: document.querySelector("#loginDays"),
  loginStreak: document.querySelector("#loginStreak"),
  foodLevel: document.querySelector("#foodLevel"),
  waterLevel: document.querySelector("#waterLevel"),
  foodMeter: document.querySelector("#foodMeter"),
  waterMeter: document.querySelector("#waterMeter"),
  taskTitle: document.querySelector("#taskTitle"),
  taskText: document.querySelector("#taskText"),
  taskStatus: document.querySelector("#taskStatus"),
  completeTaskButton: document.querySelector("#completeTaskButton"),
  missTaskButton: document.querySelector("#missTaskButton"),
  feedButton: document.querySelector("#feedButton"),
  waterButton: document.querySelector("#waterButton"),
  calmEffects: document.querySelector("#calmEffects"),
  dropHint: document.querySelector("#dropHint"),
  catMessage: document.querySelector("#catMessage"),
};

let state = loadState();
let draggedCare = null;
let suppressCareClick = false;

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function dayNumber(dateKey) {
  return Math.floor(new Date(`${dateKey}T00:00:00`).getTime() / 86400000);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeSavedState({ ...defaultState, ...saved });
  } catch {
    return { ...defaultState };
  }
}

function normalizeSavedState(savedState) {
  const name = savedState.catName || "Your cat";
  const calmMessages = new Map([
    ["Welcome back. Your cat is waiting for today's task.", "Welcome back. Take one slow breath with your cat."],
    [`${name} is ready to spend the day with you.`, `${name} is here to help your mind settle.`],
    [`${name} is happy because you completed today's task. Nice work.`, `${name} is happy. Your head gets to rest for a moment now.`],
    [`${name} enjoyed the onigiri.`, `${name} enjoyed the onigiri. Let your shoulders soften.`],
    [`${name} had a refreshing drink.`, `${name} had a refreshing drink. Take a slow sip too.`],
  ]);

  if (calmMessages.has(savedState.lastMessage)) {
    savedState.lastMessage = calmMessages.get(savedState.lastMessage);
  }

  return savedState;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function getDailyTask(dateKey) {
  const seed = [...dateKey].reduce((total, character) => total + character.charCodeAt(0), 0);
  return tasks[seed % tasks.length];
}

function syncDailyState() {
  const today = todayKey();
  const loginDates = new Set(state.loginDates);
  loginDates.add(today);
  state.loginDates = [...loginDates].sort();

  if (state.taskDate && state.taskDate !== today && state.taskStatus !== "done") {
    state.mood = "mad";
    state.lastMessage = `${displayName()} felt ignored yesterday, but today can be softer. Start with one breath.`;
  }

  if (state.lastSeenDate && state.lastSeenDate !== today) {
    const daysAway = Math.max(1, dayNumber(today) - dayNumber(state.lastSeenDate));
    state.food = clamp(state.food - daysAway * 12);
    state.water = clamp(state.water - daysAway * 15);
  }

  if (state.taskDate !== today) {
    state.taskDate = today;
    state.taskStatus = "waiting";
    if (state.mood !== "mad") {
      state.mood = state.food < 25 || state.water < 25 ? "needy" : "neutral";
    }
  }

  state.lastSeenDate = today;
  saveState();
}

function calculateStreak() {
  const dates = [...new Set(state.loginDates)].sort().reverse();
  if (!dates.length) return 0;

  let expected = dayNumber(todayKey());
  let streak = 0;

  for (const date of dates) {
    const current = dayNumber(date);
    if (current === expected) {
      streak += 1;
      expected -= 1;
    } else if (current < expected) {
      break;
    }
  }

  return streak;
}

function displayName() {
  return state.catName || "Your cat";
}

function moodText() {
  if (!state.catName) return "Name me!";
  if (state.mood === "happy") return "Happy!";
  if (state.mood === "mad") return "Upset";
  if (state.mood === "needy") return "Care?";
  return "Breathe";
}

function updateMoodFromCare() {
  if (state.food < 25 || state.water < 25) {
    state.mood = "needy";
    state.lastMessage = `${displayName()} needs a little care. You can slow down here too.`;
  } else if (state.mood === "needy") {
    state.mood = "neutral";
    state.lastMessage = `${displayName()} feels cozy again. Notice your next breath.`;
  }
}

function render() {
  const task = getDailyTask(state.taskDate || todayKey());
  const loginCount = new Set(state.loginDates).size;

  elements.catNameTitle.textContent = displayName();
  elements.catNameInput.value = state.catName;
  elements.loginDays.textContent = loginCount;
  elements.loginStreak.textContent = calculateStreak();
  elements.foodLevel.textContent = `${state.food}%`;
  elements.waterLevel.textContent = `${state.water}%`;
  elements.foodMeter.value = state.food;
  elements.waterMeter.value = state.water;
  elements.taskTitle.textContent = task.title;
  elements.taskText.textContent = task.text;
  elements.catMessage.textContent = state.lastMessage;
  elements.moodBubble.textContent = moodText();

  elements.catPortrait.className = `cat-portrait ${state.mood}`;
  elements.taskStatus.className = `task-status ${state.taskStatus === "done" ? "done" : ""} ${state.taskStatus === "missed" ? "missed" : ""}`;
  elements.taskStatus.textContent =
    state.taskStatus === "done" ? "Complete" : state.taskStatus === "missed" ? "Missed" : "Waiting";

  const taskClosed = state.taskStatus === "done" || state.taskStatus === "missed";
  elements.completeTaskButton.disabled = taskClosed;
  elements.missTaskButton.disabled = taskClosed;
  elements.completeTaskButton.textContent = state.taskStatus === "done" ? "Rest Complete" : "I Did This";
}

function completeTask() {
  state.taskStatus = "done";
  state.mood = "happy";
  state.food = clamp(state.food + 8);
  state.water = clamp(state.water + 8);
  state.lastMessage = `${displayName()} is happy. Your head gets to rest for a moment now.`;
  saveState();
  render();
  triggerCalmEffect("complete");
}

function missTask() {
  state.taskStatus = "missed";
  state.mood = "mad";
  state.lastMessage = `${displayName()} is upset, but you are allowed to begin again tomorrow. Be gentle tonight.`;
  saveState();
  render();
}

function feedCat() {
  state.food = clamp(state.food + 22);
  updateMoodFromCare();
  if (state.mood !== "needy") {
    state.mood = state.mood === "mad" ? "neutral" : state.mood;
    state.lastMessage = `${displayName()} enjoyed the onigiri. Let your shoulders soften.`;
  }
  saveState();
  render();
  triggerCalmEffect("feed");
}

function waterCat() {
  state.water = clamp(state.water + 24);
  updateMoodFromCare();
  if (state.mood !== "needy") {
    state.mood = state.mood === "mad" ? "neutral" : state.mood;
    state.lastMessage = `${displayName()} had a refreshing drink. Take a slow sip too.`;
  }
  saveState();
  render();
  triggerCalmEffect("water");
}

function saveName(event) {
  event.preventDefault();
  const nextName = elements.catNameInput.value.trim();
  state.catName = nextName;
  state.lastMessage = nextName
    ? `${nextName} is here to help your mind settle.`
    : "Your cat is waiting for a soft little name.";
  if (nextName && state.mood === "neutral") {
    state.mood = "happy";
  }
  elements.nameForm.classList.remove("is-open");
  saveState();
  render();
}

function triggerCalmEffect(type) {
  const symbols = {
    feed: ["🍙", "✦", "はぁ"],
    water: ["💧", "〜", "すう"],
    complete: ["✦", "ほっ", "♡"],
  };

  elements.catPortrait.classList.remove("care-pulse", "water-pulse", "rest-pulse");
  void elements.catPortrait.offsetWidth;
  elements.catPortrait.classList.add(
    type === "water" ? "water-pulse" : type === "complete" ? "rest-pulse" : "care-pulse",
  );

  elements.calmEffects.innerHTML = "";
  symbols[type].forEach((symbol, index) => {
    const item = document.createElement("span");
    item.textContent = symbol;
    item.style.setProperty("--drift", `${index * 24 - 24}px`);
    item.style.setProperty("--delay", `${index * 110}ms`);
    elements.calmEffects.append(item);
  });
}

function handleCareDrop(type) {
  if (type === "feed") {
    feedCat();
  } else if (type === "water") {
    waterCat();
  }
}

function setDragState(isDragging, type = "") {
  elements.catPortrait.classList.toggle("is-drag-target", isDragging);
  elements.catPortrait.classList.toggle("is-feed-target", isDragging && type === "feed");
  elements.catPortrait.classList.toggle("is-water-target", isDragging && type === "water");
  elements.dropHint.textContent =
    type === "water" ? "Drop water here" : type === "feed" ? "Drop food here" : "Drop care here";
}

function setupCareDrag(button, type) {
  button.addEventListener("click", (event) => {
    if (suppressCareClick) {
      event.preventDefault();
      suppressCareClick = false;
      return;
    }

    handleCareDrop(type);
  });

  button.addEventListener("pointerdown", (event) => {
    if (event.button && event.button !== 0) return;
    draggedCare = {
      button,
      ghost: null,
      isMoving: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      type,
    };
    button.setPointerCapture(event.pointerId);
  });

  button.addEventListener("pointermove", (event) => {
    if (!draggedCare || draggedCare.pointerId !== event.pointerId) return;

    const moveX = event.clientX - draggedCare.startX;
    const moveY = event.clientY - draggedCare.startY;
    const distance = Math.hypot(moveX, moveY);

    if (!draggedCare.isMoving && distance > 8) {
      draggedCare.isMoving = true;
      suppressCareClick = true;
      draggedCare.ghost = createDragGhost(type);
      button.classList.add("is-dragging");
      setDragState(true, type);
    }

    if (!draggedCare.isMoving) return;
    event.preventDefault();
    draggedCare.currentX = event.clientX;
    draggedCare.currentY = event.clientY;
    moveDragGhost(draggedCare.ghost, event.clientX, event.clientY);
    updateDropHover(event.clientX, event.clientY, type);
  });

  button.addEventListener("pointerup", (event) => {
    finishPointerDrop(event);
  });

  button.addEventListener("pointercancel", finishPointerDrag);
}

function createDragGhost(type) {
  const ghost = document.createElement("div");
  ghost.className = `drag-ghost ${type === "water" ? "water-ghost" : "feed-ghost"}`;
  ghost.textContent = type === "water" ? "💧" : "🍙";
  document.body.append(ghost);
  return ghost;
}

function moveDragGhost(ghost, x, y) {
  if (!ghost) return;
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}

function isPointOverCat(x, y) {
  const bounds = elements.catPortrait.getBoundingClientRect();
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

function updateDropHover(x, y, type) {
  const isOverCat = isPointOverCat(x, y);
  elements.catPortrait.classList.toggle("is-drop-hover", isOverCat);
  setDragState(Boolean(draggedCare?.isMoving), type);
}

function finishPointerDrag() {
  if (!draggedCare) return;
  draggedCare.button.classList.remove("is-dragging");
  document.querySelectorAll(".drag-ghost").forEach((ghost) => ghost.remove());
  draggedCare = null;
  elements.catPortrait.classList.remove("is-drop-hover");
  setDragState(false);
  window.setTimeout(() => {
    suppressCareClick = false;
  }, 250);
}

function finishPointerDrop(event) {
  if (!draggedCare || draggedCare.pointerId !== event.pointerId) return;
  const type = draggedCare.type;
  const x = event.clientX || draggedCare.currentX;
  const y = event.clientY || draggedCare.currentY;
  const didDrop = draggedCare.isMoving && isPointOverCat(x, y);
  finishPointerDrag();
  if (didDrop) {
    handleCareDrop(type);
  }
}

elements.editNameButton.addEventListener("click", () => {
  elements.nameForm.classList.toggle("is-open");
  elements.catNameInput.focus();
});
elements.nameForm.addEventListener("submit", saveName);
elements.completeTaskButton.addEventListener("click", completeTask);
elements.missTaskButton.addEventListener("click", missTask);
setupCareDrag(elements.feedButton, "feed");
setupCareDrag(elements.waterButton, "water");
window.addEventListener("pointerup", finishPointerDrop, true);
window.addEventListener("pointercancel", finishPointerDrag, true);
window.addEventListener("blur", finishPointerDrag);

syncDailyState();
updateMoodFromCare();
saveState();
render();
