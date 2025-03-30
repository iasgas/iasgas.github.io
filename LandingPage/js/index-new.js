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

const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

function addZoomedClassToRandomCarousel() {
  if (!document.body.classList.contains("overview-full") && 
      !document.body.classList.contains("body-zoomed")) { 
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
const observer = new MutationObserver(mutations => {
  let shouldRun = false;
  mutations.forEach(mutation => {
    if (mutation.attributeName === "class") {
      shouldRun = true;
    }
  });
  if (shouldRun) {
    addZoomedClassToRandomCarousel();
  }
});
observer.observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: false });

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

function toggleTooltipPlay() {
  const carousels = document.querySelectorAll(".main-carousel");
  const tooltip = document.getElementById("tooltip-play");
  if (!carousels.length || !tooltip) return;
  const deviceSupportsHover = window.matchMedia("(hover: hover)").matches;
  function updateTooltipPosition(event) {
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
  }
  function updateTooltipDisplay(event, video) {
      if (event.type === "mousemove" && video.paused) {
          updateTooltipPosition(event);
          tooltip.style.display = "block";
          if (deviceSupportsHover) {
              video.style.cursor = "none";
          }
      } else {
          tooltip.style.display = "none";
          video.style.cursor = "auto";
      }
  }

  carousels.forEach(carousel => {
      const videos = carousel.querySelectorAll(".video-select");
      if (!videos.length) return;

      videos.forEach(video => {
          video.addEventListener("mousemove", event => updateTooltipDisplay(event, video));
          
          video.addEventListener("mouseleave", () => {
              tooltip.style.display = "none";
              video.style.cursor = "auto";
          });
          
          video.addEventListener("play", () => {
              tooltip.style.display = "none";
              video.style.cursor = "auto";
          });
          
          video.addEventListener("click", () => {
              if (video.paused) {
                  video.play();
              }
          });
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function updateVideoControls() {
    document.querySelectorAll('.project-section').forEach(project => {
      const videoControls = project.querySelector('.video-controls');
      if (!videoControls) return;
      videoControls.classList.remove('show-controls'); // Hide controls by default
      const selectedCell = project.querySelector('.zoomed .carousel-cell.is-selected');
      const videoElement = selectedCell ? selectedCell.querySelector('.video-show-controls') : null;
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
  toggleTooltipPlay()

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

  function updateFullVideoControls() {
    document.querySelectorAll('.project-section').forEach(project => {
      const fullVideoControls = project.querySelector('.full-video-controls');
      if (!fullVideoControls) return;
      const selectedCell = project.querySelector('.zoomed .carousel-cell.is-selected');
      const videoElement = selectedCell ? selectedCell.querySelector('.full-video') : null;
      if (videoElement) {
        fullVideoControls.classList.add('show-controls');
        const videoClassList = Array.from(videoElement.classList);
        const lastClassName = videoClassList.length > 0 ? videoClassList[videoClassList.length - 1] : null;
        if (lastClassName) {
          fullVideoControls.querySelectorAll(".full-video-controls *").forEach(el => {
            el.style.display = "none";
          });
          const linkElement = fullVideoControls.querySelector(`.${lastClassName}`);
          if (linkElement) {
            linkElement.style.display = 'flex';
          }
        }
      } else {
        fullVideoControls.classList.remove('show-controls');
      }
    });
  }

  updateFullVideoControls();
  document.addEventListener('click', updateFullVideoControls);
  const observerFullVideo = new MutationObserver(() => {
    updateFullVideoControls();
  });
  document.querySelectorAll('.carousel-cell').forEach(cell => {
    observerFullVideo.observe(cell, { attributes: true, attributeFilter: ['class'] });
  });
  document.querySelectorAll('.carousel-container').forEach(container => {
    observerFullVideo.observe(container, { attributes: true, attributeFilter: ['class'] });
  });
  window.addEventListener('beforeunload', () => {
    observerFullVideo.disconnect();
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
      if (document.body.classList.contains('about-off')) {
        setTimeout(() => {
          document.querySelectorAll(".about-imprint-container").forEach(container => {
            scrollToTop(container);
          });
        }, 710);
      }
    });
  });

  document.querySelectorAll('.inactive-link').forEach(inactiveLinkToggle => {
    inactiveLinkToggle.addEventListener('click', () => {
      if (document.body.classList.contains('about-on')) {
        document.body.classList.remove('about-on');
        document.body.classList.add('about-off');
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
        document.querySelectorAll('.carousel-cell .video-select').forEach(video => {
          video.muted = true;  
          if (video.paused) {
            video.play().catch(() => {});  
          }
        });
        const selectedCell = carouselContainer.querySelector('.carousel-cell.is-selected');
        const video = selectedCell?.querySelector('.video-select');
        if (video) {
          video.muted = false;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {}); 
          }
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
            if (video.paused) {
                video.play();
            }
        });
        const carouselContainer = document.querySelector('.carousel-container.zoomed');
        if (carouselContainer) {
            carouselContainer.classList.remove('zoomed', 'show-info');
            carouselContainer.classList.add('hide-info');
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

