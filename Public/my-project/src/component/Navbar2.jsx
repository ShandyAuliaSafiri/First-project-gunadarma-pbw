import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar2() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const backgroundColors = [
    'from-pink-400 to-purple-500',
    'from-blue-400 to-teal-500',
    'from-yellow-400 to-orange-500', 
    'from-green-400 to-emerald-500'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % backgroundColors.length);
    }, 5000);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 25,
        y: (e.clientY / window.innerHeight) * 25
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <motion.nav 
      className="relative overflow-hidden"
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full backdrop-blur-sm"
            style={{
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 50 + 10}px`,
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

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex justify-center items-center py-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Link 
              to="/" 
              onClick={handleHomeClick}
              className="flex items-center justify-center text-2xl font-bold text-white hover:text-blue-200 transition-all duration-300"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="mr-2"
              >
                🌏
              </motion.div>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: isHovered ? [-5, 0] : 0 }}
                transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0 }}
                className="flex justify-center backdrop-blur-sm px-3 py-1 rounded-lg"
              >
                <motion.span 
                  className="text-blue-200"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                >J</motion.span>
                <motion.span 
                  className="text-white bg-blue-500/50 px-1 rounded"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                >elajah</motion.span>
                <motion.span 
                  className="text-yellow-300 ml-2"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                >ASEAN</motion.span>
              </motion.div>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="ml-2 flex justify-center text-white"
                  >
                    ASEEEK
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
