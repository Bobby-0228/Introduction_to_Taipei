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
});
