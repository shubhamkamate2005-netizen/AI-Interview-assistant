import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth"
import Brand from "./Brand"
import Icon from "./Icon"

export default function AppShell({ children, title = "Dashboard" }) {
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const logout = async () => {
    if (await handleLogout()) navigate("/login")
  }

  return <div className="app-shell">
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-top"><Brand/><button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="close"/></button></div>
      <nav className="side-nav" aria-label="Main navigation">
        <button className={location.pathname === "/" ? "active" : ""} onClick={() => { navigate("/"); setOpen(false) }}><Icon name="grid"/>Dashboard</button>
        <button onClick={() => { navigate("/"); setOpen(false); setTimeout(() => document.querySelector("#new-analysis")?.scrollIntoView({behavior:"smooth"}), 50) }}><Icon name="sparkles"/>New analysis</button>
        <button onClick={() => { navigate("/"); setOpen(false); setTimeout(() => document.querySelector("#reports")?.scrollIntoView({behavior:"smooth"}), 50) }}><Icon name="history"/>My reports</button>
      </nav>
      <div className="sidebar-profile">
        <span className="avatar">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
        <span className="profile-copy"><strong>{user?.username}</strong><small>{user?.email}</small></span>
        <button className="icon-button" onClick={logout} aria-label="Log out" title="Log out"><Icon name="logout" size={18}/></button>
      </div>
    </aside>
    {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation"/>}
    <div className="app-main">
      <header className="topbar"><button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu"/></button><h1>{title}</h1><div className="topbar-user"><span className="status-dot"/>AI assistant ready</div></header>
      {children}
    </div>
  </div>
}
