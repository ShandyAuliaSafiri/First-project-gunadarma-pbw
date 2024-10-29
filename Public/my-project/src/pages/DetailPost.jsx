import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../component/Navbar2";
import { motion, AnimatePresence } from "framer-motion";

export default function DetailPost() {
  const [trip, setTrip] = useState(null);
  const { id } = useParams();
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [backgroundColors, setBackgroundColors] = useState([
    'from-pink-400 to-purple-500',
    'from-blue-400 to-teal-500',
    'from-yellow-400 to-orange-500', 
    'from-green-400 to-emerald-500'
  ]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

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
    const fetchTrip = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/trips/${id}`);
        console.log(data, "<<< data dari detail");
        setTrip(data);

        const tripsResponse = await axios.get(
          `http://localhost:3000/trips?page=${currentPage}`
        );

        setTrips(tripsResponse.data.trips);
        setTotalPages(tripsResponse.data.totalPages);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };
    fetchTrip();
  }, [id, currentPage]);

  if (!trip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen perspective-1000 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div 
        className={`fixed inset-0 bg-gradient-to-br ${backgroundColors[currentColorIndex]} transition-colors duration-1000`}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* Interactive Floating Elements */}
      <div className="fixed inset-0 overflow-hidden">
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

      <div className="fixed top-0 left-0 right-0 w-full z-50">
        <Navbar2 />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 mt-32 relative z-10"
      >
        <motion.div 
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-400/90 via-pink-500/90 to-red-500/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
          whileHover={{ 
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            scale: 1.01
          }}
        >
          <motion.div className="relative">
            <motion.img
              src={trip.imageUrl}
              alt={trip.trip_name}
              className="w-full h-[600px] object-cover filter brightness-90"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: isImageLoaded ? 1 : 0,
                scale: isImageLoaded ? 1 : 1.1
              }}
              transition={{ duration: 0.7 }}
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
          
          <motion.div 
            className="p-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h1 
              className="text-5xl font-extrabold mb-8 text-white pb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-100"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {trip.trip_name}
            </motion.h1>
            
            <div className="flex items-center justify-center space-x-6 mb-8">
              <motion.span 
                className="px-6 py-2 bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/30 font-semibold"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                {trip.negara}
              </motion.span>
              <motion.span 
                className="text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Array(trip.rating).fill('⭐').join('')}
              </motion.span>
            </div>

            <motion.div 
              className="prose max-w-none mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-white/90 leading-relaxed text-lg whitespace-pre-line text-justify">
                {trip.content}
              </p>
            </motion.div>

            <motion.div 
              className="border-t border-white/20 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center justify-center text-white/80">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 p-6 rounded-xl backdrop-blur-sm"
                >
                  <p className="font-semibold text-center text-lg mb-2">
                    Ditulis oleh: {trip.User?.firstName} {trip.User?.lastName}
                  </p>
                  <p className="text-center text-white/60">
                    Dibuat pada: {new Date(trip.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-10 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-green-200 to-green-100"
            whileHover={{ scale: 1.05 }}
          >
            ✨ Artikel Terkait Lainnya ✨
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {trips.map((relatedTrip, index) => (
                <motion.div
                  key={relatedTrip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/trips/${relatedTrip.id}`}
                    className="block"
                  >
                    <motion.div 
                      className="bg-gradient-to-r from-violet-500/90 via-purple-500/90 to-fuchsia-500/90 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 border border-white/20 backdrop-blur-lg"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <img
                          src={relatedTrip.imageUrl}
                          alt={relatedTrip.trip_name}
                          className="w-full h-64 object-cover filter brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-white">
                          {relatedTrip.trip_name}
                        </h3>
                        <p className="text-white/80 mb-4 line-clamp-3">
                          {relatedTrip.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-sm px-4 py-2 bg-white/10 rounded-full">
                            {relatedTrip.negara}
                          </span>
                          <span className="text-lg">
                            {Array(relatedTrip.rating).fill('⭐').join('')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-3">
            {[...Array(totalPages)].map((_, index) => (
              <motion.button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-6 py-3 rounded-xl backdrop-blur-md font-semibold transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-white/30 text-white border-2 border-white/50"
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
