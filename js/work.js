document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("projectCarousel");

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

  // Show what is selected
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

    // Nav dots
    carouselDots.forEach(function (dot, index) {
      dot.classList.toggle(
        "active",
        index === currentSlide
      );
    });

    // Video feature
    carouselSlides.forEach(function (slide, index) {
      const video = slide.querySelector("video");

      if (video && index !== currentSlide) {
        video.pause();
      }
    });
  }

  //next and previous buttons
  previousButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
  });

  // Nav dots
  carouselDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

 // Phone swipe feature
  carouselViewport.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].clientX;
    },
    {
      passive: true
    }
  );

  carouselViewport.addEventListener(
    "touchend",
    function (event) {
      const touchEndX =
        event.changedTouches[0].clientX;

      const swipeDistance =
        touchStartX - touchEndX;

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

  // Keyboard nav
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

// Start on the first slide
  showSlide(0);
});