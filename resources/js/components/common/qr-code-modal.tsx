import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QrCodeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    category?: string;
    targetUrl: string;
    slug?: string;
}

export function QrCodeModal({
    open,
    onOpenChange,
    title,
    category,
    targetUrl,
    slug = 'qr-code',
}: QrCodeModalProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (!canvas) {
            toast.error('Gagal membuat gambar QR Code.');
            return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode-${slug}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Gambar QR Code berhasil diunduh!');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[92vw] max-w-[360px] max-h-[85vh] overflow-y-auto bg-white p-4 sm:p-5 rounded-2xl border border-(--line) shadow-lg font-sans [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <DialogHeader className="text-center sm:text-center pb-0 space-y-1">
                    <div className="mx-auto w-10 h-10 rounded-full bg-(--forest-mist) text-(--forest) flex items-center justify-center mb-1">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <DialogTitle className="font-display text-base sm:text-lg font-bold text-(--forest-deep) leading-snug line-clamp-2">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-(--charcoal-soft)">
                        {category && <span className="font-semibold text-(--forest)">{category} • </span>}
                        Desa Serayu Larangan
                    </DialogDescription>
                </DialogHeader>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center my-2 p-3 sm:p-4 bg-(--cream-warm) rounded-xl border border-(--line)">
                    <div ref={canvasRef} className="p-2 bg-white rounded-lg shadow-2xs border border-neutral-100">
                        <QRCodeCanvas
                            value={targetUrl}
                            size={160}
                            level="H"
                            includeMargin={true}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                        />
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-(--charcoal-soft) font-medium text-center mt-2">
                        Pindai dengan kamera HP untuk membuka halaman detail.
                    </p>
                </div>

                {/* Single Download Action Button */}
                <Button
                    onClick={handleDownload}
                    className="w-full bg-(--forest) hover:bg-(--forest-deep) text-white font-semibold flex items-center justify-center gap-2 py-4 rounded-xl shadow-2xs text-xs sm:text-sm"
                >
                    <Download className="w-4 h-4" />
                    Download QR Code (PNG)
                </Button>
            </DialogContent>
        </Dialog>
    );
}
