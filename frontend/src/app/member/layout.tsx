import React from 'react';
import { Heart, LogOut } from 'lucide-react';
import { sidebarItems } from '../../../constants/sample-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HomepageLayoutProps {
    children: React.ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
    return (
        <div className="flex bg-gray-50">
            <div className="sticky top-0 h-screen w-70 bg-white border-zinc-300 flex flex-col">
                <div className="p-6 border-b border-r border-zinc-300">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-red-600" />
                        <span className="text-xl font-bold text-zinc-950">
                            BloodBridge
                        </span>
                    </div>
                </div>

                <div className="p-4 space-y-2 flex-1 border-r border-zinc-300">
                    {sidebarItems.map((item, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className={cn(
                                'w-full justify-start text-zinc-600 hover:text-zinc-900 hover:bg-gray-100',
                                item.active && 'bg-red-50 text-red-600',
                            )}
                        >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="flex items-center gap-3 border-r border-zinc-300 px-5 py-3 transition hover:bg-zinc-50 focus:outline-none">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="../../public/avatars/sample-avatar.png"
                                    alt="User avatar"
                                />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">
                                    Nam Dang
                                </span>
                                <span className="text-xs text-gray-500">
                                    m@example.com
                                </span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem>My Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Health Record</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex-1 flex flex-col">{children}</div>
        </div>
    );
}