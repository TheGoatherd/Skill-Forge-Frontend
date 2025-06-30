"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/lib/auth"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/lib/api-error"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await registerUser(email, password)
      toast({
        title: "Registration Successful",
        description: "You can now log in to Skill Forge!",
      })
      router.push("/auth/login")
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred."
      let toastTitle = "Registration Failed"

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md bg-card border-border shadow-lg animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-white font-heading">Skill Forge</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a new account to start your career journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border text-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-border text-foreground focus:border-primary"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
