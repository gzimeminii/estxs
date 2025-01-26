"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Estimeringsverktøy
            </Link>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 mr-4">ge@gbebygg.no</span>
                <Button onClick={handleLogout} variant="outline">
                  Logg ut
                </Button>
              </>
            ) : (
              <Link href="/">
                <Button variant="outline">Logg inn</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

