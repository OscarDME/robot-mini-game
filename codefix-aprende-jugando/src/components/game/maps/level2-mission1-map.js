'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Level2Mission1Map({ playAnimation, showSolution, setShowSolution }) {
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'thinking', 'correct', 'wrong'
  
  useEffect(() => {
    if (playAnimation) {
      // El robot piensa qué hacer
      setAnimationState('thinking');
      
      // Después de pensar, toma la decisión incorrecta 
      setTimeout(() => {
        setAnimationState('wrong');
      }, 2000);
      
      // Mostrar solución después
      setTimeout(() => {
        setShowSolution(true);
        setAnimationState('correct');
      }, 4000);
    } else {
      setAnimationState('initial');
    }
  }, [playAnimation, setShowSolution]);
  
  return (
    <div className="relative w-full h-0 pb-[60%] sm:pb-[50%] bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Fondo - agua */}
      <div className="absolute inset-0 bg-blue-100"></div>
      
      {/* Orillas */}
      <div className="absolute left-0 top-0 h-full w-[25%] bg-green-200"></div>
      <div className="absolute right-0 top-0 h-full w-[25%] bg-green-200"></div>
      
      {/* Puente roto */}
      <div className="absolute left-[25%] top-[45%] h-2 w-[25%] bg-gray-700"></div>
      <div className="absolute right-[25%] top-[45%] h-2 w-[15%] bg-gray-700"></div>
      
      {/* Sección rota */}
      <div className="absolute left-[50%] top-[45%] h-2 w-[10%] bg-blue-300 border border-red-400 border-dashed"></div>
      
      {/* Robot en la orilla izquierda */}
      <motion.div 
        className="absolute left-[15%] top-[40%] w-[8%] h-[12%] sm:w-[6%] sm:h-[10%] z-10"
        animate={{
          x: animationState === 'wrong' ? [0, 100, 50, 0] : 0,
          y: animationState === 'wrong' ? [0, 0, 50, 0] : 0,
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          x: { duration: 2, times: [0, 0.4, 0.7, 1], repeat: 0 },
          y: { duration: 2, times: [0, 0.4, 0.7, 1], repeat: 0 },
          rotate: { duration: 2, repeat: Infinity } 
        }}
      >
        <div className="w-full h-full bg-blue-500 rounded-t-full relative">
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] left-[25%]"></div>
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] right-[25%]"></div>
          <motion.div 
            className="absolute w-[40%] h-[10%] bg-white rounded-full bottom-[25%] left-[30%]"
            animate={{ 
              scaleX: animationState === 'thinking' 
                ? [1, 1.2, 0.8, 1] 
                : (animationState === 'wrong' ? [1, 0.5, 1] : [1, 1.2, 1])
            }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>
      
      {/* Pensamiento del robot */}
      {playAnimation && animationState === 'thinking' && (
        <motion.div 
          className="absolute left-[25%] top-[25%] bg-white p-2 rounded-lg shadow-md text-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-gray-600">if</span>
            <span className="text-red-500">(puente está roto)</span>
            <span className="text-gray-900">{ }</span>
          </div>
          <div className="ml-3 text-blue-600">
            cruzar puente
          </div>
        </motion.div>
      )}
      
      {/* Indicador de condición */}
      {playAnimation && (
        <div className="absolute top-[20%] left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-medium shadow-sm">
            {animationState === 'initial' && "Evaluando condición..."}
            {animationState === 'thinking' && "Condición: puente está roto = VERDADERO ✓"}
            {animationState === 'wrong' && "¡Error! El robot intenta cruzar un puente roto ❌"}
            {animationState === 'correct' && "Solución: NO cruzar cuando el puente está roto ✓"}
          </div>
        </div>
      )}
      
      {/* Condición incorrecta */}
      <div className="absolute left-5 bottom-3 text-xs text-red-500 bg-white/80 p-1 rounded">
        <div>si puente está roto</div>
        <div>&nbsp;&nbsp;cruzar puente ❌</div>
      </div>
      
      {/* Condición correcta */}
      <div className="absolute right-5 bottom-3 text-xs text-green-500 bg-white/80 p-1 rounded">
        <div>si puente no está roto</div>
        <div>&nbsp;&nbsp;cruzar puente ✓</div>
      </div>
      
      {/* Ayuda para interpretar el mapa */}
      {!playAnimation && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/80 rounded-full text-xs text-gray-500 shadow-sm">
            ¡Ejecuta el código para ver qué sucede!
          </div>
        </div>
      )}
    </div>
  );
}