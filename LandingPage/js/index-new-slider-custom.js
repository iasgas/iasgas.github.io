const tooltip = document.getElementById('carousel-tooltip');

document.querySelectorAll('.carousel-container').forEach(container => {
    initCarouselContainer(container);
});

document.querySelectorAll('.index-carousel-container').forEach(indexContainer => {
    initindexCarouselContainer(indexContainer);
});

document.querySelectorAll('.carousel-container-normal').forEach(normalContainer => {
    initNormalCarouselContainer(normalContainer);
});

function initCarouselContainer(container) {
    const carousel = container.querySelector('.main-carousel');
    const totalSlides = container.querySelectorAll('.carousel-cell').length;
    const flkty = new Flickity(carousel, {
        imagesLoaded: true,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
        lazyLoad: 1,
        adaptiveHeight: false,
    });
    setupTooltip(container, flkty);
    setupStatus(container, flkty, '.carousel-status');
    setupSelectEvent(flkty, container);
}

function initindexCarouselContainer(indexContainer) {
    const indexCarousel = indexContainer.querySelector('.index-carousel');
    const images = indexCarousel.querySelectorAll('img');
    const totalImages = images.length;
    let loadedImages = 0;
    const indexFlkty = new Flickity(indexCarousel, {
        imagesLoaded: true,
        percentPosition: false,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
        groupCells: true,
        autoPlay: false,
        pauseAutoPlayOnHover: false,
        lazyLoad: 1,
    });

    function checkImagesLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            setTimeout(() => {
                indexFlkty.options.autoPlay = 1000;
                indexFlkty.playPlayer();
            }, 10);
        }
    }

    images.forEach(img => {
        if (img.complete) {
            checkImagesLoaded();
        } else {
            img.addEventListener('load', checkImagesLoaded);
            img.addEventListener('error', checkImagesLoaded);
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        indexFlkty.pausePlayer();
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => indexFlkty.playPlayer(), 1000);
    });

    let restartTimeout;
    indexCarousel.addEventListener('click', () => {
        indexFlkty.pausePlayer();
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => indexFlkty.playPlayer(), 5000);
    });

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

    setupTooltip(normalContainer, normalFlkty, 20);
    setupStatus(normalContainer, normalFlkty, '.carousel-status-normal');
}

function setupTooltip(container, flkty, bottomRestriction = 0) {
    const viewport = container.querySelector('.flickity-viewport');
    const deviceSupportsHover = window.matchMedia('(hover: hover)').matches;

    function updateTooltipDisplay(event) {
        const viewportRect = viewport.getBoundingClientRect();
        const mouseX = event.clientX - viewportRect.left;
        const mouseY = event.clientY - viewportRect.top;
        const halfWidth = viewportRect.width / 2;

        const currentCell = flkty.selectedElement;
        const isOnlyOne = currentCell && currentCell.classList.contains('only-one');

        if (isOnlyOne) {
            tooltip.style.display = 'none';
            viewport.style.cursor = 'default';
        } else if (mouseY >= 0 && mouseY <= viewportRect.height - bottomRestriction) {
            if (deviceSupportsHover) {
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

    viewport.addEventListener('mousemove', updateTooltipDisplay);
    viewport.addEventListener('mouseenter', updateTooltipDisplay);
    viewport.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        // viewport.style.cursor = 'auto';
    });
    
    viewport.addEventListener('click', event => {
        const viewportRect = viewport.getBoundingClientRect();
        const clickX = event.clientX - viewportRect.left;

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

    flkty.on('select', () => {
        const currentCell = flkty.selectedElement;
        const isOnlyOne = currentCell && currentCell.classList.contains('only-one');

        if (isOnlyOne) {
            tooltip.style.display = 'none';
            viewport.style.cursor = 'default';
        }
    });
}

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
