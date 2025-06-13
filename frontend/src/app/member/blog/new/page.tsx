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
    // In a real app, you would submit the form data to your API
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
      <Card className="mx-auto max-w-4xl bg-white text-black border shadow-sm">
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
