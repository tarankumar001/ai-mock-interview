import { cn } from "@/lib/utils"
import { Container } from "./container"
import { LogoContainer } from "./logo-container"
import { NavLink } from "react-router-dom"
import { MainRoutes } from "./MainRoutes"
import { ProfileContainer } from "@/containers/profile-container"

export const Header = () => {
  return (
    <header>
      <Container className={cn("w-full border-b duration-150 transition-all ease-in-out")}> 
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
            </ul>
          </nav>
          {/* profile */}
          <div className="ml-auto flexx items-center gap-6">
            {/* Add profile/avatar here */}
            < ProfileContainer/>

          </div>
        </div>
      </Container>
    </header>
  )
}
