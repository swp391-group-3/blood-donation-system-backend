import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

export interface ComboBoxProps {
    values: string[];
    current: string;
    display: (value: string) => string;
    onSelect: (value: string) => void;
}

export const ComboBox = ({
    values,
    current,
    display,
    onSelect,
}: ComboBoxProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            'justify-between',
                            !current && 'text-muted-foreground',
                        )}
                    >
                        {current ? display(current) : 'Select Blood Group'}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No entry found</CommandEmpty>
                        <CommandGroup>
                            {values.map((value) => (
                                <CommandItem
                                    value={display(value)}
                                    key={value}
                                    onSelect={() => {
                                        onSelect(value);
                                    }}
                                >
                                    {display(value)}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === current
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
