'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mindestens 6 Zeichen'),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const supabase = useSupabaseClient()
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-6 shadow-lg bg-card text-card-foreground">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Passwort zurücksetzen</h2>
          <p className="text-sm text-muted-foreground text-center">
            Gib dein neues Passwort ein.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Neues Passwort</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Neues Passwort" 
                {...register('password')} 
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && (
              <p className="text-sm text-green-600 border border-green-200 p-2 rounded">
                Passwort erfolgreich geändert! Du wirst gleich zum Login weitergeleitet.
              </p>
            )}
            <Button type="submit" className="w-full bg-[#d73c25] text-white hover:bg-[#c5311e] transition">
              Passwort ändern
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
