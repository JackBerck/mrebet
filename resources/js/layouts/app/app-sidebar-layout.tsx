import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { flash } = usePage<{ flash: { success?: string; error?: string; time?: number } }>()
        .props;
    const lastToastTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!flash) {
            return;
        }

        if (flash.time && lastToastTimeRef.current === flash.time) {
            return;
        }

        if (flash.success) {
            toast.success(flash.success);
            if (flash.time) {
                lastToastTimeRef.current = flash.time;
            }
        } else if (flash.error) {
            toast.error(flash.error);
            if (flash.time) {
                lastToastTimeRef.current = flash.time;
            }
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster richColors position="top-right" />
        </AppShell>
    );
}
