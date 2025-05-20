'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const registerSchema = z.object({
  name: z.string().min(2, 'Name ist zu kurz'),
  email: z.string().email('Ungültige E-Mail'),
  password: z.string().min(6, 'Mindestens 6 Zeichen'),
})

type FormData = z.infer<typeof registerSchema>

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema)
  })

  const supabase = useSupabaseClient()
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: FormData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError || !authData.user) {
      setError(authError?.message ?? 'Registrierung fehlgeschlagen')
      return
    }

    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        role: 'user',
      })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2 w-full">
          <div className="relative h-full w-full hidden md:block">
            <Image
              src="/images/japan-login-illustration.png"
              alt="Japan Illustration"
              fill
              className="object-cover bg-transparent"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Konto erstellen</h1>
                <p className="text-balance text-muted-foreground">Erstelle dein TangoDojo-Konto</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Passwort</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && (
                <p className="text-sm text-green-600 border border-green-200 p-2 rounded">
                  Registrierung erfolgreich! Du wirst gleich zum Login weitergeleitet.
                </p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-[#d73c25] text-white hover:bg-[#c5311e] transition">
                Registrieren
              </Button>
            </div>
          </form>
        </CardContent>
        <div className="text-balance text-center text-xs ">
          Schon registriert?{' '}
          <a 
            href="/login" 
            className="text-gray underline hover:text-[#d73c25] hover:no-underline transition-colors">
            Login
          </a>

        </div>
      </Card>
    </div>
  )
}
