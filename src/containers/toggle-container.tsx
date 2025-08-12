import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { MainRoutes } from "@/lib/helper"
import { useAuth } from "@clerk/clerk-react"
import { LogoContainer } from "@/components/logo-container"

export const ToggleContainer = () => {
  const { userId } = useAuth()

  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-6 flex flex-col items-center gap-8">
        <LogoContainer />
        <nav className="w-full">
          <ul className="flex flex-col items-center gap-8 w-full">
            {MainRoutes.map((route: { href: string; label: string }) => (
              <li key={route.href} className="w-full">
                <NavLink
                  to={route.href}
                  className={({ isActive }) =>
                    cn(
                      "block w-full text-base text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded",
                      isActive && "text-neutral-900 font-semibold bg-neutral-100"
                    )
                  }
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
            {userId && (
              <NavLink
                to="/generate"
                className={({ isActive }) =>
                  cn(
                    "block w-full text-base text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded",
                    isActive && "text-neutral-900 font-semibold bg-neutral-100"
                  )
                }
              >
                Take an Interview
              </NavLink>
            )}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}