"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { protectedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ApiError } from "@/lib/api-error"

interface ResumeUpgradeResponse {
  current_ats_score: number
  target_ats_score: number
  suggestions: string[]
  project_ideas: {
    title: string
    description: string
    technologies: string[]
    recruiter_impact: string
  }[]
  modified_latex: string
}

export default function ResumeUpgradePage() {
  const [file, setFile] = useState<File | null>(null)
  const [currentRole, setCurrentRole] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResumeUpgradeResponse | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !currentRole || !targetRole) {
      setError("Please fill all fields and upload a resume.")
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("current_role", currentRole)
    formData.append("target_role", targetRole)

    try {
      const data: ResumeUpgradeResponse = await protectedFetch("/resume/ats/improve/upgrade/resume_pdf", {
        method: "POST",
        body: formData,
        // Note: Content-Type is automatically set to multipart/form-data by fetch when using FormData
        // Do NOT manually set Content-Type: 'multipart/form-data' as it will break the boundary
      })
      setResult(data)
      toast({
        title: "Resume Upgraded!",
        description: "Check out the suggestions and improved LaTeX.",
      })
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred."
      let toastTitle = "Error Upgrading Resume"

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

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: message,
    })
  }

  const downloadLatex = () => {
    if (result?.modified_latex) {
      const blob = new Blob([result.modified_latex], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "improved_resume.tex"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "LaTeX Downloaded",
        description: "Your improved resume LaTeX file has been downloaded.",
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-white font-heading">Resume Upgrade</h2>
      <p className="text-muted-foreground">
        Leverage AI to transform your resume. Get an instant ATS score, receive targeted improvement suggestions, and
        discover impactful project ideas to align perfectly with your desired role.
      </p>

      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle className="text-white font-heading">Upload Your Resume</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload your current resume in PDF format and specify your current and target roles for a precise analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-file">Resume (PDF)</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                required
                className="bg-secondary border-border text-foreground file:text-primary file:bg-muted file:border-0 file:rounded-md file:px-3 file:py-1 hover:file:bg-muted-foreground"
              />
              {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-role">Current Role</Label>
                <Input
                  id="current-role"
                  type="text"
                  placeholder="e.g., Full Stack Developer"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  required
                  className="bg-secondary border-border text-foreground focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-role">Target Role</Label>
                <Input
                  id="target-role"
                  type="text"
                  placeholder="e.g., Data Scientist"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                  className="bg-secondary border-border text-foreground focus:border-primary"
                />
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? "Analyzing..." : "Upgrade Resume"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-white font-heading">ATS Score Analysis</CardTitle>
              <CardDescription className="text-muted-foreground">
                Understand your resume's current Applicant Tracking System (ATS) compatibility and its potential for
                improvement.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Current ATS Score</p>
                <p className="text-5xl font-bold text-code-foreground">{result.current_ats_score}</p>
                <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Target ATS Score</p>
                <p className="text-5xl font-bold text-code-foreground">{result.target_ats_score}</p>
                <p className="text-xs text-muted-foreground mt-1">Potential with AI-driven suggestions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-white font-heading">Suggestions for Improvement</CardTitle>
              <CardDescription className="text-muted-foreground">
                Receive actionable advice to enhance your resume's content, keywords, and formatting for better ATS
                performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-white font-heading">Project Ideas to Impress Recruiters</CardTitle>
              <CardDescription className="text-muted-foreground">
                Discover impactful project concepts tailored to your target role, designed to highlight relevant skills
                and catch recruiters' attention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.project_ideas.map((project, i) => (
                <div key={i} className="p-4 border border-border rounded-lg bg-secondary">
                  <h3 className="text-lg font-semibold text-white font-heading mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, j) => (
                      <Badge key={j} className="bg-muted text-muted-foreground hover:bg-muted/80">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Recruiter Impact:</span> {project.recruiter_impact}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-white font-heading">Modified LaTeX Resume</CardTitle>
              <CardDescription className="text-muted-foreground">
                Copy this LaTeX code and paste it into Overleaf or your preferred LaTeX editor to generate your
                professionally enhanced resume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => copyToClipboard(result.modified_latex, "LaTeX code copied to clipboard!")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Copy LaTeX
                </Button>
                <Button onClick={downloadLatex} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Download LaTeX
                </Button>
              </div>
              <Textarea
                value={result.modified_latex}
                readOnly
                className="mt-4 bg-secondary font-mono text-code-foreground"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
