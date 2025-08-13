import { cn } from "@/lib/utils"
import { LogoContainer } from "./logo-container"
import { NavLink } from "react-router-dom"
import { MainRoutes } from "./MainRoutes"
import { ProfileContainer } from "@/containers/profile-container"
import { ToggleContainer } from "@/containers/toggle-container"
import { useAuth } from "@clerk/clerk-react"

export const Header = () => {
  const { userId, isLoaded } = useAuth()

  // ✅ Don't render header until auth state is loaded
  if (!isLoaded) return null

  return (
    <header>
      <div className="w-full border-b duration-150 transition-all ease-in-out">
        <div className="container mx-auto px-4 md:px-8 py-4 w-full pr-0">
          <div className="flex items-center gap-4">
            <LogoContainer />

            {/* navigation */}
            <nav className="hidden md:flex items-center gap-3">
              <ul className="flex items-center gap-6">
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

            {/* profile */}
            <div className="ml-auto flex items-center">
              <ProfileContainer />
              <div className="md:hidden">
                <ToggleContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
