import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden">
      <Printer className="h-4 w-4 mr-2" />
      Skriv ut
    </Button>
  )
}

