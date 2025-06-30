"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommandCenterPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">AGENT ALLOCATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-code-foreground font-mono">190</div>
                <div className="text-xs text-neutral-500">Active Field</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-code-foreground font-mono">990</div>
                <div className="text-xs text-neutral-500">Undercover</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-code-foreground font-mono">290</div>
                <div className="text-xs text-neutral-500">Training</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: "G-078W", name: "VENGEFUL SPIRIT", status: "active" },
                { id: "G-079X", name: "OBSIDIAN SENTINEL", status: "standby" },
                { id: "G-080Y", name: "CRYSTAL WARRIOR", status: "inactive" },
                { id: "G-081Z", name: "SHADOW KNIGHT", status: "active" },
              ].map((agent) => (
                <div key={agent.id} className="text-center">
                  <div className="text-xl font-bold text-code-foreground font-mono">{agent.id}</div>
                  <div className="text-sm text-neutral-500">{agent.name}</div>
                  <div className="text-xs text-neutral-500 capitalize">{agent.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
