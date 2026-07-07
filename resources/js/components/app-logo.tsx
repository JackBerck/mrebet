import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-auto shrink-0 object-contain"
            />
            <div className="ml-2 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="truncate font-display text-2xl leading-tight font-semibold">
                    Mrebet
                </span>
                <span className="truncate font-display text-sm leading-tight">
                    E-Desa Digital
                </span>
            </div>
        </>
    );
}
