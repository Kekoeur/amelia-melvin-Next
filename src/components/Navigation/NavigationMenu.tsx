"use client";
import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { NavigationProps } from "@/types/pages";
import { getFullRoute, buildNavigationTree } from "@/utils/navigationUtils";

/* Types génériques pour éviter la répétition */
interface HamburgerMenuProps {
  children: ReactNode;
  bgColor: string;
  textColor: string;
}

interface HamburgerMenuBrandProps {
  children: ReactNode;
  href: string;
}

interface HamburgerMenuTogglerProps {
  toggle: () => void;
}

interface HamburgerMenuCollapseProps {
  children: ReactNode;
  open: boolean;
}

interface HamburgerMenuItemProps {
  children: ReactNode;
}

interface HamburgerMenuLinkProps {
  children: ReactNode;
  href: string;
}

export const HamburgerMenuPage: React.FC<NavigationProps> = (navprops) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const structuredNav = buildNavigationTree(navprops.renderNavigation || []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <HamburgerMenu bgColor="bg-indigo-900" textColor="text-white">
      <HamburgerMenuBrand href="/">
        <svg height="25" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 153.6">
          <linearGradient id="a" x1="-2.778%" y1="32%" y2="67.556%">
            <stop offset="0" stopColor="#2298bd" />
            <stop offset="1" stopColor="#0ed7b5" />
          </linearGradient>
          <path
            d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0zM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8z"
            fill="url(#a)"
          />
        </svg>
      </HamburgerMenuBrand>

      {isMobile ? (
        <>
          <HamburgerMenuToggler toggle={toggle} />
          <HamburgerMenuCollapse open={open}>
            <HamburgerMenuNav>
              {structuredNav.map((item) => (
                <HamburgerMenuItem key={item.path}>
                  <HamburgerMenuLink href={'/'+getFullRoute(item)}>
                    {item.title}
                  </HamburgerMenuLink>
                  {/* Sous-menu */}
                  {item.children && item.children.length > 0 && (
                    <ul className="pl-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <HamburgerMenuLink href={'/'+getFullRoute(child)}>
                            {child.title}
                          </HamburgerMenuLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </HamburgerMenuItem>
              ))}
            </HamburgerMenuNav>
          </HamburgerMenuCollapse>
        </>
      ) : (
        <ul className="flex space-x-4">
          {structuredNav.map((item) => (
            <li key={item.path} className="relative group">
              <a href={'/'+getFullRoute(item)} className="text-white hover:text-gray-400">
                {item.title}
              </a>
              {/* Sous-menu */}
              {item.children && item.children.length > 0 && (
                <ul className="absolute left-0 mt-2 w-48 bg-indigo-900 text-white rounded-md shadow-lg hidden group-hover:block">
                  {item.children.map((child) => (
                    <li key={child.path} className="px-4 py-2 hover:bg-indigo-700">
                      <a href={'/'+getFullRoute(child)}>{child.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </HamburgerMenu>
  );
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ children, bgColor, textColor }) => (
  <nav className={`${bgColor} ${textColor} font-light shadow py-2 px-4`}>{children}</nav>
);

const HamburgerMenuBrand: React.FC<HamburgerMenuBrandProps> = ({ children, href }) => (
  <a href={href} className="inline-block pt-1.5 pb-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400">
    <strong>{children}</strong>
  </a>
);

const HamburgerMenuToggler: React.FC<HamburgerMenuTogglerProps> = ({ toggle }) => (
  <button
    type="button"
    aria-expanded="false"
    aria-label="Toggle navigation"
    className="float-right pt-1.5 text-3xl focus:outline-none focus:shadow"
    onClick={toggle}
  >
    &#8801;
  </button>
);

const HamburgerMenuCollapse: React.FC<HamburgerMenuCollapseProps> = ({ children, open }) => {
  const ref = useRef<HTMLDivElement | null>(null); // Typage correct

  const inlineStyle: CSSProperties = open
    ? { height: ref.current ? `${ref.current.scrollHeight}px` : 'auto' } // Assure que height est une valeur CSS valide
    : { height: 0, visibility: 'hidden' as const, opacity: 0 }; // 'as const' pour éviter le problème de type

  return (
    <div className="transition-height ease duration-300 overflow-hidden" style={inlineStyle} ref={ref}>
      {children}
    </div>
  );
};

export default HamburgerMenuCollapse;

const HamburgerMenuNav: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ul className="block pl-0 mb-0">{children}</ul>
);

const HamburgerMenuItem: React.FC<HamburgerMenuItemProps> = ({ children }) => <li>{children}</li>;

const HamburgerMenuLink: React.FC<HamburgerMenuLinkProps> = ({ children, href }) => (
  <a href={href} className="block cursor-pointer py-1.5 px-4  hover:text-gray-400 font-medium">
    {children}
  </a>
);
