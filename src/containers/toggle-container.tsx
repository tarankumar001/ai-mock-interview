import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { MainRoutes } from "@/lib/helper"
import { useAuth } from "@clerk/clerk-react" // ✅ Missing import


export const ToggleContainer = () => {
    const { userId } = useAuth()

  return (

    
<Sheet>
  <SheetTrigger className="block md:hidden">
    <Menu/>

  </SheetTrigger>
  <SheetContent>
    {/* <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader> */}
    <nav>
        <ul className="flex flex-col items-start gap-8">
                   {MainRoutes.map((route: { href: string; label: string }) => (
                <li key={route.href}>
                  <NavLink
                    to={route.href}
                    className={({ isActive }) =>
                      cn(
                        "text-base text-neutral-600 hover:text-neutral-900",
                        isActive && "text-neutral-900 font-semibold"
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
                      "text-base text-neutral-600 hover:text-neutral-900",
                      isActive && "text-neutral-900 font-semibold"
                    )
                  }
                >
                  Take an Interview
                </NavLink>
              )}
        </ul>
    </nav>
  </SheetContent>
</Sheet>  )
}
