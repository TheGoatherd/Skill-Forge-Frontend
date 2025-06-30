"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Shield, Settings } from "lucide-react"

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white font-heading">Welcome to Skill Forge!</h1>
      <p className="text-lg text-muted-foreground">
        Your comprehensive AI-powered platform designed to guide you through every stage of your career journey.
        Discover new paths, build essential skills, and optimize your professional presence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border text-card-foreground hover:border-primary transition-colors">
          <CardHeader>
            <Users className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-white font-heading">Career Finder</CardTitle>
            <CardDescription className="text-muted-foreground">
              Explore personalized career recommendations tailored to your unique interests and aspirations. Let AI
              illuminate your potential paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/career-finder">
              <Button className="w-full bg-primary hover:bg-primary/90">Explore</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground hover:border-primary transition-colors">
          <CardHeader>
            <Target className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-white font-heading">Roadmap</CardTitle>
            <CardDescription className="text-muted-foreground">
              Generate a clear, step-by-step roadmap to achieve your professional goals, complete with milestones and
              actionable advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/roadmap">
              <Button className="w-full bg-primary hover:bg-primary/90">Generate</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground hover:border-primary transition-colors">
          <CardHeader>
            <Shield className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-white font-heading">Resources</CardTitle>
            <CardDescription className="text-muted-foreground">
              Access a curated library of learning materials, courses, and tools to help you master new skills and stay
              ahead.
            </CardDescription>
            D{" "}
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/resources">
              <Button className="w-full bg-primary hover:bg-primary/90">Find Resources</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground hover:border-primary transition-colors">
          <CardHeader>
            <Settings className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-white font-heading">Resume Upgrade</CardTitle>
            <CardDescription className="text-muted-foreground">
              Optimize your resume with AI-driven insights, improve your ATS score, and get tailored project ideas to
              impress recruiters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/resume-upgrade">
              <Button className="w-full bg-primary hover:bg-primary/90">Upgrade</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
