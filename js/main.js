// ==============================================
// MOBILE NAVIGATION MENU
// USED ON EVERY PAGE
// ==============================================

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    navLinks.classList.toggle("show");
  }
}


// ==============================================
// HIDDEN WIMJEFF EASTER EGG
// USED ON EVERY PAGE
// ==============================================

// Secret word that starts the animation
const secretWord = "wimjeff";

/*
  Checks whether the selected element is interactive.

  Double-clicking or double-tapping these elements
  will not open the hidden text field.
*/
function isInteractiveElement(element) {
  return element.closest(
    "a, button, input, textarea, select, label, video, " +
    ".wimjeff-bouncer, .media-carousel"
  );
}

/*
  Creates the text field at the location where
  the user double-clicked or double-tapped.
*/
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

  /*
    Keeps the input field inside the visible screen.
  */
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

  /*
    Waits for Enter before checking the entered word.
  */
  secretInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      secretInput.remove();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    /*
      Makes the check case-insensitive and removes spaces.
    */
    const typedText = secretInput.value
      .trim()
      .toLowerCase()
      .replace(/\s/g, "");

    /*
      Accepts the complete word or at least two
      consecutive letters from WimJeff.
    */
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

  /*
    Removes the input if the user clicks elsewhere.
  */
  secretInput.addEventListener("blur", function () {
    setTimeout(function () {
      if (secretInput.isConnected) {
        secretInput.remove();
      }
    }, 200);
  });
}

/*
  Creates the bouncing WimJeff text.
*/
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

  /*
    WimJeff disappears only when it is clicked directly.
  */
  bouncingText.addEventListener("click", function (event) {
    event.stopPropagation();
    bouncingText.remove();
  });
}


// ==============================================
// COMPUTER DOUBLE-CLICK
// ==============================================

/*
  Prevents touchscreen taps from also activating
  the browser's computer double-click event.
*/
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


// ==============================================
// PHONE AND TABLET DOUBLE-TAP
// ==============================================

/*
  Information about the finger currently touching
  the screen.
*/
let activeTouchPointerId = null;
let touchStartX = 0;
let touchStartY = 0;
let touchStartScrollX = 0;
let touchStartScrollY = 0;
let touchStartTime = 0;
let touchMoved = false;
let pageScrolledDuringTouch = false;

/*
  Information about the previous valid tap.
*/
let previousValidTapTime = 0;
let previousValidTapX = 0;
let previousValidTapY = 0;
let previousValidTapTarget = null;

/*
  Strict limits that distinguish tapping from scrolling.
*/
const maximumFingerMovement = 8;
const maximumTapLength = 280;
const maximumTimeBetweenTaps = 400;
const maximumDistanceBetweenTaps = 12;

/*
  Clears the saved first tap.
*/
function resetPreviousValidTap() {
  previousValidTapTime = 0;
  previousValidTapX = 0;
  previousValidTapY = 0;
  previousValidTapTarget = null;
}

/*
  Any scrolling cancels the tap.
*/
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

/*
  Records where a finger first touches the screen.
*/
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

/*
  Detects finger movement.
*/
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

/*
  Cancels an interrupted touch.
*/
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

/*
  Checks whether two completed taps happened
  on the same element and almost the same spot.
*/
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

    /*
      Rejects the gesture if the user moved,
      scrolled, swiped or held the screen.
    */
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

    /*
      Both taps must land on the same HTML element.
    */
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

    /*
      Saves the first valid tap while waiting for
      a second tap.
    */
    previousValidTapTime = currentTapTime;
    previousValidTapX = event.clientX;
    previousValidTapY = event.clientY;
    previousValidTapTarget = currentTapTarget;
  },
  {
    passive: false
  }
);


// ==============================================
// SCROLL FADE-IN ANIMATION
// USED ON EVERY PAGE
// ==============================================

document.addEventListener("DOMContentLoaded", function () {
  /*
    Selects sections below the visible top portion.

    The Home hero and page-title banners remain visible
    when the page first opens.
  */
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
    /*
      Older-browser fallback.
    */
    sectionsToReveal.forEach(function (section) {
      section.classList.add("reveal-visible");
    });
  }
});