import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X, Repeat2, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-violet-600">
          <Repeat2 size={24} />
          SwapSkill
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className={linkClass('/browse')}>Browse</Link>
          {user && (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/my-listings" className={linkClass('/my-listings')}>My Listings</Link>
            </>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/listings/new"
                className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                <PlusCircle size={16} />
                Post Listing
              </Link>
              <Link to={`/profile/${user._id}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm">
                  {user.name[0].toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-violet-600">Log in</Link>
              <Link to="/register" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3">
          <Link to="/browse" className="text-sm text-slate-700" onClick={() => setOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-700" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/my-listings" className="text-sm text-slate-700" onClick={() => setOpen(false)}>My Listings</Link>
              <Link to="/listings/new" className="text-sm text-slate-700" onClick={() => setOpen(false)}>Post Listing</Link>
              <Link to={`/profile/${user._id}`} className="text-sm text-slate-700" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-sm text-red-500 text-left">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-700" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="text-sm text-violet-600 font-medium" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
