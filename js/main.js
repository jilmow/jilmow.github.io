// Mobile navigation menu
const menuButton = document.querySelector(".menu-btn");
const navLinks = document.getElementById("navLinks");

// Opens and closes the navigation menu on smaller screens
if (menuButton && navLinks) {
  menuButton.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });
}

// Easter Egg
const secretWord = "wimjeff";

// Double click feature
function isInteractiveElement(element) {
  return element.closest(
    "a, button, input, textarea, select, label, video, " +
    ".wimjeff-bouncer, .media-carousel"
  );
}

// The text field
function showSecretInput(xPosition, yPosition) {
  const oldInput = document.querySelector(".secret-word-input");

  if (oldInput) {
    oldInput.remove();
  }

  const secretInput = document.createElement("input");

  secretInput.type = "text";
  secretInput.className = "secret-word-input";
  secretInput.placeholder = "Type something and press Enter";
  secretInput.autocomplete = "off";
  secretInput.setAttribute("aria-label", "Hidden text field");

  const inputHalfWidth = 125;
  const inputHalfHeight = 25;

  const safeXPosition = Math.max(
    inputHalfWidth,
    Math.min(xPosition, window.innerWidth - inputHalfWidth)
  );

  const safeYPosition = Math.max(
    inputHalfHeight,
    Math.min(yPosition, window.innerHeight - inputHalfHeight)
  );

  secretInput.style.left = safeXPosition + "px";
  secretInput.style.top = safeYPosition + "px";

  document.body.appendChild(secretInput);
  secretInput.focus();

  // Pressing Enter
  secretInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      secretInput.remove();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    //Makes the check case-insensitive and removes spaces.
    const typedText = secretInput.value
      .trim()
      .toLowerCase()
      .replace(/\s/g, "");

    const isPartOfSecretWord =
      typedText.length >= 2 &&
      secretWord.includes(typedText);

    if (isPartOfSecretWord) {
      secretInput.remove();
      startWimJeffAnimation();
    } else {
      secretInput.classList.remove("input-error");

      // Restarts the error animation
      void secretInput.offsetWidth;

      secretInput.classList.add("input-error");
      secretInput.select();
    }
  });

  //Removes the input if the user clicks elsewhere.
  secretInput.addEventListener("blur", function () {
    setTimeout(function () {
      if (secretInput.isConnected) {
        secretInput.remove();
      }
    }, 200);
  });
}

// Bouncing WimJeff
function startWimJeffAnimation() {
  const oldAnimation = document.querySelector(".wimjeff-bouncer");

  if (oldAnimation) {
    oldAnimation.remove();
  }

  const bouncingText = document.createElement("div");

  bouncingText.className = "wimjeff-bouncer";
  bouncingText.textContent = "WimJeff";
  bouncingText.title = "Click to close";
  bouncingText.setAttribute("role", "button");
  bouncingText.setAttribute(
    "aria-label",
    "Click to remove WimJeff"
  );

  document.body.appendChild(bouncingText);

  //WimJeff disappears after click
  bouncingText.addEventListener("click", function (event) {
    event.stopPropagation();
    bouncingText.remove();
  });
}

// Double click feature
let lastTouchInteractionTime = 0;

document.addEventListener("dblclick", function (event) {
  const recentlyUsedTouchscreen =
    Date.now() - lastTouchInteractionTime < 800;

  if (recentlyUsedTouchscreen) {
    return;
  }

  if (isInteractiveElement(event.target)) {
    return;
  }

  showSecretInput(event.clientX, event.clientY);
});


// Phone double-tap feature
let activeTouchPointerId = null;
let touchStartX = 0;
let touchStartY = 0;
let touchStartScrollX = 0;
let touchStartScrollY = 0;
let touchStartTime = 0;
let touchMoved = false;
let pageScrolledDuringTouch = false;
let previousValidTapTime = 0;
let previousValidTapX = 0;
let previousValidTapY = 0;
let previousValidTapTarget = null;
const maximumFingerMovement = 8;
const maximumTapLength = 280;
const maximumTimeBetweenTaps = 400;
const maximumDistanceBetweenTaps = 12;

function resetPreviousValidTap() {
  previousValidTapTime = 0;
  previousValidTapX = 0;
  previousValidTapY = 0;
  previousValidTapTarget = null;
}

// Tab cancel
window.addEventListener(
  "scroll",
  function () {
    pageScrolledDuringTouch = true;
    touchMoved = true;
    resetPreviousValidTap();
  },
  {
    passive: true
  }
);

// Touch phone
document.addEventListener(
  "pointerdown",
  function (event) {
    if (event.pointerType !== "touch") {
      return;
    }

    lastTouchInteractionTime = Date.now();

    if (isInteractiveElement(event.target)) {
      activeTouchPointerId = null;
      resetPreviousValidTap();
      return;
    }

    activeTouchPointerId = event.pointerId;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
    touchStartScrollX = window.scrollX;
    touchStartScrollY = window.scrollY;
    touchStartTime = Date.now();
    touchMoved = false;
    pageScrolledDuringTouch = false;
  },
  {
    passive: true
  }
);

//Detects finger movement.
document.addEventListener(
  "pointermove",
  function (event) {
    if (
      event.pointerType !== "touch" ||
      event.pointerId !== activeTouchPointerId
    ) {
      return;
    }

    const horizontalMovement =
      event.clientX - touchStartX;

    const verticalMovement =
      event.clientY - touchStartY;

    const totalMovement = Math.sqrt(
      horizontalMovement * horizontalMovement +
      verticalMovement * verticalMovement
    );

    if (totalMovement > maximumFingerMovement) {
      touchMoved = true;
      resetPreviousValidTap();
    }
  },
  {
    passive: true
  }
);

// Touch cancel
document.addEventListener(
  "pointercancel",
  function (event) {
    if (
      event.pointerType !== "touch" ||
      event.pointerId !== activeTouchPointerId
    ) {
      return;
    }

    activeTouchPointerId = null;
    touchMoved = true;
    resetPreviousValidTap();
  },
  {
    passive: true
  }
);

// Double touch check
document.addEventListener(
  "pointerup",
  function (event) {
    if (
      event.pointerType !== "touch" ||
      event.pointerId !== activeTouchPointerId
    ) {
      return;
    }

    lastTouchInteractionTime = Date.now();

    const currentTapTarget = event.target;

    activeTouchPointerId = null;

    const tapLength =
      Date.now() - touchStartTime;

    const horizontalMovement =
      event.clientX - touchStartX;

    const verticalMovement =
      event.clientY - touchStartY;

    const totalMovement = Math.sqrt(
      horizontalMovement * horizontalMovement +
      verticalMovement * verticalMovement
    );

    const pagePositionChanged =
      window.scrollX !== touchStartScrollX ||
      window.scrollY !== touchStartScrollY;

    // Text cancel
    const isInvalidTap =
      touchMoved ||
      pageScrolledDuringTouch ||
      pagePositionChanged ||
      totalMovement > maximumFingerMovement ||
      tapLength > maximumTapLength;

    if (isInvalidTap) {
      resetPreviousValidTap();
      return;
    }

    if (isInteractiveElement(currentTapTarget)) {
      resetPreviousValidTap();
      return;
    }

    const currentTapTime = Date.now();

    const timeBetweenTaps =
      currentTapTime - previousValidTapTime;

    const horizontalTapDistance =
      event.clientX - previousValidTapX;

    const verticalTapDistance =
      event.clientY - previousValidTapY;

    const distanceBetweenTaps = Math.sqrt(
      horizontalTapDistance * horizontalTapDistance +
      verticalTapDistance * verticalTapDistance
    );

    // Touch precision
    const tappedSameElement =
      currentTapTarget === previousValidTapTarget;

    const isValidDoubleTap =
      previousValidTapTime !== 0 &&
      timeBetweenTaps <= maximumTimeBetweenTaps &&
      distanceBetweenTaps <= maximumDistanceBetweenTaps &&
      tappedSameElement;

    if (isValidDoubleTap) {
      event.preventDefault();

      showSecretInput(
        event.clientX,
        event.clientY
      );

      resetPreviousValidTap();
      return;
    }

    // First tap
    previousValidTapTime = currentTapTime;
    previousValidTapX = event.clientX;
    previousValidTapY = event.clientY;
    previousValidTapTarget = currentTapTarget;
  },
  {
    passive: false
  }
);

// Fade in animation
document.addEventListener("DOMContentLoaded", function () {

  const sectionsToReveal = document.querySelectorAll(
    "#home-content > section, main > section.section, footer"
  );

  sectionsToReveal.forEach(function (section) {
    section.classList.add("scroll-reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -55px 0px"
      }
    );

    sectionsToReveal.forEach(function (section) {
      revealObserver.observe(section);
    });
  } else {

    sectionsToReveal.forEach(function (section) {
      section.classList.add("reveal-visible");
    });
  }
});