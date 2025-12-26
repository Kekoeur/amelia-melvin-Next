"use client";
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { NavigationProps } from "@/types/pages";
import { getFullRoute, buildNavigationTree } from "@/utils/navigationUtils";
import Image from "next/image";
import Link from "next/link";

/* ==================== THEME CONFIG ==================== */
const THEME = {
  logo: {
    size: 96,
    borderWidth: 2,
  },
  breakpoint: 1000,
} as const;

/* ==================== TYPES ==================== */
interface HamburgerMenuPageProps extends NavigationProps {
  logo?: {
    url?: string;
    alt: string;
    title: string;
  };
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
      style={{ width: s, height: s, color: 'inherit' }}
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
  const pathname = usePathname();
  const colors = navprops.colors || {};

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

  const activeItem = structuredNav.find(item => pathname === '/' + getFullRoute(item));
  const activeColor = activeItem && colors[activeItem.path] ? colors[activeItem.path] : 'var(--background)';

  return (
    <nav
      className="font-light"
    >
      <div className={`nav-container mx-auto ${isMobile ? 'flex-row flex-end' : ''}`} style={isMobile ? { background: activeColor } : {}}>
        {isMobile ? (
          // ==================== MOBILE MENU ====================
          <>
            <div className="mobile relative flex items-center justify-end" style={{ background: activeColor}}>
              <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-50">
                <Link
                  href="/"
                  className="block rounded-full bg-white shadow-2xl overflow-hidden hover:scale-110 transition-transform duration-300"
                  style={{
                    width: `${THEME.logo.size}px`,
                    height: `${THEME.logo.size}px`,
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
                </Link>
              </div>

              {/* SVG Toggle Button */}
              <IconToggle open={open} onClick={toggle} size={32} />
            </div>

            {/* Menu en position absolute pour overlay */}
            <div
              className="absolute left-0 right-0 top-full transition-all duration-300 ease-in-out overflow-hidden shadow-lg z-25"
              style={{
                ...(open
                  ? { maxHeight: "500px", opacity: 1, visibility: "visible" }
                  : { maxHeight: 0, opacity: 0, visibility: "hidden" }),
                background: activeColor,
              }}
            >
              <nav className="py-4">
                {structuredNav.map((item) => {
                  const itemRoute = '/' + getFullRoute(item);
                  const isActive = pathname === itemRoute;
                  
                  return (
                    <div key={item.path} className="mb-2">
                      <a
                        href={itemRoute}
                        className={`block px-4 py-2 rounded-lg transition-all duration-300 hover:translate-x-1 nav-link-mobile ${isActive ? 'active' : ''}`}
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
                            >
                              {child.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                )}
              </nav>
            </div>
          </>
        ) : (
          // ==================== DESKTOP MENU ====================
          <div className="flex items-center justify-center relative">
            {/* Left Navigation */}
            <nav className="flex">
              {leftItems.map((item) => {
                const itemRoute = '/' + getFullRoute(item);
                const isActive = pathname === itemRoute;
                const itemColor = colors[item.path] && isActive ? colors[item.path] : 'var(--background)';

                return (
                  <div key={item.path} className={`relative group ${isActive ? 'active' : ''}`}>
                    <div className="tab-corner-border-left" style={{ background: itemColor }}/>
                    <div className="tab-corner-border-right" style={{ background: itemColor }}/>
                    <div className="tab-corner-white-left" />
                    <div className="tab-corner-white-right" />
                    <a href={itemRoute} className={`nav-link ${isActive ? 'active' : ''}`} style={{ background: itemColor }}>
                      {item.title}
                    </a>

                    {item.children && item.children.length > 0 && (
                      <div className="dropdown-menu">
                        {item.children.map((child) => (
                          <Link key={child.path} href={'/' + getFullRoute(child)} className="dropdown-item">
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              )}
            </nav>

            {/* Central Logo */}
            <div className="logo transform hover:scale-110 transition-transform duration-300">
              <Link
                href="/"
                className="block rounded-full bg-white shadow-2xl overflow-hidden"
                style={{
                  width: `${THEME.logo.size}px`,
                  height: `${THEME.logo.size}px`,
                  marginBottom: `-${THEME.logo.size / 2}px`,
                }}
              >
                {logo?.url ? (
                  <Image src={logo.url} alt={logo.alt} width={THEME.logo.size} height={THEME.logo.size} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-400">
                    <span className="text-2xl font-bold text-white">Logo</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Right Navigation */}
            <nav className="flex">
              {rightItems.map((item) => {
                const itemRoute = '/' + getFullRoute(item);
                const isActive = pathname === itemRoute;
                const itemColor = colors[item.path] && isActive ? colors[item.path] : 'var(--background)';

                return (
                  <div key={item.path} className={`relative group ${isActive ? 'active' : ''}`}>
                    <div className="tab-corner-border-left" style={{ background: itemColor }}/>
                    <div className="tab-corner-border-right" style={{ background: itemColor }}/>
                    <div className="tab-corner-white-left" />
                    <div className="tab-corner-white-right" />
                    <a href={itemRoute} className={`nav-link ${isActive ? 'active' : ''}`} style={{ background: itemColor }}>
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
                )}
              )}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HamburgerMenuPage;
