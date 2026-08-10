import { Link } from '@inertiajs/react';
import type { ElementType } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export type StatCardProps = {
    label: string;
    value: number;
    icon: ElementType;
    sub?: string;
    href?: string;
};

export function StatCard({ label, value, icon: Icon, sub, href }: StatCardProps) {
    const content = (
        <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--forest-mist) text-(--forest)">
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-center">
                <p className="text-3xl font-bold text-[oklch(0.22_0.01_85)] tabular-nums">
                    {value}
                </p>
                <p className="text-sm text-(--charcoal-soft)">{label}</p>
                {sub && (
                    <p className="mt-0.5 text-xs text-(--charcoal-soft)">
                        {sub}
                    </p>
                )}
            </div>
        </CardContent>
    );

    return (
        <Card className="border-(--line) shadow-none transition-shadow hover:shadow-md">
            {href ? <Link href={href}>{content}</Link> : content}
        </Card>
    );
}
