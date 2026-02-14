const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const mainGif = document.getElementById("main-gif");
const successOverlay = document.getElementById("success-overlay");
const phraseDisplay = document.getElementById("phrase-display");
const pointer = document.getElementById("pointer-gif");
const floatingContainer = document.getElementById("floating-elements");
const cornerGif = document.getElementById("success-corner-gif");
const extraMessage = document.getElementById("extra-message");
const display = document.getElementById("typewriter");

let yesScale = 1;
let pointerScale = 1;
let noScale = 1;
let noClickCount = 0;
let moveCount = 0;
const maxMoves = 3;
let inactivityTimer;
let hasYesMoved;
let lastHeartTime = 0;
let msgIndex = 0;

const sadNoGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWM5bzl6NzNleDZmbmk4OHhnbzkyZm91dTZ3Zjk1c3p1OGluNGhudCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pY8jLmZw0ElqvVeRH4/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGU2amlqazFxbXU2YXVzdWVnYWYyMjl6ajF2a2JzMjF1cTBnMXBidCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UMfHH9AAruF2w/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG9nNG4yaGR0M2g2Y2NoMHB6MWc3dmZvb2Z5b2poeWRieHhjYWI3OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aWMJvA76tNnBR9gkpT/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2hpOTdqd21ibTJmeHZjNXlxdzZkZHN2Mm9xdTY3eHZldzdlY2F1eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iXbnkZTxCo4t8l8mxK/giphy.gif",
];

const sadYesGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2hpOTdqd21ibTJmeHZjNXlxdzZkZHN2Mm9xdTY3eHZldzdlY2F1eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iXbnkZTxCo4t8l8mxK/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXNpODFwY3dvcHg2NzA0NzlobDM3NG4wa3VzdWxrNjNuaXhmMnpwYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qzTEbvfPgBOR8nvEUn/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTF5ZWJxeGNvc3o3amhpY2ZmZGU4dHM0c3hhbGM2bXJ0aWlqdHZ4diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/deSHAgmKsZXPpTUi0N/giphy.gif",
];

const noPhrases = [
  "Hah, kamu nolak aku?",
  "Serius kamu nggak suka lagi sama aku?",
  "Jangan bercanda deh, nanti aku beneran nangis 😢",
  "Jadi kamu udah nggak sayang aku lagi? 💔😭",
];
const yesPhrases = [
  "Kamu beneran sayang aku?",
  "Eh seriusan nih?!",
  "Janji ya… kamu sayang aku?",
];

const failedGif =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG9nNG4yaGR0M2g2Y2NoMHB6MWc3dmZvb2Z5b2poeWRieHhjYWI3OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7AzEXdIb1wyCTWJntb/giphy.gif";

// Function to update GIF smoothly

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-element";
  const symbols = ["❤️", "💖", "I Love You", "🌹", "✨", "🌸"];
  heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 20 + "px";
  heart.style.color = "#ff4d6d";
  heart.style.opacity = Math.random();
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}
setInterval(spawnHeart, 150);

if (yesBtn) {
  function updateGif(newSrc) {
    mainGif.classList.add("gif-fade");
    setTimeout(() => {
      mainGif.src = newSrc;
      mainGif.classList.remove("gif-fade");
    }, 300); // Matches the CSS transition
  }

  // Function to reposition and show pointer
  function showPointer() {
    const rect = yesBtn.getBoundingClientRect();
    pointer.style.left = rect.right - 35 + "px";
    pointer.style.top = rect.top + rect.height / 2 - 13 + "px";
    pointer.style.opacity = "1";
    pointer.style.visibility = "visible";
  }

  function hidePointer() {
    if (hasYesMoved) {
      pointer.style.opacity = "0";
      pointer.style.visibility = "hidden";
    }
  }

  // Separate the initial state from the movement logic
  function resetInactivityTimer() {
    hidePointer();
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      showPointer();
      hasYesMoved = false;
    }, 3000);
  }

  // 1. YES BUTTON GLIDE
  yesBtn.addEventListener("mouseover", () => {
    if (moveCount < maxMoves) {
      if (moveCount === 0) {
        // First time moving: ensure it transitions from its current spot
        const rect = yesBtn.getBoundingClientRect();
        yesBtn.style.left = `${rect.left}px`;
        yesBtn.style.top = `${rect.top}px`;
        yesBtn.style.position = "fixed";
        yesBtn.style.margin = "0";
      }

      setTimeout(() => {
        // Small delay to let the fixed position register
        const padding = 80;
        const maxX = window.innerWidth - yesBtn.offsetWidth - padding;
        const maxY = window.innerHeight - yesBtn.offsetHeight - padding;

        const randomX = Math.max(padding, Math.random() * maxX);
        const randomY = Math.max(padding, Math.random() * maxY);

        yesBtn.style.left = `${randomX}px`;
        yesBtn.style.top = `${randomY}px`;
      }, 10);

      updateGif(sadYesGifs[moveCount]);
      phraseDisplay.innerText = yesPhrases[moveCount];
      phraseDisplay.classList.add("visible");
      moveCount++;
      hasYesMoved = true;
      hidePointer();
    }
  });

  // 2. NO BUTTON LOGIC
  noBtn.addEventListener("click", () => {
    if (noClickCount < noPhrases.length) {
      phraseDisplay.innerText = noPhrases[noClickCount];

      if (noClickCount < sadNoGifs.length) {
        updateGif(sadNoGifs[noClickCount]);
      }
      phraseDisplay.classList.add("visible");
      yesScale += 0.4;
      noScale -= 0.2;
      pointerScale += 0.4;
      yesBtn.style.transform = `scale(${yesScale})`;
      noBtn.style.transform = `scale(${noScale})`;
      pointer.style.transform = `scale(${pointerScale})`;
      noClickCount++;
      showPointer();

      if (noClickCount === noPhrases.length) {
        noBtn.disabled = true;
        yesBtn.style.display = "none";
        pointer.style.display = "none";
        noBtn.style.margin = "0 auto";
        noBtn.style.transform = "scale(1.2)";
        updateGif(failedGif);
      }
    }
  });

  // 3. SUCCESS TRIGGER
  if (yesBtn) {
    yesBtn.addEventListener("click", () => {
      localStorage.setItem("valentineSuccess", "true"); // Optional flag
      window.location.href = "success.html"; // Redirect to success page
    });
  }

  // 4. MOUSE MOVEMENT (Hide & Inactivity)

  document.addEventListener("mousemove", (e) => {
    if (hasYesMoved) {
      resetInactivityTimer();
    }
    const now = Date.now();
    if (now - lastHeartTime < 60) return; // throttle
    lastHeartTime = now;
    const trail = document.createElement("div");
    trail.className = "trail-heart";
    trail.innerHTML = "💖";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 800);
  });

  // 5. FLOATING ELEMENTS
  function createFallingElement() {
    const el = document.createElement("div");
    el.className = "floating-element";
    const items = [
      "❤️",
      "💖",
      "🌸",
      "✨",
      "🎀",
      "💘",
      "💗",
      "💐",
      "🌷",
      "🌹",
      "🌺",
    ];
    el.innerHTML = items[Math.floor(Math.random() * items.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = Math.random() * 20 + 24 + "px";
    el.style.animationDuration = Math.random() * 3 + 4 + "s";
    floatingContainer.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  setInterval(createFallingElement, 350);
}

// Check if we are on success.html to run the firework animation
if (display) {
  const messages = [
    "Kamu itu orang favoritku di dunia ini ✨",
    "Gemes banget sama kamu 🥰",
    "Aku sayang kamu banget, serius 💖",
    "Aku bahagia banget punya kamu 🌹",
    "Terima kasih sudah memilih aku hari ini 🎀",
    "Semoga hari ini jadi awal cerita indah kita berikutnya 💘",
  ];

  function showNextMessage() {
    display.style.opacity = 0;
    setTimeout(() => {
      display.innerHTML = messages[msgIndex];
      display.style.opacity = 1;
      msgIndex = (msgIndex + 1) % messages.length;
    }, 500);
  }

  showNextMessage();
  setInterval(showNextMessage, 3000); // Change message every 3 seconds

  // Start continuously creating fireworks
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createFirework(x, y);
    createFirework(x, y); // Create a firework at a random position
  }, 500); // Fireworks appear every 500ms

  // AUTO REDIRECT
  setTimeout(() => {
    window.location.href = "index4.html";
  }, 20000);
}

// Function to create fireworks
function createFirework(x, y) {
  const particles = 25; // Number of items in the burst
  const emojis = ["🌸", "💖", "🌹", "✨", "💘", "🌷"];

  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-element"; // Reuse style
    particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.position = "fixed";
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.zIndex = "10001";
    particle.style.fontSize = "2rem";

    // Random trajectory
    const destinationX = (Math.random() - 0.5) * 600;
    const destinationY = (Math.random() - 0.5) * 600;
    const rotation = Math.random() * 720;

    document.body.appendChild(particle);

    const animation = particle.animate(
      [
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${destinationX}px, ${destinationY}px) scale(0) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1500 + Math.random() * 1000,
        easing: "cubic-bezier(0, .9, .57, 1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => particle.remove();
  }
}

// Initialize
window.onload = () => {
  hasYesMoved = false; // Ensure it's false at the very beginning
  setTimeout(showPointer, 200); // Show it and keep it there
};
