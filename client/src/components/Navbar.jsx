import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to={user ? '/home' : '/'} 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="ThoughtDrop Logo" className="h-10 w-10" />
          <span className="text-xl font-bold">ThoughtDrop</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;