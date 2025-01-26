"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

interface ProjectDetails {
  customer: string
  address: string
  project: string
  date: string
  revision: string
}

export function ProjectHeader() {
  const [details, setDetails] = useState<ProjectDetails>({
    customer: "",
    address: "",
    project: "",
    date: new Date().toLocaleDateString("no-NO"),
    revision: "01",
  })

  useEffect(() => {
    const savedDetails = localStorage.getItem("projectDetails")
    if (savedDetails) {
      setDetails(JSON.parse(savedDetails))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("projectDetails", JSON.stringify(details))
  }, [details])

  const handleChange = (field: keyof ProjectDetails, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold tracking-tight">PRISTILBUD</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[140px,1fr] items-center gap-4">
                <Label htmlFor={key} className="text-right text-muted-foreground">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => handleChange(key as keyof ProjectDetails, e.target.value)}
                  className="h-9"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="relative h-[40px] w-[200px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/header-Y77l0pTaFTJqw7bmBJBcdNUqRxdnGU.png"
                alt="Company Certifications"
                fill
                className="object-contain"
                priority
              />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm text-right text-muted-foreground">
              <p>Brobekkveien 114, 0582 Oslo</p>
              <p>NO 927 174 146 MVA</p>
              <p>93652905 / 469 10 944</p>
              <p>
                <a href="mailto:post@gbebygg.no" className="hover:underline">
                  post@gbebygg.no
                </a>
              </p>
              <p>
                <a href="https://gbebygg.no" className="hover:underline">
                  gbebygg.no
                </a>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

