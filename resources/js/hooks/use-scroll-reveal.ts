import { useEffect, useRef } from 'react';

/**
 * Adds `data-visible="true"` to each target element when it enters the viewport.
 * CSS should handle the actual animation via `data-visible` attribute.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
    options: IntersectionObserverInit = {},
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).dataset.visible = 'true';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px', ...options },
        );

        targets.forEach((t) => observer.observe(t));

        return () => observer.disconnect();
    }, [options]);

    return ref;
}
