// 'use client';
// import { useState } from 'react';
// import { Content } from '@tiptap/react';
// import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
// import Link from 'next/link';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Textarea } from '@/components/ui/textarea';
// import { Separator } from '@/components/ui/separator';
// import { ArrowLeft, Calendar, MessageCircle, Send } from 'lucide-react';
// import { post, comments } from '../../../../../constants/sample-data';
// import { TooltipProvider } from '@/components/ui/tooltip';

// export default function BlogPostPage() {
//     const [value, setValue] = useState<Content>('');

//     return (
//         <TooltipProvider>
//             <div className="max-w-5xl mx-auto space-y-6 p-6">
//                 <div className="flex items-center gap-4">
//                     <Button variant="ghost" size="sm" asChild>
//                         <Link href="/member/blog">
//                             <ArrowLeft className="h-4 w-4 mr-2" />
//                             Back to Blog
//                         </Link>
//                     </Button>
//                 </div>
//                 <Card className="p-10">
//                     <CardHeader className="space-y-4">
//                         <CardTitle className="text-3xl">{post.title}</CardTitle>
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                                 <div className="flex items-center gap-2">
//                                     <Avatar className="h-8 w-8">
//                                         <AvatarFallback>
//                                             {post.author.initials}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <span className="font-medium">
//                                         {post.author.name}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                     <Calendar className="h-4 w-4" />
//                                     {new Date(
//                                         post.publishedAt,
//                                     ).toLocaleDateString()}
//                                 </div>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     <CardContent>
//                         <div
//                             className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:italic"
//                             dangerouslySetInnerHTML={{ __html: post.content }}
//                         />

//                         <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
//                             {post.tags.map((tag) => (
//                                 <Badge
//                                     key={tag}
//                                     variant="secondary"
//                                     className="text-xs"
//                                 >
//                                     #{tag}
//                                 </Badge>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="p-10">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <MessageCircle className="h-5 w-5" />
//                             Comments ({comments.length})
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                         <div className="space-y-3">
//                             <MinimalTiptapEditor
//                                 value={value}
//                                 onChange={setValue}
//                                 className="w-full"
//                                 editorContentClassName="p-5"
//                                 output="html"
//                                 placeholder="Share your though..."
//                                 autofocus={true}
//                                 editable={true}
//                                 editorClassName="focus:outline-hidden"
//                             />
//                             <div className="flex justify-end">
//                                 <Button>
//                                     <Send className="h-4 w-4 mr-2" />
//                                     Post Comment
//                                 </Button>
//                             </div>
//                         </div>
//                         <Separator />

//                         <div className="space-y-6">
//                             {comments.map((comment) => (
//                                 <div key={comment.id} className="space-y-3">
//                                     <div className="flex items-start gap-3">
//                                         <Avatar className="h-8 w-8">
//                                             <AvatarFallback className="text-sm">
//                                                 {comment.author.initials}
//                                             </AvatarFallback>
//                                         </Avatar>
//                                         <div className="flex-1 space-y-2">
//                                             <div className="flex items-center gap-2">
//                                                 <span className="font-medium">
//                                                     {comment.author.name}
//                                                 </span>
//                                                 <Badge
//                                                     variant="outline"
//                                                     className={`text-xs ${comment.author.role === 'staff' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}`}
//                                                 >
//                                                     {comment.author.role}
//                                                 </Badge>
//                                                 <span className="text-sm text-gray-500">
//                                                     {new Date(
//                                                         comment.publishedAt,
//                                                     ).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                             <p className="text-gray-700">
//                                                 {comment.content}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         {comments.length === 0 && (
//                             <div className="text-center py-8 text-gray-500">
//                                 <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                                 <p>
//                                     No comments yet. Be the first to share your
//                                     thoughts!
//                                 </p>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </TooltipProvider>
//     );
// }


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required.",
  }),
})

// Available tags for the dropdown
const availableTags = [
  { label: "Technology", value: "technology" },
  { label: "Design", value: "design" },
  { label: "Development", value: "development" },
  { label: "Product", value: "product" },
  { label: "UX", value: "ux" },
  { label: "UI", value: "ui" },
  { label: "Research", value: "research" },
  { label: "Marketing", value: "marketing" },
  { label: "Business", value: "business" },
]

export default function CreateBlogPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      tags: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert("Blog post created successfully!\n\n" + JSON.stringify(values, null, 2))
  }

  const handleTagSelect = (value: string) => {
    const currentTags = form.getValues("tags")
    if (!currentTags.includes(value)) {
      form.setValue("tags", [...currentTags, value], { shouldValidate: true })
    }
  }

  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag),
      { shouldValidate: true },
    )
  }

  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-2xl bg-white text-black border shadow-sm">
        <CardHeader className="bg-white text-black">
          <CardTitle className="text-3xl text-black">Create New Blog Post</CardTitle>
          <CardDescription className="text-gray-500">Fill in the details to create a new blog post</CardDescription>
        </CardHeader>
        <CardContent className="bg-white text-black">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog post title" className="bg-white text-black" {...field} />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      This will be the main title of your blog post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Excerpt</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a short excerpt" className="bg-white text-black" {...field} />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      A brief summary that appears in blog listings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog post content here..."
                        className="min-h-[200px] resize-none bg-white text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      The main content of your blog post. Supports markdown formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-gray-100 text-black flex items-center gap-1">
                          {availableTags.find((t) => t.value === tag)?.label || tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                    <FormControl>
                      <Select onValueChange={handleTagSelect}>
                        <SelectTrigger className="bg-white text-black">
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          {availableTags
                            .filter((tag) => !field.value.includes(tag.value))
                            .map((tag) => (
                              <SelectItem key={tag.value} value={tag.value}>
                                {tag.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Select relevant tags to categorize your blog post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Create Post
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
