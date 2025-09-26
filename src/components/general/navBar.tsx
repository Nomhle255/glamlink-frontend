// components/Navbar.jsx
'use client';
import { useState } from 'react';
import { 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="py-5 lg:fixed w-full bg-pink-500 transition-all duration-500 z-50 scroll-smooth">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="flex justify-between lg:flex-row">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 ml-3 text-sm text-pink-500 rounded-lg lg:hidden hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
          <img
            src="/assets/logo.png"
            alt="GlamLink Logo"
            className="h-20 w-auto"
          />
          <div 
            className={`${isOpen ? 'block' : 'hidden'} w-full lg:flex lg:pl-11 max-lg:py-4`} 
            id="navbar"
          >
            <ul className="flex lg:items-center flex-col max-lg:gap-4 mt-4 lg:mt-0 lg:flex-row max-lg:mb-4">
              <li>
                <a href="#"
                  className="text-gray-700 hover:text-pink-600 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left">
                  Home
                </a>
              </li>
              <li>
                <a href="#about-us"
                  className="text-gray-700 hover:text-pink-600 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left">
                  About us
                </a>
              </li>
              <li>
                <a href="#plans"
                  className="text-gray-700 hover:text-pink-600 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left">
                  Subscription Plans
                </a>
              </li>
              <li>
                <a href="#questions"
                  className="text-gray-700 hover:text-pink-600 text-base lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 block lg:mr-6 md:mb-0 lg:text-left">
                  FAQ'S
                </a>
              </li>
            </ul>
            <div className="flex lg:items-center justify-start flex-col lg:flex-row max-lg:gap-4 lg:flex-1 lg:justify-end">
              <a
                href="/login"
                className="bg-pink-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-5 hover:bg-pink-700"
              >
                Login
              </a>
               <a
                href="/signup"
                className="bg-pink-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-5 hover:bg-pink-700"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
