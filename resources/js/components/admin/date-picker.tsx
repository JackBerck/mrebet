import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value?: string | null;
    onChange: (date: string) => void;
    placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pilih tanggal' }: DatePickerProps) {
    // value is expected to be 'YYYY-MM-DD'
    const date = value ? new Date(value) : undefined;

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Format to YYYY-MM-DD for backend
            onChange(format(selectedDate, 'yyyy-MM-dd'));
        } else {
            onChange('');
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal border-[oklch(0.22_0.01_85/8%)] hover:bg-[oklch(0.92_0.02_145)/20%]',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    {date ? format(date, 'd MMMM yyyy', { locale: id }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[oklch(0.22_0.01_85/8%)] shadow-sm" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    locale={id}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
