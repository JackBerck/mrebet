import { Badge } from '@/components/ui/badge';

export type StatusBadgeProps = {
    status: 'draft' | 'published';
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return status === 'published' ? (
        <Badge className="border-0 bg-(--forest-mist) text-(--forest-deep) hover:bg-(--forest-mist)">
            Terbit
        </Badge>
    ) : (
        <Badge variant="secondary">Draft</Badge>
    );
}
