import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../../components/ui/Icon';
import craftYourSoleLogo from '../../assets/craftyoursole_logo.svg';
import type { AdminSection, AdminNavItem } from './adminTypes';

interface AdminSidebarProps {
  navItems: AdminNavItem[];
  activeSection: AdminSection;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  adminUser: string;
  onLogout: () => void;
  onAddProduct: () => void;
}

export function AdminSidebar({
  navItems,
  activeSection,
  sidebarCollapsed,
  setSidebarCollapsed,
  adminUser,
  onLogout,
  onAddProduct,
}: AdminSidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56'
        } sticky top-0 h-screen overflow-hidden`}
    >
      {/* Brand */}
      <div
        className={`flex items-center border-b border-gray-100 min-h-[58px] ${sidebarCollapsed
            ? 'flex-col justify-center py-3 px-2 gap-2'
            : 'justify-between px-4 py-3'
          }`}
      >
        {!sidebarCollapsed ? (
          <Link
            to="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            title="CraftYourSole Storefront"
          >
            <img
              src={craftYourSoleLogo}
              alt="CraftYourSole"
              className="h-6 w-auto max-w-[130px]"
            />
          </Link>
        ) : (
          <Link
            to="/"
            className="flex items-center justify-center hover:opacity-90 transition-opacity"
            title="CraftYourSole Storefront"
          >
            <img
              src="/favicon.svg"
              alt="CraftYourSole"
              className="w-7 h-7 rounded-lg shadow-2xs"
            />
          </Link>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'} className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer group ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon
                name={item.icon as IconName}
                className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}

        {/* Add Product CTA */}
        <div className="pt-3">
          <button
            onClick={onAddProduct}
            title={sidebarCollapsed ? 'Add New Product' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#8a2600] transition-colors cursor-pointer shadow-sm ${sidebarCollapsed ? 'justify-center' : ''
              }`}
          >
            <span className="text-lg leading-none font-black shrink-0">+</span>
            {!sidebarCollapsed && <span>Add Product</span>}
          </button>
        </div>
      </nav>

      {/* Footer — user & logout */}
      <div className="border-t border-gray-100 p-3">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name="person" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{adminUser}</p>
              <p className="text-[10px] text-gray-400">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title="Sign out"
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''
            }`}
        >
          <Icon name="lock" className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
