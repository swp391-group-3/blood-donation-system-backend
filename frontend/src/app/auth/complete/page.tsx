'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import {
    bloodGroups,
    displayBloodGroup,
    genders,
    oauth2CompleteSchema,
    registerSchema,
} from '@/lib/api/auth';
import * as api from '@/lib/api';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';

const CompleteForm = () => {
    const { mutate: oauth2Complete, status } = useMutation({
        mutationFn: api.auth.oauth2Complete,
        onError: (error) => toast.error(error.message),
    });

    const form = useForm<z.infer<typeof oauth2CompleteSchema>>({
        resolver: zodResolver(oauth2CompleteSchema),
        defaultValues: {},
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => oauth2Complete(values))}
            >
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Gender</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'justify-between',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ?? 'Select Gender'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No entry found
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {genders.map((value) => (
                                                        <CommandItem
                                                            value={value}
                                                            key={value}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    'gender',
                                                                    value,
                                                                );
                                                            }}
                                                        >
                                                            {value}
                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    value ===
                                                                        field.value
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Birthday</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="blood_group"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Blood Group</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'justify-between',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? displayBloodGroup(
                                                          field.value,
                                                      )
                                                    : 'Select Blood Group'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No entry found
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {bloodGroups.map(
                                                        (value) => (
                                                            <CommandItem
                                                                value={displayBloodGroup(
                                                                    value,
                                                                )}
                                                                key={value}
                                                                onSelect={() => {
                                                                    form.setValue(
                                                                        'blood_group',
                                                                        value,
                                                                    );
                                                                }}
                                                            >
                                                                {displayBloodGroup(
                                                                    value,
                                                                )}
                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        value ===
                                                                            field.value
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {status === 'pending' ? (
                        <Button disabled className="w-full py-5">
                            <Loader2 className="animate-spin" />
                            Loading
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full py-5">
                            Register
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default function CompletePage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">
                                Register
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CompleteForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
