/// Helper functions
const scrollToTop = (element, delay = 650) => {
  setTimeout(() => {
    element.scrollTop = 0;
  }, delay);
};

const toggleMuteVideo = (selector, mute) => {
  document.querySelectorAll(selector).forEach(video => {
    if (video) video.muted = mute;
  });
};

// Set viewport height CSS variable
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

function adjustVideoControlsPadding() {
  const modeClickElement = document.querySelector('.mode-click');
  if (modeClickElement) {
    const paddingRight = `${modeClickElement.offsetWidth}px`;
    document.documentElement.style.setProperty('--video-controls-padding-right', paddingRight);
  }
}

// Call the function to set the padding variable initially
adjustVideoControlsPadding();
window.addEventListener('resize', adjustVideoControlsPadding);

// Isotope-like functionality
function addZoomedClassToRandomCarousel() {
  if (!document.body.classList.contains("overview-full")) {
    const visibleContainers = Array.from(document.querySelectorAll('.carousel-container')).filter(container => {
      return window.getComputedStyle(container).display !== 'none';
    });
    if (visibleContainers.length > 0) {
      const randomIndex = Math.floor(Math.random() * visibleContainers.length);
      visibleContainers[randomIndex].classList.add('zoomed');
    }
    document.body.classList.add('body-zoomed');
  }
}
addZoomedClassToRandomCarousel();

function updateMediaObjectFit() {
  document.querySelectorAll(".main-carousel").forEach(mainCarousel => {
    const selectedCell = mainCarousel.querySelector(".carousel-cell.is-selected");
    if (!selectedCell) return;

    const media = selectedCell.querySelector("img, video");
    if (!media) return;

    const setObjectFit = () => {
      const containerAspectRatio = mainCarousel.clientWidth / mainCarousel.clientHeight;
      const mediaAspectRatio = media.tagName === "VIDEO" ? media.videoWidth / media.videoHeight : media.naturalWidth / media.naturalHeight;

      if (containerAspectRatio >= mediaAspectRatio * 0.87 && containerAspectRatio <= mediaAspectRatio * 1.12) {
        media.style.objectFit = "cover";
        media.style.setProperty("object-position", "center", "important");
      } else {
        media.style.objectFit = "";
        media.style.objectPosition = "";
      }
    };

    const event = media.tagName === "VIDEO" ? "loadedmetadata" : "load";
    media.addEventListener(event, setObjectFit);
    if (media.complete || (media.readyState >= 1)) setObjectFit();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function updateVideoControls() {
    document.querySelectorAll('.project-section').forEach(project => {
      const videoControls = project.querySelector('.video-controls');
      if (!videoControls) return;

      videoControls.classList.remove('show-controls'); // Hide controls by default

      const selectedCell = project.querySelector('.zoomed .carousel-cell.is-selected');
      const videoElement = selectedCell ? selectedCell.querySelector('.video-select') : null;

      if (videoElement) {
        videoControls.classList.add('show-controls');

        videoControls.querySelectorAll('button').forEach(button => {
          const newButton = button.cloneNode(true);
          button.replaceWith(newButton);
        });

        const playPauseButton = videoControls.querySelector('.play-pause');
        const updatePlayPauseButton = () => {
          playPauseButton.textContent = videoElement.paused ? 'Play' : 'Pause';
        };
        playPauseButton.addEventListener('click', () => {
          videoElement.paused ? videoElement.play() : videoElement.pause();
          updatePlayPauseButton();
        });
        videoElement.addEventListener('play', updatePlayPauseButton);
        videoElement.addEventListener('pause', updatePlayPauseButton);
        updatePlayPauseButton();

        const muteUnmuteButton = videoControls.querySelector('.mute-unmute');
        const updateMuteUnmuteButton = () => {
          muteUnmuteButton.textContent = videoElement.muted ? 'Unmute' : 'Mute';
        };
        muteUnmuteButton.addEventListener('click', () => {
          videoElement.muted = !videoElement.muted;
          updateMuteUnmuteButton();
        });
        videoElement.addEventListener('volumechange', updateMuteUnmuteButton);
        updateMuteUnmuteButton();

        const fullscreenButton = videoControls.querySelector('.fullscreen');
        fullscreenButton.addEventListener('click', () => {
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
          } else if (videoElement.webkitEnterFullscreen) {
            videoElement.webkitEnterFullscreen();
          } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen();
          }
        });

        const currentTimeDisplay = videoControls.querySelector('.current-time');
        const progressBar = videoControls.querySelector('.progress-bar');
        const updateProgress = () => {
          if (videoElement.duration) {
            const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            const minutes = Math.floor(videoElement.currentTime / 60).toString().padStart(2, '0');
            const seconds = Math.floor(videoElement.currentTime % 60).toString().padStart(2, '0');
            currentTimeDisplay.textContent = `${minutes}:${seconds}`;
          }
          requestAnimationFrame(updateProgress);
        };
        requestAnimationFrame(updateProgress);

        const progressBarContainer = videoControls.querySelector('.progress-container');
        progressBarContainer.addEventListener('click', (e) => {
          const rect = progressBarContainer.getBoundingClientRect();
          const clickPosition = e.clientX - rect.left;
          const clickRatio = clickPosition / rect.width;
          const newTime = clickRatio * videoElement.duration;
          if (!isNaN(newTime)) videoElement.currentTime = newTime;
        });
      }
    });
  }

  updateVideoControls();

  const observerVideo = new MutationObserver(() => {
    updateVideoControls();
  });

  document.querySelectorAll('.carousel-cell').forEach(cell => {
    observerVideo.observe(cell, { attributes: true, attributeFilter: ['class'] });
  });
  document.querySelectorAll('.carousel-container').forEach(container => {
    observerVideo.observe(container, { attributes: true, attributeFilter: ['class'] });
  });

  window.addEventListener('beforeunload', () => {
    observerVideo.disconnect();
  });

  updateMediaObjectFit();

  document.addEventListener('click', (e) => {
    // Check if the clicked element or its ancestor has the class 'link-click'
    const link = e.target.closest('.link-click');
  
    if (link && link.tagName === 'A') {
      // Prevent the default action
      e.preventDefault();
  
      // Add the page transition class to the body
      document.body.classList.add('page-transition');
  
      // Wait 800ms, then navigate to the link's href
      setTimeout(() => {
        window.location.href = link.href;
      }, 800);
    }
  });
  
  document.querySelectorAll('.menu-click').forEach(menuClick => {
    menuClick.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        document.body.classList.toggle('menu-on');
        document.body.classList.toggle('menu-off');
      }
    });
  });

  document.querySelectorAll('.about-toggle').forEach(aboutToggle => {
    aboutToggle.addEventListener('click', () => {
      if (document.body.classList.contains('about-on')) {
        document.body.classList.remove('about-on');
        document.body.classList.add('about-off');
      } else {
        document.body.classList.remove('about-off');
        document.body.classList.add('about-on');
      }
      if (document.body.classList.contains('imprint-on')) {
        setTimeout(() => {
          document.body.classList.remove('imprint-on');
        }, 710);
      }
      document.body.classList.remove('menu-on');
      document.body.classList.add('menu-off');
      if (document.body.classList.contains('about-off')) {
        setTimeout(() => {
          document.querySelectorAll(".about-imprint-container").forEach(container => {
            scrollToTop(container);
          });
        }, 710);
      }
    });
  });

  document.querySelectorAll('.imprint-click').forEach(imprintClick => {
    imprintClick.addEventListener('click', () => {
      document.body.classList.add('imprint-on');
    });
  });

  document.querySelectorAll('.info-click').forEach(infoClick => {
    infoClick.addEventListener('click', function() {
      const parentContainer = this.closest('.carousel-container');
      document.querySelectorAll('.carousel-container').forEach(container => {
        if (container !== parentContainer) {
          container.classList.remove('show-info');
        }
      });
      parentContainer.classList.toggle('show-info');
    });
  });

  document.querySelectorAll('.mode-click').forEach(modeClick => {
    modeClick.addEventListener('click', () => {
      document.body.classList.toggle('mode-dark');
      document.body.classList.toggle('mode-light');
    });
  });

  if (window.matchMedia("(hover: hover)").matches) {
    const modeClick = document.querySelector('.mode-click');
  
    // Check if modeClick exists before adding event listeners
    if (modeClick) {
      modeClick.addEventListener('mouseenter', () => {
        document.body.classList.add('mode-hover');
      });
      modeClick.addEventListener('mouseleave', () => {
        document.body.classList.remove('mode-hover');
      });
    }
  
    document.querySelectorAll(".carousel-container").forEach(carouselContainer => {
      let hoverTimeout;
  
      const handleMouseEnter = () => {
        if (!document.body.classList.contains("overview-full")) {
          if (!carouselContainer.classList.contains("zoomed")) {
            document.body.classList.add("overview-on");
            document.body.classList.remove("overview-off");
  
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
              carouselContainer.addEventListener("mouseenter", handleMouseEnter);
              carouselContainer.addEventListener("mouseleave", handleMouseLeave);
            }, 0);
          }
        }
        if (document.body.classList.contains("about-on")) {
          document.body.classList.add("about-hover");
        }
      };
  
      const handleMouseLeave = () => {
        if (!document.body.classList.contains("overview-full")) {
          if (!carouselContainer.classList.contains("zoomed")) {
            document.body.classList.remove("overview-on");
            document.body.classList.add("overview-off");
  
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
              carouselContainer.addEventListener("mouseenter", handleMouseEnter);
              carouselContainer.addEventListener("mouseleave", handleMouseLeave);
            }, 0);
          }
        }
        document.body.classList.remove("about-hover");
      };
  
      carouselContainer.addEventListener("mouseenter", handleMouseEnter);
      carouselContainer.addEventListener("mouseleave", handleMouseLeave);
    });
  }
  
  document.querySelectorAll('.carousel-container').forEach(carouselContainer => {
    carouselContainer.addEventListener('click', () => {
      if (!carouselContainer.classList.contains('zoomed')) {
        if (document.body.classList.contains('about-on')) {
            document.body.classList.remove('about-on');
            document.body.classList.add('about-off');
            setTimeout(() => {
                document.querySelectorAll(".about-imprint-container").forEach(container => {
                scrollToTop(container);
                });
            }, 710);
        }
        if (document.body.classList.contains('imprint-on')) {
            setTimeout(() => {
              document.body.classList.remove('imprint-on');
            }, 710);
        }   
        if (!document.body.classList.contains('overview-full')) {
          document.querySelectorAll('.carousel-container').forEach(el => {
            const blurProject = el.querySelector('.blur-project');
            if (blurProject) {
              blurProject.style.transition = 'none';
              setTimeout(() => blurProject.style.transition = '', 10);
            }
            el.style.transition = 'none';
            el.classList.remove('show-info', 'zoomed');
            setTimeout(() => el.style.transition = '', 10);
          });
        }

        document.body.classList.add('body-zoomed');
        carouselContainer.classList.add('zoomed');
        carouselContainer.classList.add('gallery-transform');
        setTimeout(() => carouselContainer.classList.remove('gallery-transform'), 10);

        document.querySelectorAll('.carousel-cell .video-select').forEach(video => video.muted = true);

        const selectedCell = carouselContainer.querySelector('.carousel-cell.is-selected');
        const video = selectedCell?.querySelector('.video-select');
        if (video) {
          video.muted = false;
          if (video.paused) video.play();
        }

        carouselContainer.style.transition = 'none';
        setTimeout(() => carouselContainer.style.transition = '', 10);

        updateMediaObjectFit();
      }
    });
  });

  document.querySelectorAll('.zoom-click').forEach(zoomClick => {
    zoomClick.addEventListener('click', (event) => {
      event.stopPropagation();
      document.body.classList.remove('body-zoomed');
      document.querySelectorAll('.carousel-cell .video-select').forEach(video => {
        video.muted = true;
      });
      const carouselContainer = document.querySelector('.carousel-container.zoomed');
      if (carouselContainer) {
        carouselContainer.classList.remove('zoomed', 'show-info');
        carouselContainer.classList.add('hide-info');
      }
    });
  });

  let menuHoverTimeout;
  document.querySelectorAll('.menu-button-hover').forEach(menuButton => {
    menuButton.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024) {
        clearTimeout(menuHoverTimeout);
        document.body.classList.remove('menu-off');
        document.body.classList.add('menu-on');
      }
    });

    menuButton.addEventListener('mouseleave', () => {
      if (window.innerWidth > 1024) {
        menuHoverTimeout = setTimeout(() => {
          document.body.classList.remove('menu-on');
          document.body.classList.add('menu-off');
        }, 1);
      }
    });
  });

  document.querySelectorAll('.main-carousel').forEach(carousel => {
    const flickityInstance = new Flickity(carousel);
    flickityInstance.on('select', updateMediaObjectFit);
  });

  const observer = new MutationObserver(updateMediaObjectFit);
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) observer.observe(carouselContainer, { attributes: true, attributeFilter: ["style", "class"], childList: true, subtree: true });
});

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

const disableAllTransitions = () => {
  if (!document.getElementById('disable-transitions')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'disable-transitions';
    styleElement.innerHTML = `* { transition: none !important; }`;
    document.head.appendChild(styleElement);
  }
};

const restoreTransitions = () => {
  const styleElement = document.getElementById('disable-transitions');
  if (styleElement) styleElement.remove();
};

window.addEventListener('resize', () => {
  disableAllTransitions();
  setTimeout(restoreTransitions, 500);
});

window.addEventListener("load", updateMediaObjectFit); 
window.addEventListener("resize", updateMediaObjectFit);
