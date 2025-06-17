"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { LogOut, Settings } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  // Function to generate breadcrumb
  const generateBreadcrumb = () => {
    if (pathname === "/") return "Dashboard"

    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 1) {
      return capitalizeFirstLetter(segments[0].replace(/-/g, " "))
    }

    if (segments.length === 2) {
      const action = segments[1] === "create" ? "Create" : segments[1] === "edit" ? "Edit" : segments[1]

      return `${capitalizeFirstLetter(segments[0].replace(/-/g, " "))} / ${capitalizeFirstLetter(action)}`
    }

    return pathname
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <header className="bg-[#17a2b8] text-white h-16 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">{generateBreadcrumb()}</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-[#138496]">AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Admin User</p>
              <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
