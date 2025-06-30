"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { protectedFetch } from "@/lib/protected-fetch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api-error"

const Page: React.FC = () => {
  const [topic, setTopic] = useState("")
  const [resources, setResources] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResources(null)
    setError(null)
    try {
      const data = await protectedFetch("/carrer/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })
      setResources(data.resources)
      toast({
        title: "Resources Found",
        description: "Here are some resources for your topic.",
      })
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred."
      let toastTitle = "Error"

      if (err instanceof ApiError) {
        if (err.statusCode === 0 || err.statusCode === -1) {
          errorMessage = "Internet error: Failed to connect to server."
          toastTitle = "Network Error"
        } else if (err.statusCode >= 400 && err.statusCode < 500) {
          errorMessage = `Bad Request (${err.statusCode})`
          toastTitle = "Client Error"
        } else if (err.statusCode >= 500 && err.statusCode < 600) {
          errorMessage = `Server Error (${err.statusCode})`
          toastTitle = "Server Error"
        } else {
          errorMessage = `API Error (${err.statusCode})`
        }
      } else if (err instanceof Error) {
        errorMessage = "An unexpected client-side error occurred."
      }
      setError(errorMessage)
      toast({
        title: toastTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Simple Markdown-like rendering for bolding, lists, and newlines
  const renderMarkdown = (text: string) => {
    if (!text) return null
    return text.split("\n").map((line, index) => {
      // Handle specific resource pattern (e.g., "1. **Resource:**")
      if (line.match(/^\d+\.\s\*\*Resource:\*\*/)) {
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="text-primary">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return part
        })
        return (
          <p key={index} className="mt-4 text-muted-foreground">
            {parts}
          </p>
        )
      }
      // Handle bolded headings (e.g., starting with "**" and ending with "**")
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3 key={index} className="text-lg font-semibold text-white font-heading mt-4 mb-2">
            {line.slice(2, -2)}
          </h3>
        )
      }
      // Handle regular paragraphs
      return (
        <p key={index} className="mb-1 text-muted-foreground">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-white font-heading">Career Resources</h2>
      <p className="text-muted-foreground">
        Discover a wealth of curated learning materials, courses, and tools tailored to any career topic you wish to
        explore or master.
      </p>

      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle className="text-white font-heading">What topic do you want to learn about?</CardTitle>
          <CardDescription className="text-muted-foreground">
            Specify the subject or skill you're interested in, and our AI will provide a list of top-rated resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Textarea
                id="topic"
                placeholder="e.g., I have to learn machine learning, or Project management best practices, or Advanced JavaScript frameworks."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                className="bg-secondary border-border text-foreground focus:border-primary"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? "Searching Resources..." : "Find Resources"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {resources && (
        <Card className="bg-card border-border text-card-foreground animate-fade-in">
          <CardHeader>
            <CardTitle className="text-white font-heading">Recommended Resources</CardTitle>
            <CardDescription className="text-muted-foreground">
              Here's a comprehensive list of resources to help you learn and grow in your chosen topic.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">{renderMarkdown(resources)}</CardContent>
        </Card>
      )}
    </div>
  )
}

export default Page
