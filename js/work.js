// ==============================================
// PROJECT MEDIA CAROUSEL
// USED ONLY ON WORK.HTML
// ==============================================

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("projectCarousel");

  /*
    Stops if this page does not contain a carousel.
  */
  if (!carousel) {
    return;
  }

  const carouselTrack =
    carousel.querySelector(".carousel-track");

  const carouselSlides =
    carousel.querySelectorAll(".carousel-slide");

  const previousButton =
    carousel.querySelector(".carousel-previous");

  const nextButton =
    carousel.querySelector(".carousel-next");

  const carouselDots =
    carousel.querySelectorAll(".carousel-dot");

  const carouselViewport =
    carousel.querySelector(".carousel-viewport");

  let currentSlide = 0;
  let touchStartX = 0;

  /*
    Displays the selected slide.
  */
  function showSlide(slideNumber) {
    if (slideNumber >= carouselSlides.length) {
      currentSlide = 0;
    } else if (slideNumber < 0) {
      currentSlide = carouselSlides.length - 1;
    } else {
      currentSlide = slideNumber;
    }

    carouselTrack.style.transform =
      "translateX(-" + currentSlide * 100 + "%)";

    /*
      Updates the active navigation dot.
    */
    carouselDots.forEach(function (dot, index) {
      dot.classList.toggle(
        "active",
        index === currentSlide
      );
    });

    /*
      Pauses videos when their slide is no longer visible.
    */
    carouselSlides.forEach(function (slide, index) {
      const video = slide.querySelector("video");

      if (video && index !== currentSlide) {
        video.pause();
      }
    });
  }

  /*
    Previous and next buttons.
  */
  previousButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
  });

  /*
    Navigation dots.
  */
  carouselDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  /*
    Saves where a phone swipe started.
  */
  carouselViewport.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].clientX;
    },
    {
      passive: true
    }
  );

  /*
    Detects the completed swipe direction.
  */
  carouselViewport.addEventListener(
    "touchend",
    function (event) {
      const touchEndX =
        event.changedTouches[0].clientX;

      const swipeDistance =
        touchStartX - touchEndX;

      /*
        Ignores very small finger movements.
      */
      if (Math.abs(swipeDistance) < 45) {
        return;
      }

      if (swipeDistance > 0) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }
    },
    {
      passive: true
    }
  );

  /*
    Keyboard arrow controls.
  */
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

  /*
    Starts the carousel on its first slide.
  */
  showSlide(0);
});