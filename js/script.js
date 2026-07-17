// ==============================================
// MOBILE NAVIGATION MENU
// ==============================================

// Opens and closes the navigation menu on smaller screens
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");

  navLinks.classList.toggle("show");
}


// ==============================================
// HIDDEN WIMJEFF EASTER EGG
// ==============================================

// The hidden word that activates the animation
const secretWord = "wimjeff";

/*
  Checks whether the clicked element is interactive.

  The hidden input will not open when the user clicks
  a link, button, input field, textarea, label, or the
  bouncing WimJeff text.
*/
function isInteractiveElement(element) {
  return element.closest(
    "a, button, input, textarea, select, label, .wimjeff-bouncer, .media-carousel"
  );
}

/*
  Creates the text field at the location where
  the user double-clicked or tapped.
*/
function showSecretInput(xPosition, yPosition) {

  // Removes an older hidden input if one is still visible
  const oldInput = document.querySelector(".secret-word-input");

  if (oldInput) {
    oldInput.remove();
  }

  // Creates a new input field
  const secretInput = document.createElement("input");

  secretInput.type = "text";
  secretInput.className = "secret-word-input";
  secretInput.placeholder = "Type something and press Enter";
  secretInput.autocomplete = "off";
  secretInput.setAttribute("aria-label", "Hidden text field");

  /*
    Keeps the input inside the visible screen,
    even when the user clicks close to an edge.
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

  // Positions the input where the user clicked or tapped
  secretInput.style.left = safeXPosition + "px";
  secretInput.style.top = safeYPosition + "px";

  // Adds the input to the current page
  document.body.appendChild(secretInput);

  // Automatically places the typing cursor in the input
  secretInput.focus();

  /*
    Waits until the user presses Enter.

    The animation does not start while the user
    is still typing.
  */
  secretInput.addEventListener("keydown", function (event) {

    // Closes the input when Escape is pressed
    if (event.key === "Escape") {
      secretInput.remove();
      return;
    }

    // Does nothing until Enter is pressed
    if (event.key !== "Enter") {
      return;
    }

    // Prevents Enter from performing another browser action
    event.preventDefault();

    /*
      Converts the entered text to lowercase and removes
      spaces so uppercase and lowercase both work.
    */
    const typedText = secretInput.value
      .trim()
      .toLowerCase()
      .replace(/\s/g, "");

    /*
      Accepts the complete word or at least two
      consecutive letters from the word.

      Examples:
      WimJeff
      wimjeff
      Wim
      Jeff
      imj
    */
    const isPartOfSecretWord =
      typedText.length >= 2 &&
      secretWord.includes(typedText);

    if (isPartOfSecretWord) {
      secretInput.remove();
      startWimJeffAnimation();
    } else {
      /*
        If the entered word is incorrect, the input
        briefly shakes and remains available.
      */
      secretInput.classList.remove("input-error");

      /*
        Forces the browser to restart the error animation
        if Enter is pressed incorrectly more than once.
      */
      void secretInput.offsetWidth;

      secretInput.classList.add("input-error");
      secretInput.select();
    }
  });

  /*
    Removes the input when the user clicks or taps
    somewhere else without pressing Enter.
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
  Creates the animated WimJeff text and makes it
  bounce across the current screen.
*/
function startWimJeffAnimation() {

  /*
    Removes an older WimJeff animation before a new
    one is created. This prevents duplicates.
  */
  const oldAnimation = document.querySelector(".wimjeff-bouncer");

  if (oldAnimation) {
    oldAnimation.remove();
  }

  // Creates the bouncing text
  const bouncingText = document.createElement("div");

  bouncingText.className = "wimjeff-bouncer";
  bouncingText.textContent = "WimJeff";
  bouncingText.title = "Click to close";
  bouncingText.setAttribute("role", "button");
  bouncingText.setAttribute("aria-label", "Click to remove WimJeff");

  // Adds the bouncing text to the current page
  document.body.appendChild(bouncingText);

  /*
    WimJeff now remains on the screen until the user
    clicks directly on the bouncing text.
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
  Stores the last time a touchscreen was used.

  This prevents a phone from activating both the
  phone double-tap code and computer double-click code.
*/
let lastTouchInteractionTime = 0;

/*
  Opens the hidden input after a double-click
  with a mouse on a computer.
*/
document.addEventListener("dblclick", function (event) {

  /*
    Ignores the double-click if a touchscreen was
    used during the previous 800 milliseconds.
  */
  const recentlyUsedTouchscreen =
    Date.now() - lastTouchInteractionTime < 800;

  if (recentlyUsedTouchscreen) {
    return;
  }

  // Ignores links, buttons and other interactive elements
  if (isInteractiveElement(event.target)) {
    return;
  }

  showSecretInput(event.clientX, event.clientY);
});


// ==============================================
// PHONE AND TABLET DOUBLE-TAP
// ==============================================

/*
  Information about the finger that is currently
  touching the screen.
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
  Strict limits used to distinguish a tap
  from scrolling or swiping.
*/
const maximumFingerMovement = 8;
const maximumTapLength = 280;
const maximumTimeBetweenTaps = 400;
const maximumDistanceBetweenTaps = 12;

/*
  Resets the saved first tap.

  This prevents an old tap from accidentally
  being combined with a later tap.
*/
function resetPreviousValidTap() {
  previousValidTapTime = 0;
  previousValidTapX = 0;
  previousValidTapY = 0;
  previousValidTapTarget = null;
}

/*
  A scroll event immediately cancels the current
  gesture and any previously saved first tap.
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
  Saves the exact position where the finger
  first touches the screen.
*/
document.addEventListener(
  "pointerdown",
  function (event) {

    // This section is only for fingers on touchscreens
    if (event.pointerType !== "touch") {
      return;
    }

    lastTouchInteractionTime = Date.now();

    /*
      Ignores links, buttons, videos, carousel controls
      and other interactive elements.
    */
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
  Detects even small finger movement.

  If the finger moves more than 8 pixels,
  the gesture is treated as scrolling or swiping.
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
  A cancelled touch can never be used as a tap.
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
  Checks whether the completed gesture was a
  real tap and whether it matches the first tap.
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

    // Saves the target before resetting the active pointer
    const currentTapTarget = event.target;

    activeTouchPointerId = null;

    // Calculates how long the finger touched the screen
    const tapLength =
      Date.now() - touchStartTime;

    // Calculates the total movement of the finger
    const horizontalMovement =
      event.clientX - touchStartX;

    const verticalMovement =
      event.clientY - touchStartY;

    const totalMovement = Math.sqrt(
      horizontalMovement * horizontalMovement +
      verticalMovement * verticalMovement
    );

    /*
      Checks whether the page position changed
      while the finger was touching the screen.
    */
    const pagePositionChanged =
      window.scrollX !== touchStartScrollX ||
      window.scrollY !== touchStartScrollY;

    /*
      This gesture is rejected if the user:

      - Moved their finger
      - Scrolled the page
      - Swiped
      - Held their finger down too long
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

    // Ignores interactive page elements
    if (isInteractiveElement(currentTapTarget)) {
      resetPreviousValidTap();
      return;
    }

    const currentTapTime = Date.now();

    // Calculates the time between both taps
    const timeBetweenTaps =
      currentTapTime - previousValidTapTime;

    // Calculates the exact distance between both taps
    const horizontalTapDistance =
      event.clientX - previousValidTapX;

    const verticalTapDistance =
      event.clientY - previousValidTapY;

    const distanceBetweenTaps = Math.sqrt(
      horizontalTapDistance * horizontalTapDistance +
      verticalTapDistance * verticalTapDistance
    );

    /*
      Requires both taps to land on the exact same
      HTML element as an additional safety check.
    */
    const tappedSameElement =
      currentTapTarget === previousValidTapTarget;

    /*
      Opens the input only when:

      1. A first valid tap exists.
      2. The second tap happened quickly.
      3. Both taps are within 12 pixels.
      4. Both taps landed on the same element.
    */
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
      This was one valid tap.

      It is saved while the code waits for a second
      tap at almost exactly the same position.
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

/*
  Starts the scroll animation after the HTML page
  has completely loaded.
*/
document.addEventListener("DOMContentLoaded", function () {

  /*
    Selects the content sections underneath the
    visible top section of every page.

    The Home hero and the title banners are not selected,
    so they remain visible when the page first opens.
  */
  const sectionsToReveal = document.querySelectorAll(
    "#home-content > section, main > section.section, footer"
  );

  /*
    Gives every selected section the hidden
    scroll animation class.
  */
  sectionsToReveal.forEach(function (section) {
    section.classList.add("scroll-reveal");
  });

  /*
    Checks whether the browser supports
    IntersectionObserver.
  */
  if ("IntersectionObserver" in window) {

    /*
      Watches the hidden sections and detects when
      they enter the visible part of the screen.
    */
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          // Reveals the section when it enters the screen
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");

            /*
              Stops watching the section after it has
              appeared. It will remain visible afterward.
            */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Starts the animation when 12% is visible
        threshold: 0.12,

        /*
          Waits until the section is slightly inside
          the screen before revealing it.
        */
        rootMargin: "0px 0px -55px 0px"
      }
    );

    // Starts watching every hidden section
    sectionsToReveal.forEach(function (section) {
      revealObserver.observe(section);
    });

  } else {

    /*
      Fallback for older browsers.

      If IntersectionObserver is unavailable,
      all sections are shown normally.
    */
    sectionsToReveal.forEach(function (section) {
      section.classList.add("reveal-visible");
    });
  }
});

// ==============================================
// PROJECT MEDIA CAROUSEL
// USED ON THE WORK PAGE
// ==============================================

document.addEventListener("DOMContentLoaded", function () {

  // Finds the project carousel
  const carousel = document.getElementById("projectCarousel");

  /*
    Stops here on pages that do not contain
    the project carousel.
  */
  if (!carousel) {
    return;
  }

  // Finds all the required carousel elements
  const carouselTrack = carousel.querySelector(".carousel-track");
  const carouselSlides = carousel.querySelectorAll(".carousel-slide");
  const previousButton = carousel.querySelector(".carousel-previous");
  const nextButton = carousel.querySelector(".carousel-next");
  const carouselDots = carousel.querySelectorAll(".carousel-dot");
  const carouselViewport = carousel.querySelector(".carousel-viewport");

  // Stores the number of the currently visible slide
  let currentSlide = 0;

  // Stores the starting position of a phone swipe
  let touchStartX = 0;

  /*
    Displays the selected slide and updates
    the active navigation dot.
  */
  function showSlide(slideNumber) {

    /*
      Returns to the first slide after the last slide.
    */
    if (slideNumber >= carouselSlides.length) {
      currentSlide = 0;

    /*
      Goes to the last slide when moving backward
      from the first slide.
    */
    } else if (slideNumber < 0) {
      currentSlide = carouselSlides.length - 1;

    } else {
      currentSlide = slideNumber;
    }

    // Moves the complete row of slides
    carouselTrack.style.transform =
      "translateX(-" + currentSlide * 100 + "%)";

    // Updates the active navigation dot
    carouselDots.forEach(function (dot, index) {
      dot.classList.toggle("active", index === currentSlide);
    });

    /*
      Pauses videos on slides that are no longer visible.
      This will also work if videos are added later.
    */
    carouselSlides.forEach(function (slide, index) {
      const video = slide.querySelector("video");

      if (video && index !== currentSlide) {
        video.pause();
      }
    });
  }

  // Shows the previous slide
  previousButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
  });

  // Shows the next slide
  nextButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
  });

  // Allows every dot to open its matching slide
  carouselDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  // Saves where a phone swipe started
  carouselViewport.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].clientX;
    },
    {
      passive: true
    }
  );

  // Checks the direction of the completed phone swipe
  carouselViewport.addEventListener(
    "touchend",
    function (event) {
      const touchEndX = event.changedTouches[0].clientX;
      const swipeDistance = touchStartX - touchEndX;

      // Ignores very small finger movements
      if (Math.abs(swipeDistance) < 45) {
        return;
      }

      // A left swipe shows the next slide
      if (swipeDistance > 0) {
        showSlide(currentSlide + 1);

      // A right swipe shows the previous slide
      } else {
        showSlide(currentSlide - 1);
      }
    },
    {
      passive: true
    }
  );

  // Allows the keyboard arrow keys to control the carousel
  carousel.addEventListener("keydown", function (event) {

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  // Makes sure the carousel starts on the first slide
  showSlide(0);
});