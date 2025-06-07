'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 text-center',
                className,
            )}
        >
            {icon && <div className="mb-4 text-gray-300">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 mb-6 max-w-md">{description}</p>
            )}
            {action && (
                <Button
                    onClick={action.onClick}
                    className="bg-red-600 hover:bg-red-700"
                    {...(action.href && { asChild: true })}
                >
                    {action.href ? (
                        <a href={action.href}>{action.label}</a>
                    ) : (
                        action.label
                    )}
                </Button>
            )}
        </div>
    );
}
