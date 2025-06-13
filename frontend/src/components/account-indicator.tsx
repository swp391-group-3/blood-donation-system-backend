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
                    <AvatarFallback className="bg-red-400 font-bold rounded-full">
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
                            <AvatarFallback className="bg-red-400 font-bold rounded-full">
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
