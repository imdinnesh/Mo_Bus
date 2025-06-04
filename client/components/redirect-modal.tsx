"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface RedirectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RedirectModal({ isOpen, onClose }: RedirectModalProps) {
  const router = useRouter()

  const handleStartTrip = () => {
    router.push("/generate-ticket")
    onClose()
  }

  const handleGoHome = () => {
    router.push("/dashboard")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-center">
              Booking Successful!
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <p className="text-muted-foreground text-center">
            Your ticket has been successfully booked. Would you like to use it now or later?
          </p>

          <div className="flex flex-col space-y-3">
            <Button
              size="lg"
              onClick={handleStartTrip}
              className="w-full font-medium"
            >
              Use Ticket Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleGoHome}
              className="w-full font-medium"
            >
              Use Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}