"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Droplet, ShoppingCart, BarChart3, Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={cn("bg-[#2c3e50] text-white transition-all duration-300 flex flex-col", collapsed ? "w-16" : "w-64")}
    >
      <div className="p-4 flex items-center gap-2">
        {!collapsed && (
          <>
            <div className="w-10 h-10 relative">
              <Image src="/placeholder.svg" alt="Dairy Logo" fill className="rounded-full" />
            </div>
            <h1 className="text-xl font-bold">Laxman Dairy</h1>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-white hover:bg-[#3d5a73] ml-auto", collapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-1 p-2 flex-1">
        <Link href="/">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#3d5a73]",
              pathname === "/" && "bg-[#17a2b8] hover:bg-[#138496]",
            )}
          >
            <Home className="h-5 w-5 mr-2" />
            {!collapsed && "Home"}
          </Button>
        </Link>
        <Link href="/farmer">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#3d5a73]",
              pathname.startsWith("/farmer") && "bg-[#17a2b8] hover:bg-[#138496]",
            )}
          >
            <Users className="h-5 w-5 mr-2" />
            {!collapsed && "Farmer"}
          </Button>
        </Link>
        <Link href="/milk-transactions">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#3d5a73]",
              pathname.startsWith("/milk-transactions") && "bg-[#17a2b8] hover:bg-[#138496]",
            )}
          >
            <Droplet className="h-5 w-5 mr-2" />
            {!collapsed && "Milk Transactions"}
          </Button>
        </Link>
        <Link href="/farmer-expense">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#3d5a73]",
              pathname.startsWith("/farmer-expense") && "bg-[#17a2b8] hover:bg-[#138496]",
            )}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {!collapsed && "Farmer Expense"}
          </Button>
        </Link>
        <Link href="/milk-rate">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-[#3d5a73]",
              pathname.startsWith("/milk-rate") && "bg-[#17a2b8] hover:bg-[#138496]",
            )}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            {!collapsed && "Milk Rate"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
