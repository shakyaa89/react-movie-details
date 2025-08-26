import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Film, Home } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Movies", href: "/movie", icon: Film },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <Film className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
                <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Movie<span className="text-red-600">DB</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      active
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-black/95 backdrop-blur-md z-40">
            <div className="container mx-auto px-4 sm:px-6 py-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider px-3">
                    Navigation
                  </h3>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16 sm:h-20"></div>
    </>
  );
}

export default Navbar;
