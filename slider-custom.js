const tooltip = document.getElementById('carousel-tooltip');

// Initialize main carousel containers
document.querySelectorAll('.carousel-container').forEach(container => {
    initCarouselContainer(container);
});

// Initialize about carousel containers
document.querySelectorAll('.index-carousel-container').forEach(indexContainer => {
    initindexCarouselContainer(indexContainer);
});

// Initialize normal carousel containers
document.querySelectorAll('.carousel-container-normal').forEach(normalContainer => {
    initNormalCarouselContainer(normalContainer);
});

function initCarouselContainer(container) {
    const carousel = container.querySelector('.main-carousel');
    const totalSlides = container.querySelectorAll('.carousel-cell').length;
    const randomIndex = Math.floor(Math.random() * totalSlides);

    const flkty = new Flickity(carousel, {
        imagesLoaded: true,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
        lazyLoad: 1,
        adaptiveHeight: true,
        groupCells: true,
        initialIndex: randomIndex
    });

    setupTooltip(container, flkty);
    setupStatus(container, flkty, '.carousel-status');
    setupSelectEvent(flkty, container);
}

function initindexCarouselContainer(indexContainer) {
    const indexCarousel = indexContainer.querySelector('.index-carousel');
    const indexFlkty = new Flickity(indexCarousel, {
        imagesLoaded: true,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
        groupCells: true,
        autoPlay: 1000,
        pauseAutoPlayOnHover: false
    });

    indexFlkty.pausePlayer();
    setTimeout(() => indexFlkty.playPlayer(), 1000);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        indexFlkty.pausePlayer();
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => indexFlkty.playPlayer(), 1000);
    });

    const pauseButton = document.querySelector('.index-pause');
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            indexFlkty.pausePlayer();
        });
    }

    setupTooltip(indexContainer, indexFlkty);
    setupStatus(indexContainer, indexFlkty, '.index-carousel-status');
}

function initNormalCarouselContainer(normalContainer) {
    const normalCarousel = normalContainer.querySelector('.main-carousel-normal');
    const normalFlkty = new Flickity(normalCarousel, {
        imagesLoaded: true,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: true,
        lazyLoad: 1,
    });

    setupTooltip(normalContainer, normalFlkty);
    setupStatus(normalContainer, normalFlkty, '.carousel-status-normal');
}

function setupTooltip(container, flkty) {
    const viewport = container.querySelector('.flickity-viewport');

    function updateTooltipDisplay(event) {
        const windowWidth = window.innerWidth;
        const viewportRect = viewport.getBoundingClientRect();
        const mouseX = event.clientX - viewportRect.left;
        const mouseY = event.clientY - viewportRect.top;
        const halfWidth = viewportRect.width / 2;
        const bottomRestriction = 20;

        // Access the currently selected cell for this specific carousel instance
        const currentCell = flkty.selectedElement;
        const isOnlyOne = currentCell && currentCell.classList.contains('only-one');

        // Check if 'only-one' class is present
        if (isOnlyOne) {
            // Hide the tooltip and set cursor to default if 'only-one' is active
            tooltip.style.display = 'none';
            viewport.style.cursor = 'default';
        } else if (mouseY >= 0 && mouseY <= viewportRect.height - bottomRestriction) {
            if (windowWidth > 1024) {
                // Show tooltip and set cursor to none if 'only-one' is not active
                tooltip.textContent = mouseX < halfWidth ? 'Prev' : 'Next';
                tooltip.style.left = `${event.pageX}px`;
                tooltip.style.top = `${event.pageY}px`;
                tooltip.style.display = 'block';
                viewport.style.cursor = 'none';
            } else {
                tooltip.style.display = 'none';
                viewport.style.cursor = 'pointer';
            }
        } else {
            tooltip.style.display = 'none';
            viewport.style.cursor = 'auto';
        }
    }

    // Attach the mousemove event listener to dynamically update tooltip for each carousel
    viewport.addEventListener('mousemove', updateTooltipDisplay);

    // Hide tooltip on mouse leave
    viewport.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        viewport.style.cursor = 'auto';
    });

    viewport.addEventListener('click', event => {
        const viewportRect = viewport.getBoundingClientRect();
        const clickX = event.clientX - viewportRect.left;

        // Remove 'about-on' and 'imprint-on' classes if present, only for specific containers
        if (container.classList.contains('carousel-container') || container.classList.contains('index-carousel-container')) {
            if (document.body.classList.contains('about-on')) {
                document.body.classList.remove('about-on');
                document.body.classList.remove('about-off');
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
        }
        if (clickX < viewportRect.width / 2) {
            flkty.previous();
        } else {
            flkty.next();
        }
    });

    // Listen to Flickity select event to update tooltip and cursor based on the selected cell
    flkty.on('select', () => {
        const currentCell = flkty.selectedElement;
        const isOnlyOne = currentCell && currentCell.classList.contains('only-one');

        if (isOnlyOne) {
            tooltip.style.display = 'none';
            viewport.style.cursor = 'default';
        }
    });
}


// Helper function for status updates
function setupStatus(container, flkty, statusSelector) {
    const statusElement = container.querySelector(statusSelector);

    function updateStatus() {
        const slideNumber = (flkty.selectedIndex + 1).toString().padStart(2, '0');
        const totalSlides = flkty.slides.length.toString().padStart(2, '0');
        statusElement.textContent = `${slideNumber}/${totalSlides}`;
    }

    updateStatus();
    flkty.on('select', updateStatus);
}

// Helper function to handle video selection events
function setupSelectEvent(flkty, container) {
    flkty.on('select', () => {
        if (container.classList.contains('zoomed')) {
            container.querySelectorAll('.carousel-cell .video-select').forEach(video => {
                video.pause();
                video.muted = false;
                video.currentTime = 0;
            });
            const selectedCell = flkty.selectedElement;
            const video = selectedCell.querySelector('.video-select');
            if (video) {
                video.currentTime = 0;
                video.play();
                video.muted = false;
            }
        }
    });
}

/*
function randomizeOnHover() {
    // Check if the device supports hover
    if (window.matchMedia('(hover: hover)').matches) {
        var carouselContainers = document.querySelectorAll('.carousel-container');

        carouselContainers.forEach(function(container) {
            container.addEventListener('mouseenter', function() {
                // Only run if the container does not have the 'zoomed' class
                if (!container.classList.contains('zoomed')) {
                    var carousels = container.querySelectorAll('.main-carousel'); // Get all carousel instances within this container

                    carousels.forEach(function(carousel) {
                        var flkty = Flickity.data(carousel); // Get Flickity instance for each carousel

                        if (flkty) {
                            var totalSlides = flkty.slides.length;
                            var currentIndex = flkty.selectedIndex;

                            // Check if any carousel cell has the 'only-one' class
                            var hasOnlyOneClass = Array.from(flkty.slides).some(slide => 
                                slide.cells.some(cell => cell.element.classList.contains('only-one'))
                            );

                            if (!hasOnlyOneClass) {
                                let randomIndex;

                                // Ensure the random index is not the current index
                                do {
                                    randomIndex = Math.floor(Math.random() * totalSlides);
                                } while (randomIndex === currentIndex);

                                flkty.select(randomIndex);

                                // Update the height of the viewport after randomization
                            }
                        }
                    });
                }
            });
        });
    }
}

// Initialize randomize on hover functionality
randomizeOnHover();

*/