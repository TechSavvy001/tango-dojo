'use client'

import dynamic from 'next/dynamic'

// Dynamisch importieren, damit die Sidebar sicher im Client gerendert wird
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export function SidebarWrapper() {
  return <Sidebar />
}
