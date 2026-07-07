import { inView, animate } from 'motion';
import { useEffect } from 'react';

export function useMotionReveal() {
    useEffect(() => {
        // Find all elements with data-reveal attribute
        const elements = document.querySelectorAll('[data-reveal]');
        
        // Hide them initially
        elements.forEach((el) => {
            (el as HTMLElement).style.opacity = '0';
            (el as HTMLElement).style.transform = 'translateY(30px)';
        });

        // Use motion's inView to animate them when they enter the viewport
        const stop = inView('[data-reveal]', (element) => {
            const isStaggered = element.hasAttribute('data-reveal-stagger');
            
            if (isStaggered) {
                // If the element is a container for staggered children
                const children = Array.from(element.children);
                animate(
                    children,
                    { opacity: [0, 1], y: [30, 0] },
                    { 
                        duration: 0.6, 
                        delay: (index) => index * 0.1,
                        ease: [0.22, 1, 0.36, 1] 
                    }
                );
                // Reveal the container itself instantly
                (element as HTMLElement).style.opacity = '1';
                (element as HTMLElement).style.transform = 'none';
            } else {
                // Standard reveal
                animate(
                    element,
                    { opacity: [0, 1], y: [30, 0] },
                    { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                );
            }
        }, { margin: "-10%" });

        return () => {
            stop();
        };
    }, []);
}
