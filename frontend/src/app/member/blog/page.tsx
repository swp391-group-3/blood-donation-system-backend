'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Plus,
    Search,
    Calendar,
    Heart,
    MessageCircle,
    Eye,
    Filter,
} from 'lucide-react';
import {blogPosts} from "../../../../constants/sample-data"

const schema = z.object({
    searchTerm: z.string().optional().default(''),
    tag: z.string().default('all'),
});
export type SearchFormValues = z.infer<typeof schema>;

export default function BlogPage() {

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            searchTerm: '',
            tag: 'all',
        }
    });
    
    const [role, setRole] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTab, setSelectedTab] = useState('all');

    useEffect(() => {
        const userRole = localStorage.getItem('userRole') || 'member';
        setRole(userRole);
    }, []);


    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Blog</h1>
                    <p className="text-gray-500">
                        Share stories, tips, and knowledge about blood donation
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Write Post
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Blog Posts Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-6">
                    {blogPosts.length > 0 ? (
                        <div className="grid gap-6">
                            {blogPosts.map((post) => (
                                <Card
                                    key={post.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            post.author.role ===
                                                            'staff'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : 'bg-green-50 text-green-700 border-green-200'
                                                        }
                                                    >
                                                        {post.author.role}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="line-clamp-2">
                                                    <Link
                                                        href={`/dashboard/blog/${post.id}`}
                                                        className="hover:text-blue-600"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2 mt-2">
                                                    {post.excerpt}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">
                                                            {
                                                                post.author
                                                                    .initials
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>
                                                        {post.author.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(
                                                        post.publishedAt,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {post.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No posts found
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {searchQuery || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Be the first to share your story!'}
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/blog/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Write Your First Post
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
