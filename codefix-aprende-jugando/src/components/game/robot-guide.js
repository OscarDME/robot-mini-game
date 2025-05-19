'use client';

import { motion } from 'framer-motion';
import { getRandomRobotColor } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function RobotGuide({ emotion = 'normal', message, animate = true }) {
  const [robotColor, setRobotColor] = useState('bg-blue-500');
  
  useEffect(() => {
    setRobotColor(getRandomRobotColor());
  }, []);

  // Definir la expresión facial del robot según su emoción
  const getFaceExpression = () => {
    switch (emotion) {
      case 'happy':
        return (
          <>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 left-4"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 right-4"></div>
            <div className="absolute w-10 h-3 bg-white rounded-full top-14 left-5 transform rotate-6"></div>
          </>
        );
      case 'thinking':
        return (
          <>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 left-4"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 right-4"></div>
            <div className="absolute w-6 h-2 bg-white rounded-full top-14 left-7"></div>
            <div className="absolute w-4 h-4 border-2 border-white rounded-full top-2 right-0 -rotate-12"></div>
          </>
        );
      case 'sad':
        return (
          <>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 left-4"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 right-4"></div>
            <div className="absolute w-8 h-2 bg-white rounded-full top-16 left-6 transform -rotate-12"></div>
          </>
        );
      default: // normal
        return (
          <>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 left-4"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full top-6 right-4"></div>
            <div className="absolute w-8 h-2 bg-white rounded-full top-14 left-6"></div>
          </>
        );
    }
  };

  return (
    <div className="flex items-end gap-4 mb-6">
      <motion.div
        initial={animate ? { y: 10, rotate: -5 } : false}
        animate={animate ? { y: [10, -10, 10], rotate: [-5, 5, -5] } : false}
        transition={animate ? { 
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        } : false}
        className="relative mb-2"
      >
        <div className={`w-20 h-24 ${robotColor} rounded-t-full relative shadow-lg`}>
          {getFaceExpression()}
          
          {/* Antenas */}
          <div className="absolute w-1 h-6 bg-gray-400 -top-6 left-6"></div>
          <div className="absolute w-1 h-4 bg-gray-400 -top-4 right-6"></div>
          <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-6 left-5"></div>
          
          {/* Cuerpo */}
          <div className={`absolute w-28 h-12 ${robotColor} rounded-xl -bottom-8 -left-4 shadow-md`}>
            <div className="absolute bottom-0 left-4 w-4 h-3 bg-gray-600 rounded-b-md"></div>
            <div className="absolute bottom-0 right-4 w-4 h-3 bg-gray-600 rounded-b-md"></div>
          </div>
        </div>
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-3 rounded-lg shadow-md text-sm max-w-xs relative bubble"
        >
          {message}
          <div className="absolute w-4 h-4 bg-white transform rotate-45 -left-2 bottom-4"></div>
        </motion.div>
      )}
    </div>
  );
}
