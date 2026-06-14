import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { LogoMark, BriefcaseIcon, ChartIcon, LogoutIcon, SunIcon, MoonIcon } from './icons'

const navItems = [
  { to: '/', label: 'Job Board', icon: BriefcaseIcon, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: ChartIcon },
]

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-accent-600/15 text-accent-300 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
            : 'text-ink-300 hover:bg-surface-1 hover:text-ink-100'
        }`
      }
    >
      <Icon size={18} className="shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )
}

export default function Layout() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const initial = (user?.email?.[0] ?? '?').toUpperCase()
  const themeTitle = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  const ThemeIcon = theme === 'dark' ? SunIcon : MoonIcon

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — icon rail on tablet, full on desktop, bottom bar on mobile */}
      <aside className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-hairline bg-ink-900/95 px-4 py-2 backdrop-blur md:static md:inset-auto md:flex md:min-h-screen md:w-16 md:flex-col md:items-stretch md:justify-start md:border-t-0 md:border-r md:px-3 md:py-6 lg:w-60 lg:px-4">
        <div className="hidden items-center gap-2.5 px-1.5 md:flex">
          <LogoMark size={32} />
          <span className="hidden font-display text-[17px] font-bold tracking-tight lg:inline">
            Trackfolio
          </span>
        </div>

        <nav className="flex gap-1 md:mt-10 md:flex-col md:gap-1.5">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="md:mt-auto">
          <div className="hidden items-center gap-3 border-t border-hairline px-1.5 pt-5 md:flex">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 font-display text-sm font-bold text-white">
              {initial}
            </div>
            <div className="hidden min-w-0 flex-1 lg:block">
              <p className="truncate text-xs font-medium text-ink-200">{user?.email}</p>
              <p className="text-[11px] text-ink-400">Signed in</p>
            </div>
            <button
              onClick={toggle}
              title={themeTitle}
              aria-label="Toggle theme"
              className="hidden rounded-lg p-2 text-ink-400 transition hover:bg-surface-2 hover:text-accent-300 lg:block"
            >
              <ThemeIcon size={17} />
            </button>
            <button
              onClick={signOut}
              title="Sign out"
              className="hidden rounded-lg p-2 text-ink-400 transition hover:bg-surface-2 hover:text-rejected lg:block"
            >
              <LogoutIcon size={17} />
            </button>
          </div>
          {/* Compact theme + sign-out for mobile bar + icon rail */}
          <div className="flex items-center gap-1 md:mt-3 md:flex-col md:gap-1.5 lg:hidden">
            <button
              onClick={toggle}
              title={themeTitle}
              aria-label="Toggle theme"
              className="flex items-center justify-center rounded-xl p-2.5 text-ink-400 transition hover:bg-surface-2 hover:text-accent-300 md:w-full"
            >
              <ThemeIcon size={18} />
            </button>
            <button
              onClick={signOut}
              title="Sign out"
              className="flex items-center justify-center rounded-xl p-2.5 text-ink-400 transition hover:bg-surface-2 hover:text-rejected md:w-full"
            >
              <LogoutIcon size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 md:px-8 md:pb-10 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
