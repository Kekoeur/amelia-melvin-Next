import React from 'react';
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
  return (
    <nav className={`absolute top-0 left-0 w-full z-10 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 60}
              className="h-auto"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;