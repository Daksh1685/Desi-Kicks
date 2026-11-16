import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface DropdownItem {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownGroup {
  group: string;
  items: DropdownItem[];
}

export type DropdownOption = DropdownItem | DropdownGroup;

function isDropdownGroup(option: DropdownOption): option is DropdownGroup {
  return 'group' in option && Array.isArray((option as DropdownGroup).items);
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'outline';
  fullWidth?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  required?: boolean;
  clearable?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  helperText,
  error,
  searchable = false,
  searchPlaceholder = 'Search options...',
  disabled = false,
  size = 'md',
  variant = 'default',
  fullWidth = true,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  required = false,
  clearable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flatten all items for lookup
  const allItems = useMemo<DropdownItem[]>(() => {
    const list: DropdownItem[] = [];
    options.forEach((opt) => {
      if (isDropdownGroup(opt)) {
        list.push(...opt.items);
      } else {
        list.push(opt);
      }
    });
    return list;
  }, [options]);

  // Selected item
  const selectedItem = useMemo(
    () => allItems.find((item) => item.value === value),
    [allItems, value]
  );

  // Close helper that cleans up search query
  const closeMenu = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Filtered options based on search query
  const filteredOptions = useMemo<DropdownOption[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;

    const matchItem = (item: DropdownItem) =>
      item.label.toLowerCase().includes(query) ||
      item.value.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));

    const result: DropdownOption[] = [];

    options.forEach((opt) => {
      if (isDropdownGroup(opt)) {
        const matchingItems = opt.items.filter(matchItem);
        if (matchingItems.length > 0) {
          result.push({
            group: opt.group,
            items: matchingItems,
          });
        }
      } else if (matchItem(opt)) {
        result.push(opt);
      }
    });

    return result;
  }, [options, searchQuery]);

  // Size styling tokens
  const sizeStyles = {
    sm: {
      btn: 'py-1.5 px-3 text-xs rounded-lg',
      item: 'py-1.5 px-2.5 text-xs',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      btn: 'py-2 px-3 text-sm rounded-xl',
      item: 'py-2 px-3 text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      btn: 'py-2.5 px-4 text-base rounded-xl',
      item: 'py-2.5 px-3.5 text-base',
      icon: 'w-4.5 h-4.5',
    },
  }[size];

  // Variant styling tokens
  const variantStyles = {
    default:
      'bg-white border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 shadow-2xs',
    subtle:
      'bg-gray-50 border-gray-200/80 hover:bg-gray-100 hover:border-gray-300 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900',
    outline:
      'bg-transparent border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900',
  }[variant];

  const handleSelect = (itemValue: string) => {
    onChange(itemValue);
    closeMenu();
  };

  const handleToggle = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}
    >
      {/* Label */}
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full border flex items-center justify-between gap-2.5 font-medium transition cursor-pointer text-left select-none outline-none ${sizeStyles.btn} ${variantStyles} ${
          error ? '!border-red-400 !focus:ring-red-200' : ''
        } ${disabled ? 'opacity-50 !cursor-not-allowed !bg-gray-100' : ''} ${
          isOpen ? 'border-primary ring-2 ring-primary/20' : ''
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          {selectedItem?.icon && (
            <span className="shrink-0 text-gray-500">{selectedItem.icon}</span>
          )}
          <span
            className={`truncate ${
              selectedItem ? 'text-gray-900 font-medium' : 'text-gray-400'
            }`}
          >
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          {selectedItem?.badge && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-primary/10 text-primary shrink-0">
              {selectedItem.badge}
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0 text-gray-400">
          {clearable && selectedItem && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
              className="p-0.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition"
              title="Clear selection"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}

          <svg
            className={`${sizeStyles.icon} transition-transform duration-200 text-gray-500 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      {/* Floating Menu Popup */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black/5 flex flex-col max-h-72 overflow-hidden animate-scale-up ${menuClassName}`}
        >
          {/* Optional Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100 bg-gray-50/70 sticky top-0 z-10">
              <div className="relative flex items-center">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 text-xs p-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options Scrollable Container */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 divide-y divide-gray-50">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <p className="text-xs text-gray-400">No matching options found</p>
                {searchQuery && (
                  <p className="text-[11px] text-gray-300 mt-0.5 truncate">
                    "{searchQuery}"
                  </p>
                )}
              </div>
            ) : (
              filteredOptions.map((opt, optIdx) => {
                if (isDropdownGroup(opt)) {
                  return (
                    <div key={`group-${opt.group}-${optIdx}`} className="pt-2 first:pt-0">
                      <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none bg-gray-50/50 rounded-md mb-1">
                        {opt.group}
                      </div>
                      <div className="space-y-0.5">
                        {opt.items.map((item) => (
                          <OptionRow
                            key={item.value}
                            item={item}
                            isSelected={item.value === value}
                            sizeItemCls={sizeStyles.item}
                            onSelect={() => !item.disabled && handleSelect(item.value)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <OptionRow
                    key={opt.value}
                    item={opt}
                    isSelected={opt.value === value}
                    sizeItemCls={sizeStyles.item}
                    onSelect={() => !opt.disabled && handleSelect(opt.value)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Helper text or Error message */}
      {error ? (
        <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

interface OptionRowProps {
  item: DropdownItem;
  isSelected: boolean;
  sizeItemCls: string;
  onSelect: () => void;
}

function OptionRow({ item, isSelected, sizeItemCls, onSelect }: OptionRowProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={`group flex items-center justify-between gap-2.5 rounded-lg transition-colors cursor-pointer select-none ${sizeItemCls} ${
        item.disabled
          ? 'opacity-40 cursor-not-allowed bg-gray-50'
          : isSelected
          ? 'bg-primary/10 text-primary font-bold'
          : 'text-gray-700 hover:bg-orange-50/70 hover:text-primary'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {item.icon && (
          <span
            className={`shrink-0 transition-colors ${
              isSelected ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
            }`}
          >
            {item.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                }`}
              >
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <p
              className={`text-[11px] truncate mt-0.5 ${
                isSelected ? 'text-primary/80' : 'text-gray-400 group-hover:text-primary/70'
              }`}
            >
              {item.description}
            </p>
          )}
        </div>
      </div>

      {isSelected && (
        <svg
          className="w-4 h-4 shrink-0 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
    </div>
  );
}
