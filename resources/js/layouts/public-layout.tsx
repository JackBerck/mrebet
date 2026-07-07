import PublicFooter from '@/components/public/public-footer';
import PublicNavbar from '@/components/public/public-navbar';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PublicNavbar />
            {children}
            <PublicFooter />
        </>
    );
}
