document.addEventListener('DOMContentLoaded', () => {
    const includes = Array.from(document.querySelectorAll('[data-include]'));
    includes.forEach(async placeholder => {
        const src = placeholder.getAttribute('data-include');
        try {
            const res = await fetch(src);
            if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
            const html = await res.text();
            placeholder.insertAdjacentHTML('afterend', html);
            placeholder.remove();
        } catch (err) {
            console.error(err);
        }
    });
});