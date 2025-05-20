'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail'),
  password: z.string().min(6, 'Mindestens 6 Zeichen'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const supabase = useSupabaseClient()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('') // ✅ Success-Message State

  const router = useRouter()

  const onSubmit = async (data: LoginFormData) => {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (loginError) {
      setError(loginError.message)
      return
    }

    router.push('/start')
  }

    // ✅ Passwort-Zurücksetzen-Funktion
    const handlePasswordReset = async () => {
      const email = prompt("Bitte gib deine E-Mail ein:")
      if (!email) return
  
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
  
      if (error) {
        setError(error.message)
      } else {
        setSuccessMessage('Passwort-Reset-Link wurde an deine E-Mail gesendet.')
      }
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 w-full">  {/* ✅ Fix: onSubmit verwendet */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your TangoDojo account</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" placeholder="Enter Email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
              <div className="flex items-center">
                  <Label htmlFor="password">Passwort</Label>
                  <a 
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline text-gray-600"
                    onClick={handlePasswordReset}>
                    Passwort vergessen?
                  </a>
                </div>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
              <Button type="submit" className="w-full bg-[#d73c25] text-white hover:bg-[#c5311e] transition">Login</Button>
              <div className="text-center text-sm">
                Noch kein Konto?{" "}
                <a href="/register" className="text-gray underline hover:text-[#d73c25] hover:no-underline transition-colors">

                  Registrieren
                </a>
              </div>
            </div>
          </form>

          <div className="relative h-full w-full hidden md:block">
            <Image
              src="/images/japan-login-illustration.png"
              alt="Japan Illustration"
              fill
              className="object-cover bg-transparent"
            />
            
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
