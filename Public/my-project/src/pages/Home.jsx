import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showCarousel, setShowCarousel] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [backgroundColors, setBackgroundColors] = useState([
    'from-pink-400 to-purple-500',
    'from-blue-400 to-teal-500', 
    'from-yellow-400 to-orange-500',
    'from-green-400 to-emerald-500'
  ]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    fetchTrips();
  }, [currentPage, search, sortBy, sortOrder, selectedCountry]);

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

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let order = sortOrder;
      if (sortBy === 'oldest') {
        order = 'ASC';
      } else if (sortBy === 'rating') {
        order = 'DESC';
      }
      const { data } = await axios.get(
        `http://localhost:3000/trips?page=${currentPage}&search=${search}&sortBy=${sortBy === 'oldest' ? 'createdAt' : sortBy}&sortOrder=${order}&negara=${selectedCountry}`
      );
      setTrips(data.trips || []);
      setTotalPages(data.totalPages);
      setShowCarousel(!search && !selectedCountry);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Gagal memuat data perjalanan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    setCurrentPage(1);
  };

  const handleSort = (sortByValue) => {
    setSortBy(sortByValue);
    if (sortByValue === 'oldest') {
      setSortOrder('ASC');
    } else {
      setSortOrder('DESC');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const handleCountryFilter = (country) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
          className="text-3xl"
        >
          🌏
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-red-500">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-screen perspective-1000 relative overflow-hidden"
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
      <div className="relative z-10 h-full w-full overflow-y-auto">
        <Navbar onSearch={handleSearch} onCountryFilter={handleCountryFilter} />
        
        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-between items-center mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold text-white transform-style-3d">Jelajah ASEAN</h1>
              <p className="text-white">Never stop exploring the world.</p>
            </motion.div>
            
            <motion.div 
              className="flex gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <select 
                className="px-4 py-2 rounded bg-white/20 backdrop-blur-md text-white transform hover:scale-105 transition-transform"
                onChange={(e) => handleSort(e.target.value)}
                value={sortBy}
              >
                <option value="createdAt">Terbaru</option>
                <option value="rating">Rating</option>
                <option value="oldest">Terlama</option>
              </select>
            </motion.div>
          </motion.div>

          {showCarousel && trips && trips.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Carousel responsive={responsive}>
                {trips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden cursor-pointer mx-2 h-[350px] transform-style-3d"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 15,
                      z: 50,
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                    }}
                    onClick={() => handleTripClick(trip.id)}
                  >
                    <motion.img
                      src={trip.imageUrl}
                      alt={trip.trip_name}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div className="p-4 text-white">
                      <h2 className="text-xl font-semibold mb-2">{trip.trip_name}</h2>
                      <p className="text-sm mb-2">📍 {trip.negara}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-300 mr-1">⭐</span>
                        {trip.rating}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </Carousel>
            </motion.div>
          )}

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {trips && trips.length > 0 ? (
              trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden cursor-pointer transform-style-3d relative group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 15,
                    z: 50,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                  }}
                  onClick={() => handleTripClick(trip.id)}
                >
                  <motion.img
                    src={trip.imageUrl}
                    alt={trip.trip_name}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.div className="p-4 text-white">
                    <h2 className="text-xl font-semibold mb-2">{trip.trip_name}</h2>
                    <p className="text-sm mb-2 line-clamp-3">{trip.content}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">📍 {trip.negara}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-300 mr-1">⭐</span>
                        {trip.rating}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <motion.p 
                className="col-span-3 text-center text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Tidak ada data perjalanan yang ditemukan
              </motion.p>
            )}
          </motion.div>

          {trips && trips.length > 0 && (
            <motion.div 
              className="flex justify-center mt-8 gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded backdrop-blur-md ${
                    currentPage === index + 1
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white hover:bg-white/30"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
};
