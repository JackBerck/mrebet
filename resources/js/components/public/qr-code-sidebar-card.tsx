import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QrCodeModal } from '@/components/common/qr-code-modal';

interface QrCodeSidebarCardProps {
    title: string;
    category?: string;
    targetUrl: string;
    slug?: string;
}

export function QrCodeSidebarCard({
    title,
    category,
    targetUrl,
    slug = 'qr-code',
}: QrCodeSidebarCardProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-2xl p-5 border border-(--line) shadow-sm text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-(--forest-deep) uppercase tracking-wider mb-3">
                    <QrCode className="w-4 h-4 text-(--forest)" />
                    QR Code Halaman Ini
                </div>

                <div
                    onClick={() => setModalOpen(true)}
                    className="group relative cursor-pointer inline-block p-3 bg-(--cream-warm) rounded-xl border border-(--line) transition-all hover:border-(--forest) hover:shadow-sm"
                >
                    <QRCodeCanvas
                        value={targetUrl}
                        size={130}
                        level="M"
                        includeMargin={false}
                        className="mx-auto"
                    />
                    <div className="absolute inset-0 bg-(--forest-deep)/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-xs font-semibold text-(--forest-deep) gap-1">
                        <Maximize2 className="w-4 h-4" />
                        Perbesar
                    </div>
                </div>

                <p className="text-[11px] text-(--charcoal-soft) mt-2 mb-3">
                    Pindai untuk membagikan atau menyimpan tautan di ponsel.
                </p>

                <Button
                    variant="outline"
                    onClick={() => setModalOpen(true)}
                    className="w-full text-xs font-semibold border-(--line) hover:bg-(--cream-warm) hover:text-(--forest) rounded-xl"
                >
                    <QrCode className="w-3.5 h-3.5 mr-1.5" />
                    Buka & Download QR Code
                </Button>
            </div>

            <QrCodeModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title={title}
                category={category}
                targetUrl={targetUrl}
                slug={slug}
            />
        </>
    );
}
