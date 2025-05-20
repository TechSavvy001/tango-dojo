export type AppUser = {
  id: string
  email: string | null
  name: string
  role: 'user' | 'admin'
  avatarUrl?: string // Avatar-URL als optionales Feld
}
