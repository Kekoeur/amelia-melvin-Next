"use client";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "@/types/pages";
import { getFullRoute, buildNavigationTree } from "@/utils/navigationUtils";
import Image from "next/image";

/* ==================== THEME CONFIG ==================== */
const THEME = {
  colors: {
    primary: "var(--rose)",
    secondary: "var(--jaune-pale)",
    hover: "var(--rose)",
    hoverText: "var(--jaune-pale)",
    border: "var(--rose)",
    background: "var(--jaune-pale)",
  },
  logo: {
    size: 96,
    borderWidth: 2,
  },
  breakpoint: 590,
} as const;

/* ==================== TYPES ==================== */
interface HamburgerMenuPageProps extends NavigationProps {
  logo?: {
    url?: string;
    alt: string;
    title: string;
  };
}

interface NavItemType {
  path: string;
  title: string;
  children?: NavItemType[];
}

/* ==================== ICON TOGGLE (SVG) ==================== */
interface IconToggleProps {
  open: boolean;
  onClick?: () => void;
  size?: number; // px
}

function IconToggle({ open, onClick, size = 28 }: IconToggleProps) {
  const s = size;
  return (
    <button
      type="button"
      aria-label={open ? "Fermer" : "Ouvrir"}
      onClick={onClick}
      className="p-1 w-8 h-8 relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10"
      style={{ width: s, height: s, color: THEME.colors.primary }}
    >
      {/* Close-ish icon (shown when open) */}
      <svg
        viewBox="0 0 24 24"
        width={s}
        height={s}
        className={`absolute transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
        focusable="false"
      >
        <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Menu / equivalent icon (shown when closed) */}
      <svg
        viewBox="0 0 24 24"
        width={s}
        height={s}
        className={`absolute transition-opacity duration-200 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-hidden={open}
        focusable="false"
      >
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  );
}

/* ==================== MAIN COMPONENT ==================== */
export const HamburgerMenuPage: React.FC<HamburgerMenuPageProps> = ({ logo, ...navprops }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const structuredNav = buildNavigationTree(navprops.renderNavigation || []);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < THEME.breakpoint);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggle = () => setOpen((prev) => !prev);

  const midPoint = Math.ceil(structuredNav.length / 2);
  const leftItems = structuredNav.slice(0, midPoint);
  const rightItems = structuredNav.slice(midPoint);

  return (
    <nav
      className="font-light shadow border-t border-b"
      style={{
        backgroundColor: THEME.colors.background,
        color: THEME.colors.primary,
        borderColor: THEME.colors.border,
      }}
    >
      <div className="container mx-auto px-4">
        {isMobile ? (
          // ==================== MOBILE MENU ====================
          <>
            <div className="relative flex items-center justify-end py-2">
              <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-50">
                <a
                  href="/"
                  className="block rounded-full bg-white shadow-2xl overflow-hidden hover:scale-110 transition-transform duration-300"
                  style={{
                    width: `${THEME.logo.size}px`,
                    height: `${THEME.logo.size}px`,
                    border: `${THEME.logo.borderWidth}px solid ${THEME.colors.border}`,
                  }}
                >
                  {logo?.url ? (
                    <Image
                      src={logo.url}
                      alt={logo.alt}
                      width={THEME.logo.size}
                      height={THEME.logo.size}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-400">
                      <span className="text-2xl font-bold text-white">Logo</span>
                    </div>
                  )}
                </a>
              </div>

              {/* SVG Toggle Button */}
              <IconToggle open={open} onClick={toggle} size={32} />
            </div>

            {/* Menu en position absolute pour overlay */}
            <div
              className="absolute left-0 right-0 top-full transition-all duration-300 ease-in-out overflow-hidden shadow-lg z-25"
              style={{
                backgroundColor: THEME.colors.background,
                ...(open
                  ? { maxHeight: "500px", opacity: 1, visibility: "visible" }
                  : { maxHeight: 0, opacity: 0, visibility: "hidden" }),
              }}
            >
              <nav className="py-4">
                {structuredNav.map((item) => (
                  <div key={item.path} className="mb-2">
                    <a
                      href={'/' + getFullRoute(item)}
                      className="block px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[var(--rose)] hover:text-[var(--jaune-pale)] hover:translate-x-1"
                      style={{ color: THEME.colors.primary }}
                    >
                      {item.title}
                    </a>
                    {item.children && item.children.length > 0 && (
                      <div className="pl-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <a
                            key={child.path}
                            href={'/' + getFullRoute(child)}
                            className="block px-3 py-1 text-sm rounded transition-colors hover:bg-[var(--rose)] hover:text-[var(--jaune-pale)]"
                            style={{ color: THEME.colors.primary }}
                          >
                            {child.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </>
        ) : (
          // ==================== DESKTOP MENU ====================
          <div className="flex items-center justify-center gap-25 relative">
            {/* Left Navigation */}
            <nav className="flex gap-4">
              {leftItems.map((item) => (
                <div key={item.path} className="relative group">
                  <a href={'/' + getFullRoute(item)} className="nav-link" style={{ color: THEME.colors.primary }}>
                    {item.title}
                  </a>

                  {item.children && item.children.length > 0 && (
                    <div className="dropdown-menu">
                      {item.children.map((child) => (
                        <a key={child.path} href={'/' + getFullRoute(child)} className="dropdown-item">
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Central Logo */}
            <div className="absolute -top-8 transform hover:scale-110 transition-transform duration-300">
              <a
                href="/"
                className="block rounded-full bg-white shadow-2xl overflow-hidden"
                style={{
                  width: `${THEME.logo.size}px`,
                  height: `${THEME.logo.size}px`,
                  border: `${THEME.logo.borderWidth}px solid ${THEME.colors.border}`,
                }}
              >
                {logo?.url ? (
                  <Image src={logo.url} alt={logo.alt} width={THEME.logo.size} height={THEME.logo.size} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-400">
                    <span className="text-2xl font-bold text-white">Logo</span>
                  </div>
                )}
              </a>
            </div>

            {/* Right Navigation */}
            <nav className="flex gap-4">
              {rightItems.map((item) => (
                <div key={item.path} className="relative group">
                  <a href={'/' + getFullRoute(item)} className="nav-link" style={{ color: THEME.colors.primary }}>
                    {item.title}
                  </a>

                  {item.children && item.children.length > 0 && (
                    <div className="dropdown-menu">
                      {item.children.map((child) => (
                        <a key={child.path} href={'/' + getFullRoute(child)} className="dropdown-item">
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HamburgerMenuPage;
