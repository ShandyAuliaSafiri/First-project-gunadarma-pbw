import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onSearch, onCountryFilter }) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchButtonHovered, setIsSearchButtonHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [backgroundColors, setBackgroundColors] = useState([
    'from-pink-400 to-purple-500',
    'from-blue-400 to-teal-500', 
    'from-yellow-400 to-orange-500',
    'from-green-400 to-emerald-500'
  ]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailPage = location.pathname.includes('/trips');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % backgroundColors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 25,
        y: (e.clientY / window.innerHeight) * 25
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToSearchHistory = (searchTerm) => {
    const newHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      onSearch(search.trim());
      saveToSearchHistory(search.trim());
      setShowSearchHistory(false);
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      onSearch('');
    }
  }

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    onCountryFilter(country);
    setIsDropdownOpen(false);
  }

  const handleHomeClick = (e) => {
    e.preventDefault();
    setSearch('');
    setSelectedCountry('');
    onSearch('');
    onCountryFilter('');
    navigate("/");
  };

  const negaraAsean = [
    "Indonesia",
    "Malaysia", 
    "Singapura",
    "Thailand",
    "Vietnam",
    "Filipina",
    "Brunei",
    "Kamboja",
    "Laos",
    "Myanmar"
  ];

  return (
    <motion.nav 
      className="fixed w-full top-0 z-50 min-h-[80px] perspective-1000 relative overflow-visible"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${backgroundColors[currentColorIndex]} transition-colors duration-1000`}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* Interactive Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full backdrop-blur-sm"
            style={{
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 20}px`,
              height: `${Math.random() * 150 + 20}px`,
            }}
            animate={{
              x: mousePosition.x * (i + 1) * 0.1,
              y: mousePosition.y * (i + 1) * 0.1,
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center w-full max-w-5xl">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="mr-4"
              >
                <Link 
                  to="/" 
                  onClick={handleHomeClick}
                  className="flex items-center text-2xl font-bold text-white hover:text-blue-200 transition-all duration-300"
                >
                  <motion.div
                    initial={{ rotate: 0, x: 0 }}
                    animate={
                      isHovered 
                        ? { rotate: 360, scale: 1 }
                        : { 
                            rotate: [0, 10, -10, 10, 0],
                            x: [0, 10, -10, 10, 0],
                            transition: {
                              duration: 2,
                              repeat: Infinity
                            }
                          }
                    }
                    className="mr-2"
                  >
                    {isHovered ? '🌏' : '✈️'}
                  </motion.div>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-white"
                      >
                        Jelajah ASEAN
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              <AnimatePresence>
                {!isDetailPage && (
                  <motion.div 
                    className="flex-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={handleSearch} className="flex gap-4">
                      <motion.div
                        animate={{ scale: isSearchFocused ? 1.05 : 1 }}
                        className="relative flex-1"
                      >
                        <motion.input
                          type="text"
                          placeholder="Cari artikel..."
                          value={search}
                          onChange={handleSearchChange}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          className="px-4 py-2 rounded-lg w-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border-2 border-white/30 focus:border-white/50 focus:outline-none"
                        />
                      </motion.div>

                      <motion.button 
                        type="submit"
                        className="relative bg-white/20 backdrop-blur-md text-white p-2 rounded-full border-2 border-white/30 overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onHoverStart={() => setIsSearchButtonHovered(true)}
                        onHoverEnd={() => setIsSearchButtonHovered(false)}
                      >
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          animate={{ 
                            rotate: isSearchButtonHovered ? 360 : 0,
                            scale: isSearchButtonHovered ? 1.2 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                          />
                        </motion.svg>
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border-2 border-white/30 focus:outline-none"
                >
                  {selectedCountry || "Pilih Negara"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-full rounded-lg bg-white/20 backdrop-blur-md text-white border-2 border-white/30 z-50">
                    {negaraAsean.map((country) => (
                      <div 
                        key={country} 
                        onClick={() => handleCountryChange(country)} 
                        className="px-4 py-2 cursor-pointer hover:bg-white/30"
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
