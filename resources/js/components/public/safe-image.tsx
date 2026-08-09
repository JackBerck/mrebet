import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    alt: string;
    fallbackIcon: LucideIcon;
    iconClassName?: string;
    containerClassName?: string;
}

export function SafeImage({
    src,
    alt,
    fallbackIcon: FallbackIcon,
    iconClassName = 'w-12 h-12',
    containerClassName = 'w-full h-full flex items-center justify-center bg-(--forest-mist)/30 text-(--forest)/40',
    className = 'w-full h-full object-cover',
    ...props
}: SafeImageProps) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={containerClassName}>
                <FallbackIcon className={iconClassName} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
