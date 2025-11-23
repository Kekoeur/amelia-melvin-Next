import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface NavLink {
  href: string;
  label: string;
}

interface NavigationProps {
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  navLinks: NavLink[];
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ logo, navLinks, className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`absolute top-0 left-0 w-full z-10 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 z-20">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 60}
              className="h-auto"
            />
          </Link>

          {/* Bouton hamburger pour mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden z-20 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation Desktop */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="text-white hover:text-gray-200 transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-95 z-10">
              <ul className="flex flex-col items-center justify-center h-full space-y-8">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="text-white text-2xl hover:text-gray-200 transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;