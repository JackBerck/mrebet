export default function AppLogo() {
    return (
        <>
            <img
                src="/logo.png"
                alt="Logo Serayu Larangan"
                className="h-10 w-auto shrink-0 object-contain"
            />
            <div className="ml-2.5 grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate font-display text-lg font-bold leading-tight text-white">
                    Serayu Larangan
                </span>
                <span className="truncate text-xs leading-tight text-white/70">
                    Desa Wisata Digital
                </span>
            </div>
        </>
    );
}
