"use client"

import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"

export function SiteHeader() {
  const { user, logout } = useUser()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold">
          Food Reality Check
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="/scan" className="text-sm font-medium hover:underline">
            Scan Product
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">Saved Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="default">
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
