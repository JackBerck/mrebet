import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                    <h2 className="font-display text-xl text-(--forest-deep)">
                        Halaman dashboard lama sudah dipindahkan ke{' '}
                        <Link href="/admin/dashboard" className="underline">
                            /admin/dashboard
                        </Link>
                    </h2>
                </div>
            </div>
        </>
    );
}
