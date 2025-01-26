"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EstimateForm from "@/components/EstimateForm"
import { ProjectHeader } from "@/components/ProjectHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div>Laster...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Velkommen, ge@gbebygg.no</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectHeader />
            <EstimateForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

