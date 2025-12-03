// assets/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer（所有頁面共用）
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Tabs 功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 先清掉全部 active
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // 按鈕本身加 active
                button.classList.add('active');

                // 顯示對應內容
                const target = button.getAttribute('data-target');
                const targetEl = document.getElementById(target);
                if (targetEl) {
                    targetEl.classList.add('active');
                }
            });
        });
    }

    // 3. Smooth Scroll for Navigation Links（只會作用在 href 以 # 開頭的）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70; // 如果有 fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    initIntroCarousel();
});

function initIntroCarousel() {
    const carousel = document.querySelector('.intro-photo-carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const imgElements = carousel.querySelectorAll('.carousel-item img');
    if (!items.length || !imgElements.length) return;

    // 先把原始圖片路徑存起來
    const imageUrls = Array.from(imgElements).map(img => img.getAttribute('src'));
    const total = imageUrls.length;
    let offset = 0; // 控制目前顯示的起點

    const render = (withAnimation = false) => {
        items.forEach((item, i) => {
            const img = item.querySelector('img');
            const index = (i + offset + total) % total;
            img.src = imageUrls[index];

            // 先移除 center / fade
            item.classList.remove('center', 'fade');
        });

        // 中間這個格子當主圖（index 2，0-based）
        const centerItem = items[2];
        if (centerItem) {
            centerItem.classList.add('center');

            if (withAnimation) {
                // 重新觸發動畫（小技巧：強制 reflow）
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
            render(true);   // 帶動畫
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            offset = (offset + 1) % total;
            render(true);   // 帶動畫
        });
    }

    // 初始渲染（不需要動畫）
    render(false);
}

/* ===== Hero Slider ===== */

document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
});

function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");    // list of divs
    const leftBtn = document.querySelector(".hero-arrow.left");
    const rightBtn = document.querySelector(".hero-arrow.right");
    const heroHeader = document.querySelector(".hero.hero-index"); // header in index.html

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
            // Remove all classes that start with "hero-"
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
