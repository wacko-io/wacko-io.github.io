/*jslint browser */

import imagesLoaded from "imagesloaded";
import {lerp} from "./utils/math-utils.js";
import {tilt} from "./utils/tilt-effect.js";
import {raf} from "./utils/raf-loop.js";

const doc = document;

const slider = {
  buttons: {
    next: null,
    prev: null
  },
  currentIndex: 0,
  pager: {
    current: null,
    total: null
  },
  slideBackgrounds: [],
  slideInfos: [],
  slides: []
};

setup();

function init() {
  slider.slides = Array.from(doc.querySelectorAll(".slide"));
  slider.slideInfos = Array.from(doc.querySelectorAll(".slide-info"));
  slider.slideBackgrounds = Array.from(doc.querySelectorAll(".slide__bg"));

  slider.buttons = {
    next: doc.querySelector(".slider--btn__next"),
    prev: doc.querySelector(".slider--btn__prev")
  };

  slider.pager = {
    current: doc.querySelector(".slider--pager__current"),
    total: doc.querySelector(".slider--pager__total")
  };

  slider.currentIndex = 0;

  slider.slides.forEach(function (slide, index) {
    const slideInner = slide.querySelector(".slide__inner");
    const slideInfo = slider.slideInfos[index];
    let slideInfoInner = null;

    if (slideInfo) {
      slideInfoInner = slideInfo.querySelector(".slide-info__inner");
    }

    const targets = [];
    if (slideInner) {
      targets.push(slideInner);
    }
    if (slideInfoInner) {
      targets.push(slideInfoInner);
    }

    if (targets.length > 0) {
      tilt(slide, {target: targets});
    }
  });

  if (slider.pager.total) {
    slider.pager.total.textContent = String(slider.slides.length);
  }

  applySliderState();

  if (slider.buttons.prev) {
    slider.buttons.prev.addEventListener("click", function () {
      handleChange(-1);
    });
  }

  if (slider.buttons.next) {
    slider.buttons.next.addEventListener("click", function () {
      handleChange(1);
    });
  }
}

function setup() {
  const images = Array.from(doc.querySelectorAll("img"));
  const totalImages = images.length;
  let loadedImages = 0;
  const loader = doc.querySelector(".loader");

  if (loader) {
    loader.classList.remove("is-hidden");
  }

  if (totalImages === 0) {
    init();
    if (loader) {
      loader.classList.add("is-hidden");
    }
    return;
  }

  const progress = {
    current: 0,
    target: 0
  };

  images.forEach(function (image) {
    imagesLoaded(image, function (instance) {
      if (instance.isComplete) {
        loadedImages += 1;
        progress.target = loadedImages / totalImages;
      }
    });
  });

  raf.add(function (state) {
    progress.current = lerp(progress.current, progress.target, 0.06);
    const progressPercent = Math.round(progress.current * 100);
    if (progressPercent === 100) {
      init();
      if (loader) {
        loader.classList.add("is-hidden");
      }
      raf.remove(state.id);
    }
  });
}

function handleChange(direction) {
  const total = slider.slides.length;
  if (!total) {
    return;
  }
  slider.currentIndex = (slider.currentIndex + direction + total) % total;
  applySliderState(direction);
}

function resetAttributes(elements) {
  elements.forEach(function (element) {
    if (!element) {
      return;
    }
    element.removeAttribute("data-current");
    element.removeAttribute("data-previous");
    element.removeAttribute("data-next");
  });
}

function setStateAttributes(
  elements,
  currentIndex,
  previousIndex,
  nextIndex
) {
  const currentElement = elements[currentIndex];
  const previousElement = elements[previousIndex];
  const nextElement = elements[nextIndex];

  if (currentElement) {
    currentElement.setAttribute("data-current", "");
  }
  if (previousElement) {
    previousElement.setAttribute("data-previous", "");
  }
  if (nextElement) {
    nextElement.setAttribute("data-next", "");
  }
}

function applySliderState(direction) {
  const currentIndex = slider.currentIndex;
  const slideBackgrounds = slider.slideBackgrounds;
  const slideInfos = slider.slideInfos;
  const slides = slider.slides;

  const total = slides.length;
  if (!total) {
    return;
  }

  let moveDirection = 1;
  if (direction !== undefined) {
    moveDirection = direction;
  }

  const previousIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  resetAttributes(slides);
  resetAttributes(slideInfos);
  resetAttributes(slideBackgrounds);

  setStateAttributes(
    slides,
    currentIndex,
    previousIndex,
    nextIndex
  );
  setStateAttributes(
    slideInfos,
    currentIndex,
    previousIndex,
    nextIndex
  );
  setStateAttributes(
    slideBackgrounds,
    currentIndex,
    previousIndex,
    nextIndex
  );

  slides.forEach(function (slide) {
    if (slide) {
      slide.style.zIndex = "10";
    }
  });

  const currentSlide = slides[currentIndex];
  const previousSlide = slides[previousIndex];
  const nextSlide = slides[nextIndex];

  if (currentSlide) {
    currentSlide.style.zIndex = "30";
  }

  if (previousSlide) {
    if (moveDirection === 1) {
      previousSlide.style.zIndex = "20";
    } else {
      previousSlide.style.zIndex = "15";
    }
  }

  if (nextSlide) {
    if (moveDirection === 1) {
      nextSlide.style.zIndex = "15";
    } else {
      nextSlide.style.zIndex = "20";
    }
  }

  if (slider.pager.current) {
    slider.pager.current.textContent = String(currentIndex + 1);
  }
}