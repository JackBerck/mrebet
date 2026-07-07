import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');
        const path = `./pages/${name}.tsx`;
        const match = pages[path];

        if (!match) {
            const key = Object.keys(pages).find(
                (k) => k.toLowerCase() === path.toLowerCase(),
            );

            if (key) {
                return resolvePageComponent(key, pages);
            }
        }

        return resolvePageComponent(path, pages);
    },
    layout: (name) => {
        switch (true) {
            case name === 'home':
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    setup({ el, App, props }) {
        if (import.meta.env.VITE_SSR_IS_ACTIVE) {
            hydrateRoot(el, <App {...props} />);

            return;
        }

        createRoot(el).render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
            </TooltipProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
