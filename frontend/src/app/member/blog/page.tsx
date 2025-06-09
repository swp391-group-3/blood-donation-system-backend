'use client';
import { useState, useEffect } from 'react';
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

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        role: string;
        initials: string;
    };
    category: string;
    tags: string[];
    publishedAt: string;
    readTime: number;
    likes: number;
    comments: number;
    views: number;
    featured: boolean;
}

export default function BlogPage() {
    const [role, setRole] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTab, setSelectedTab] = useState('all');

    useEffect(() => {
        const userRole = localStorage.getItem('userRole') || 'member';
        setRole(userRole);
    }, []);

    // Mock blog posts data
    const blogPosts: BlogPost[] = [
        {
            id: 'post-001',
            title: 'The Importance of Regular Blood Donation',
            excerpt:
                'Learn why regular blood donation is crucial for maintaining adequate blood supplies and how it benefits both donors and recipients.',
            content: 'Full content here...',
            author: {
                name: 'Dr. Sarah Johnson',
                role: 'staff',
                initials: 'SJ',
            },
            category: 'Health & Wellness',
            tags: ['donation', 'health', 'community'],
            publishedAt: '2023-05-28',
            readTime: 5,
            likes: 24,
            comments: 8,
            views: 156,
            featured: true,
        },
        {
            id: 'post-002',
            title: 'My First Blood Donation Experience',
            excerpt:
                'A personal story about overcoming fears and making a difference through blood donation.',
            content: 'Full content here...',
            author: {
                name: 'Michael Chen',
                role: 'member',
                initials: 'MC',
            },
            category: 'Personal Stories',
            tags: ['experience', 'first-time', 'inspiration'],
            publishedAt: '2023-05-27',
            readTime: 3,
            likes: 18,
            comments: 12,
            views: 89,
            featured: false,
        },
        {
            id: 'post-003',
            title: 'Blood Types and Compatibility: A Complete Guide',
            excerpt:
                'Understanding different blood types, compatibility, and why certain types are more in demand.',
            content: 'Full content here...',
            author: {
                name: 'Dr. Emily Rodriguez',
                role: 'staff',
                initials: 'ER',
            },
            category: 'Education',
            tags: ['blood-types', 'compatibility', 'education'],
            publishedAt: '2023-05-26',
            readTime: 7,
            likes: 31,
            comments: 5,
            views: 203,
            featured: true,
        },
        {
            id: 'post-004',
            title: 'Community Blood Drive Success Story',
            excerpt:
                'How our recent community blood drive exceeded expectations and made a real impact.',
            content: 'Full content here...',
            author: {
                name: 'Jennifer Adams',
                role: 'staff',
                initials: 'JA',
            },
            category: 'Community',
            tags: ['community', 'success', 'impact'],
            publishedAt: '2023-05-25',
            readTime: 4,
            likes: 15,
            comments: 7,
            views: 112,
            featured: false,
        },
        {
            id: 'post-005',
            title: 'Preparing for Your Blood Donation',
            excerpt:
                "Essential tips and guidelines to ensure you're ready for a successful blood donation.",
            content: 'Full content here...',
            author: {
                name: 'Robert Kim',
                role: 'member',
                initials: 'RK',
            },
            category: 'Tips & Guides',
            tags: ['preparation', 'tips', 'donation'],
            publishedAt: '2023-05-24',
            readTime: 6,
            likes: 22,
            comments: 9,
            views: 134,
            featured: false,
        },
        {
            id: 'post-006',
            title: 'The Science Behind Blood Storage',
            excerpt:
                'Exploring how blood is processed, stored, and maintained to ensure safety and effectiveness.',
            content: 'Full content here...',
            author: {
                name: 'Dr. Amanda Foster',
                role: 'staff',
                initials: 'AF',
            },
            category: 'Science & Technology',
            tags: ['science', 'storage', 'technology'],
            publishedAt: '2023-05-23',
            readTime: 8,
            likes: 19,
            comments: 4,
            views: 87,
            featured: false,
        },
    ];

    const categories = [
        'all',
        'Health & Wellness',
        'Personal Stories',
        'Education',
        'Community',
        'Tips & Guides',
        'Science & Technology',
    ];

    // Filter posts based on search and category
    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase()),
            );

        const matchesCategory =
            selectedCategory === 'all' || post.category === selectedCategory;

        const matchesTab =
            selectedTab === 'all' ||
            (selectedTab === 'featured' && post.featured) ||
            (selectedTab === 'my-posts' && post.author.name === 'John Doe'); // Mock current user

        return matchesSearch && matchesCategory && matchesTab;
    });

    const featuredPosts = blogPosts.filter((post) => post.featured);

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

            {/* Search and Filters */}
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
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category === 'all'
                                            ? 'All Categories'
                                            : category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && selectedTab === 'all' && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Featured Posts
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredPosts.slice(0, 2).map((post) => (
                            <Card
                                key={post.id}
                                className="border-2 border-blue-200 bg-blue-50"
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-blue-600 text-white">
                                            Featured
                                        </Badge>
                                        <Badge variant="outline">
                                            {post.category}
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
                                    <CardDescription className="line-clamp-3">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {post.author.initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{post.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(
                                                    post.publishedAt,
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-4 w-4" />
                                                {post.likes}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="h-4 w-4" />
                                                {post.comments}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Blog Posts Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-6">
                    {filteredPosts.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredPosts.map((post) => (
                                <Card
                                    key={post.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline">
                                                        {post.category}
                                                    </Badge>
                                                    {post.featured && (
                                                        <Badge className="bg-blue-600 text-white">
                                                            Featured
                                                        </Badge>
                                                    )}
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
                                                <span>
                                                    {post.readTime} min read
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {post.views}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="h-4 w-4" />
                                                    {post.likes}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle className="h-4 w-4" />
                                                    {post.comments}
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
