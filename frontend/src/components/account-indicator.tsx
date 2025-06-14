'use client';

import Link from 'next/link';
import { useCurrentAccount } from '@/hooks/auth/useCurrentAccount';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export const AccountIndicator = () => {
    const { data: account } = useCurrentAccount();

    if (!account) {
        return (
            <div className="gap-4 flex">
                <Link href="/auth/register">
                    <Button variant="outline">Register</Button>
                </Link>
                <Link href="/auth/login">
                    <Button>Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer h-8 w-8 rounded-lg">
                    <AvatarFallback className="bg-rose-400/20 text-rose-500 rounded font-medium">
                        {account.name[0]}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="hover:cursor-pointer h-8 w-8 rounded-lg">
                            <AvatarFallback className="bg-rose-400/20 text-rose-500 rounded font-medium">
                                {account.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {account.name}
                            </span>
                            <span className="text-muted-foreground truncate text-xs">
                                {account.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link className="flex flex-cols gap-5" href="/profile">
                            <User />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <div className="flex flex-cols gap-5">
                        <LogOut />
                        Log out
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const MobileAccountIndicator = () => {
    const { data: account } = useCurrentAccount();

    if (!account) {
        return (
            <div className="mt-6 flex flex-col gap-4">
                <Link href="/auth/register">
                    <Button className="w-full" variant="outline">
                        Register
                    </Button>
                </Link>
                <Link href="/auth/login">
                    <Button className="w-full">Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <Accordion className="mt-6" type="single" collapsible>
            <AccordionItem value="solutions" className="border-none">
                <AccordionTrigger className="text-base hover:no-underline">
                    {account.email}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid md:grid-cols-2">
                        <Link
                            href="/profile"
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                        >
                            <div className="flex flex-cols items-center gap-3 mb-1 font-semibold text-foreground">
                                <User />
                                <span>Profile</span>
                            </div>
                        </Link>
                        <div className="hover:pointer rounded-md p-3 transition-colors hover:bg-muted/70">
                            <div className="flex flex-cols items-center gap-3 mb-1 font-semibold text-foreground">
                                <LogOut />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
