'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const NotFound = () => {
  const router = useRouter()

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 sm:m-2 p-4">
      <h1 className="text-2xl font-bold sm:text-4xl text-center">404 - Page Not Found</h1>
      <p className="text-muted-foreground sm:text-lg text-base flex text-center">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Button 
        onClick={() => router.push('/')}
        className="mt-4"
      >
        Return Home
      </Button>
    </div>
  )
}

export default NotFound