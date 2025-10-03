// components/Navbar.jsx
'use client';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu after clicking a link (mobile only)
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-pink-500/90 backdrop-blur-lg transition-all duration-500 z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-4">
          
          {/* Logo + Mobile Toggle */}
          <div className="flex w-full justify-between items-center lg:w-auto">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/assets/logo.png"
                alt="GlamLink Logo"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-white font-bold text-xl tracking-wide">
                GlamLink
              </span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 text-white rounded-lg lg:hidden hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              aria-controls="navbar"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Nav Links */}
          <div
            className={`${isOpen ? 'block' : 'hidden'} w-full lg:flex lg:items-center lg:pl-12 max-lg:py-4`}
            id="navbar"
          >
            <ul className="flex flex-col lg:flex-row max-lg:gap-4 mt-4 lg:mt-0 lg:space-x-8">
              {[
                { name: 'Home', href: '#' },
                { name: 'About Us', href: '#about-us' },
                { name: 'Subscription Plans', href: '#plans' },
                { name: "FAQ's", href: '#questions' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="relative text-white hover:text-yellow-100 text-base font-medium transition-colors duration-300 block
                      after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:-bottom-1 
                      after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 lg:ml-auto mt-6 lg:mt-0 space-y-2 lg:space-y-0 lg:space-x-4">
              <a
                href="/login"
                onClick={handleLinkClick}
                className="bg-white text-pink-600 rounded-full font-semibold text-center shadow px-6 py-2 text-sm 
                hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
              >
                Login
              </a>
              <a
                href="/signup"
                onClick={handleLinkClick}
                className="bg-pink-700 text-white rounded-full font-semibold text-center shadow px-6 py-2 text-sm 
                hover:bg-pink-800 hover:scale-105 transition-transform duration-300"
              >
                Sign Up
              </a>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
