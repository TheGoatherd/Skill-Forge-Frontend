"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { protectedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/lib/api-error"

export default function CareerFinderPage() {
  const [interest, setInterest] = useState("")
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuggestion(null)
    setError(null)
    try {
      const data = await protectedFetch("/carrer/career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interest }),
      })
      setSuggestion(data.suggestion)
      toast({
        title: "Career Suggestion Generated",
        description: "Here are some career paths based on your interests.",
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

  // Simple Markdown-like rendering for bolding and newlines
  const renderMarkdown = (text: string) => {
    if (!text) return null
    return text.split("\n").map((line, index) => {
      // Handle list items (e.g., starting with "- " or "* ")
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.substring(2) // Remove the list marker
        const parts = content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
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
          <li key={index} className="ml-4 text-muted-foreground">
            {parts}
          </li>
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
      <h2 className="text-3xl font-bold text-white font-heading">Career Finder</h2>
      <p className="text-muted-foreground">
        Uncover potential career paths that truly resonate with your passions and skills. Our AI analyzes your interests
        to provide tailored suggestions.
      </p>

      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle className="text-white font-heading">What are you interested in?</CardTitle>
          <CardDescription className="text-muted-foreground">
            Describe your hobbies, passions, or what you enjoy learning about. The more detail, the better our AI can
            assist you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interest">Your Interests</Label>
              <Textarea
                id="interest"
                placeholder="e.g., I like to open CPUs and study about them, or I enjoy solving complex math problems and building algorithms."
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
                rows={5}
                className="bg-secondary border-border text-foreground focus:border-primary"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? "Generating Suggestions..." : "Get Career Suggestions"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {suggestion && (
        <Card className="bg-card border-border text-card-foreground animate-fade-in">
          <CardHeader>
            <CardTitle className="text-white font-heading">Career Suggestions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Here are some potential career paths based on your interests, along with insights into each role.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">{renderMarkdown(suggestion)}</CardContent>
        </Card>
      )}
    </div>
  )
}
