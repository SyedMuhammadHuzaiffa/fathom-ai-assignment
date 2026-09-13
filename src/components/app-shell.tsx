"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Bell,
  BookOpenText,
  Bot,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  Headphones,
  Menu,
  MessageSquareText,
  Settings,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

const mainNav = [
  { label: "My Calls", icon: Video, href: "/" },
  { label: "Team Calls", icon: Users, href: "/team" },
  { label: "Ask Fathom", icon: Sparkles, href: "/ask" },
  { label: "Playlists", icon: FolderKanban, href: "/playlists" },
];

const secondaryNav = [
  { label: "Alerts", icon: Bell },
  { label: "Coaching", icon: Headphones },
  { label: "Templates", icon: BookOpenText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <Link className="wordmark" href="/" aria-label="Fathom home">
          FATHOM <LogoMark />
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {isOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Link className="wordmark desktop-wordmark" href="/" aria-label="Fathom home">
            FATHOM <LogoMark />
          </Link>

          <button className="workspace-switcher" type="button">
            <span className="workspace-avatar">H</span>
            <span>
              <small>Workspace</small>
              <strong>Huzaifa&apos;s Team</strong>
            </span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>

          <nav className="primary-nav" aria-label="Primary navigation">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/" && (pathname === "/" || pathname.startsWith("/meetings/"));
              return (
                <Link
                  className={active ? "active" : ""}
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.label === "Ask Fathom" && <span className="nav-beta">AI</span>}
                </Link>
              );
            })}
          </nav>

          <div className="nav-label">Workspace tools</div>
          <nav className="secondary-nav" aria-label="Workspace tools">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <button type="button" key={item.label}>
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button className="invite-button" type="button">
            <Users size={16} />
            Invite teammates
          </button>
          <div className="utility-links">
            <button type="button"><CircleHelp size={16} />Help</button>
            <button type="button"><MessageSquareText size={16} />Feedback</button>
            <button type="button"><Settings size={16} />Settings</button>
          </div>
          <button className="account-card" type="button">
            <span className="account-avatar">SH</span>
            <span>
              <strong>Syed Huzaifa</strong>
              <small>Personal workspace</small>
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      <section className="content-shell">
        <div className="top-strip">
          <div className="recording-status">
            <span className="status-dot" />
            Recorder ready
          </div>
          <button type="button"><Bot size={16} />Desktop app</button>
          <button className="top-avatar" type="button" aria-label="Open account menu">SH</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function LogoMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}
