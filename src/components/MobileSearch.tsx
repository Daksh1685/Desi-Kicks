import React from 'react';
import { Icon } from './ui/Icon';
import { useTypingEffect } from '../hooks/useTypingEffect';

export const SEARCH_KEYWORDS = [
  'sneakers',
  'Jordans',
  'Yeezys',
  'running shoes',
  'streetwear',
  'brands'
];

export function MobileSearch() {
  const typedText = useTypingEffect(SEARCH_KEYWORDS);

  return (
    <div className="px-4 py-4 bg-white md:hidden border-b border-gray-100">
      <div className="relative flex items-center">
        <Icon name="search" className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          className="w-full h-12 pl-10 pr-12 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm text-gray-900 transition-all placeholder:transition-all"
          placeholder={`Search for ${typedText}|`}
          type="text"
        />
        <Icon name="photo_camera" className="absolute right-3 text-primary cursor-pointer w-6 h-6 hover:scale-110 transition-transform" />
      </div>
    </div>
  );
}
