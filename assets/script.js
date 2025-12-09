// assets/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer（shared in all pages）
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Tabs 
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active from all buttons & panels
                // (Tabs are mutually exclusive: only one can be active at a time)
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // button itself should be active
                button.classList.add('active');

                // content active
                const target = button.getAttribute('data-target');
                const targetEl = document.getElementById(target);
                if (targetEl) {
                    targetEl.classList.add('active');
                }
            });
        });
    }

    // 3. Smooth Scroll for Navigation Links on index page（apply only on href starting with #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // get ID and element of the target
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {//is navbar
                const headerOffset = 70; // height of fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Scroll to target smoothly
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    initIntroCarousel();
});


/* ===== Carousel ===== */
/* Control the Carouosel image display on sight pages */

function initIntroCarousel() {
    const carousel = document.querySelector('.intro-photo-carousel');//not navbar
    if (!carousel) return;//is navbar

    const items = carousel.querySelectorAll('.carousel-item');
    const imgElements = carousel.querySelectorAll('.carousel-item img');
    if (!items.length || !imgElements.length) return;

    // Save original image path
    const imageUrls = Array.from(imgElements).map(img => img.getAttribute('src'));
    const total = imageUrls.length;
    let offset = 0; // current start

    const render = (withAnimation = false) => {
        items.forEach((item, i) => {
            const img = item.querySelector('img');
            const index = (i + offset + total) % total;
            img.src = imageUrls[index];

            // remove center / fade
            item.classList.remove('center', 'fade');
        });

        // set the central one as the main image（index 2，0-based）
        const centerItem = items[2];
        if (centerItem) {
            centerItem.classList.add('center');

            if (withAnimation) {
                // re-trigger animation（tips: force reflow）
                centerItem.classList.remove('fade');
                void centerItem.offsetWidth;
                centerItem.classList.add('fade');
            }
        }
    };

    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            offset = (offset - 1 + total) % total;
            render(true);   // with animation
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            offset = (offset + 1) % total;
            render(true);   // with animation
        });
    }

    // Initial render（w/o animation）
    render(false);
}

/* ===== Hero Slider ===== */
/* Control the hero slide on index.html */

document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
});

function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");    // list of divs
    const leftBtn = document.querySelector(".hero-arrow.left");
    const rightBtn = document.querySelector(".hero-arrow.right");
    const heroHeader = document.querySelector(".hero.hero-index"); // header in index.html

    // Early Return: If hero does not exist on this page, skip initialization.
    // (Prevents errors when script.js is reused in sub-pages)
    if (!slides.length || !heroHeader) return;

    // Current slide index
    let index = 0;

    // Core func.: show the slide at index i
    function showSlide(i) {
        // Remove class "active" from all slides
        slides.forEach(s => s.classList.remove("active"));
        // add "active" for current slide
        slides[i].classList.add("active");

        // Read "data-bg-class" from current slide
        const bgClass = slides[i].dataset.bgClass;

        // Apply "data-bg-class" to header (change header background)
        if (bgClass) {
            // Remove old hero background class (hero-xxx)
            // so the header shows the background that matches the current slide
            Array.from(heroHeader.classList)
                .filter(cls => cls.startsWith("hero-"))
                .forEach(cls => heroHeader.classList.remove(cls));

            // Add new background class
            heroHeader.classList.add(bgClass);
        }
    }

    leftBtn.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });

    rightBtn.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });

    // Auto-slide every 6 seconds
    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 6000);

    // Touch swipe on mobile
    let startX = 0;
    const slider = document.querySelector(".hero-slider");
    if (slider) {
        slider.addEventListener("touchstart", e => startX = e.touches[0].clientX);
        slider.addEventListener("touchend", e => {
            let endX = e.changedTouches[0].clientX;
            if (endX - startX > 50) leftBtn.click();
            if (startX - endX > 50) rightBtn.click();
        });
    }

    // Initial Render
    showSlide(index);
}
