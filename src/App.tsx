import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Shirt, Layers, CalendarDays, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import WardrobePage from '@/pages/WardrobePage';
import OutfitPage from '@/pages/OutfitPage';
import CalendarPage from '@/pages/CalendarPage';
import CollectionPage from '@/pages/CollectionPage';

const navItems = [
  { to: '/', label: '衣橱', icon: Shirt, emoji: '👔' },
  { to: '/outfit', label: '搭配', icon: Layers, emoji: '👗' },
  { to: '/calendar', label: '日历', icon: CalendarDays, emoji: '📅' },
  { to: '/collection', label: '收藏', icon: Bookmark, emoji: '⭐' },
];

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory font-body">
      <main className="flex-1 pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<WardrobePage />} />
          <Route path="/outfit" element={<OutfitPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/collection" element={<CollectionPage />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-sand/40 bg-white/90 backdrop-blur-lg lg:static lg:border-t-0 lg:bg-transparent lg:backdrop-blur-none">
        <div className="mx-auto flex max-w-5xl items-center justify-around lg:flex-col lg:gap-1 lg:py-6 lg:px-4">
          {navItems.map(({ to, label, icon: Icon, emoji }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 py-2 px-4 text-[10px] font-medium transition-colors lg:flex-row lg:gap-2 lg:rounded-wardrobe lg:px-3 lg:py-2.5 lg:text-sm',
                  isActive
                    ? 'text-terracotta lg:bg-terracotta/8'
                    : 'text-warm-gray hover:text-charcoal lg:hover:bg-light-warm/60'
                )
              }
            >
              <span className="lg:hidden text-sm">{emoji}</span>
              <Icon className="h-4 w-4 hidden lg:block" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
