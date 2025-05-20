// src/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button' // Korrekter Import
import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
  to?: string // Optionales Ziel, standardmäßig "zurück"
  label?: string // Optionaler Text
}

export default function BackButton({ to, label = "Zurück" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (to) {
      router.push(to)
    } else {
      router.back()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  )
}
