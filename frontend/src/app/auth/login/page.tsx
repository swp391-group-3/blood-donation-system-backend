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
import { loginSchema } from '@/lib/api/auth';
import * as api from '@/lib/api';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import { OAuth2 } from '../components/oauth2';
import { Separator } from '@/components/separator';

export default function LoginPage() {
    const { mutate: login, status } = useMutation({
        mutationFn: api.auth.login,
        onError: (error) => toast.error(error.message),
    });

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {},
    });

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">
                                Login
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit((values) =>
                                        login(values),
                                    )}
                                >
                                    <div className="flex flex-col gap-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {status === 'pending' ? (
                                            <Button disabled>
                                                <Loader2 className="animate-spin" />
                                                Loading
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                className="w-full py-5"
                                            >
                                                Login
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                            <Separator text="or" />
                            <OAuth2 />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
