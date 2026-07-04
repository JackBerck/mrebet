import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TimePickerProps {
    id?: string;
    value?: string; // HH:mm format
    onChange?: (time: string) => void;
    placeholder?: string;
    className?: string;
}

export function TimePicker({ id, value, onChange, placeholder = 'Pilih Waktu', className }: TimePickerProps) {
    const [open, setOpen] = React.useState(false);
    
    // Pisahkan value menjadi jam dan menit
    const [selectedHour, selectedMinute] = React.useMemo(() => {
        if (!value) return [null, null];
        const [h, m] = value.split(':');
        return [h, m];
    }, [value]);

    // Generate array 00-23 untuk jam
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    // Generate array 00-59 untuk menit
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
        const newHour = type === 'hour' ? val : (selectedHour || '00');
        const newMinute = type === 'minute' ? val : (selectedMinute || '00');
        
        if (onChange) {
            onChange(`${newHour}:${newMinute}`);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value ? value : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex divide-x border-b border-[oklch(0.22_0.01_85/8%)] p-2 bg-muted/50">
                    <div className="w-16 text-center text-xs font-medium text-muted-foreground">Jam</div>
                    <div className="w-16 text-center text-xs font-medium text-muted-foreground">Menit</div>
                </div>
                <div className="flex h-[240px] divide-x">
                    <ScrollArea className="w-16">
                        <div className="flex flex-col p-1 gap-1">
                            {hours.map((hour) => (
                                <Button
                                    key={hour}
                                    variant="ghost"
                                    size="sm"
                                    className={cn('shrink-0', selectedHour === hour && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground')}
                                    onClick={() => handleTimeChange('hour', hour)}
                                >
                                    {hour}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                    <ScrollArea className="w-16">
                        <div className="flex flex-col p-1 gap-1">
                            {minutes.map((minute) => (
                                <Button
                                    key={minute}
                                    variant="ghost"
                                    size="sm"
                                    className={cn('shrink-0', selectedMinute === minute && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground')}
                                    onClick={() => {
                                        handleTimeChange('minute', minute);
                                        // Tutup otomatis jika jam dan menit sudah terisi
                                        if (selectedHour) {
                                            setOpen(false);
                                        }
                                    }}
                                >
                                    {minute}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}
