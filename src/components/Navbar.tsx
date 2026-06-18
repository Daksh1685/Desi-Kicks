import React from 'react';
import { Icon } from './ui/Icon';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="/" className="font-bold text-2xl tracking-wide text-gray-900">
          DESIKICKS<span className="text-purple-600">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <a className="hover:text-purple-600 transition-colors" href="#">New Drops</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Men</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Women</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Kids</a>
          <a className="hover:text-purple-600 transition-colors" href="#">Sale</a>
        </nav>
        <div className="hidden md:flex relative flex-1 max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sneakers, brands..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
          />
        </div>
        <div className="flex items-center gap-1 md:gap-3 text-gray-700">
          <button className="p-2 hover:text-purple-600 transition-colors"><Icon name="favorite" className="w-6 h-6" /></button>
          <button className="p-2 hover:text-purple-600 transition-colors relative">
            <Icon name="shopping_bag" className="w-6 h-6" />
            <span className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="p-2 hover:text-purple-600 transition-colors hidden md:inline-flex"><Icon name="person" className="w-6 h-6" /></button>
        </div>
      </div>
    </header>
  );
}
