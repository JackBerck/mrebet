import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Compass,
    FileText,
    LayoutDashboard,
    MapPin,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, User } from '@/types';

import admin from '@/routes/admin';

function getAdminNavItems(user: User | null | undefined): NavItem[] {
    if (!user) {
return [];
}

    const base: NavItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard().url,
            icon: LayoutDashboard,
        },
    ];

    if (user.role === 'admin') {
        return [
            ...base,
            { title: 'Desa', href: admin.villages.index().url, icon: MapPin },
            { title: 'Destinasi', href: admin.destinations.index().url, icon: Compass },
            { title: 'Event', href: admin.events.index().url, icon: CalendarDays },
            { title: 'Blog', href: admin.blogs.index().url, icon: FileText },
            { title: 'Pengguna', href: '/admin/users', icon: Users },
        ];
    }

    // Manager — link langsung ke edit desanya sendiri
    // Asumsikan user object yang dikirim dari HandleInertiaRequests punya data village
    // Jika tidak ada data village di user, mungkin perlu fallback.
    // Wait, let's use `auth.user.village?.slug`.
    return [
        ...base,
        {
            title: 'Desa Saya',
            href: admin.villages.index().url,
            icon: MapPin,
        },
        { title: 'Destinasi', href: admin.destinations.index().url, icon: Compass },
        { title: 'Event', href: admin.events.index().url, icon: CalendarDays },
        { title: 'Blog', href: admin.blogs.index().url, icon: FileText },
    ];
}

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const mainNavItems = getAdminNavItems(user);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
