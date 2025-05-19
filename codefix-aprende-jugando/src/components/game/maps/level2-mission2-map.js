'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Level2Mission2Map({ playAnimation, showSolution, setShowSolution }) {
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'raining', 'wrong', 'correct'
  
  useEffect(() => {
    if (playAnimation) {
      // Empieza a llover
      setAnimationState('raining');
      
      // Después, el robot verifica la condición incorrectamente
      setTimeout(() => {
        setAnimationState('wrong');
      }, 2000);
      
      // Mostrar la solución después
      setTimeout(() => {
        setAnimationState('correct');
        setShowSolution(true);
      }, 4000);
    } else {
      setAnimationState('initial');
    }
  }, [playAnimation, setShowSolution]);
  
  return (
    <div className="relative w-full h-0 pb-[60%] sm:pb-[50%] bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Cielo */}
      <div className="absolute inset-0 bg-blue-100"></div>
      
      {/* Suelo */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-green-200"></div>
      
      {/* Nubes */}
      <div className="absolute top-4 left-5 h-5 w-12 bg-gray-300 rounded-full"></div>
      <div className="absolute top-2 left-10 h-5 w-10 bg-gray-300 rounded-full"></div>
      <div className="absolute top-5 right-8 h-6 w-14 bg-gray-300 rounded-full"></div>
      
      {/* Gotas de lluvia */}
      {animationState !== 'initial' && (
        <motion.div
          className="absolute top-10 left-0 right-0 flex justify-around"
          animate={{ y: [0, 100] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
        >
          {Array(12).fill().map((_, i) => (
            <div key={i} className="h-2 w-0.5 bg-blue-400 rounded-full"></div>
          ))}
        </motion.div>
      )}
      
      {/* Robot */}
      <motion.div 
        className="absolute bottom-[30%] left-[40%] w-[10%] h-[15%] sm:w-[8%] sm:h-[12%] z-10"
        animate={{
          y: animationState === 'wrong' ? [0, -5, 0] : 0
        }}
        transition={{ duration: 0.5, repeat: animationState === 'wrong' ? 2 : 0 }}
      >
        <div className="w-full h-full bg-blue-500 rounded-t-full relative">
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] left-[25%]"></div>
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] right-[25%]"></div>
          <motion.div 
            className="absolute w-[40%] h-[10%] bg-white rounded-full bottom-[25%] left-[30%]"
            animate={{ 
              scaleX: animationState === 'wrong' 
                ? [1, 0.5, 1] 
                : [1, 1.2, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>
      
      {/* Paraguas en estado correcto */}
      {animationState === 'correct' && (
        <motion.div
          className="absolute bottom-[50%] left-[38%] w-[15%] h-[10%] z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-full h-full bg-red-400 rounded-full"></div>
          <div className="absolute bottom-0 left-[48%] w-[4%] h-[60%] bg-red-500"></div>
        </motion.div>
      )}
      
      {/* Pensamiento del robot */}
      {playAnimation && animationState === 'raining' && (
        <motion.div 
          className="absolute left-[55%] top-[30%] bg-white p-2 rounded-lg shadow-md text-xs max-w-[40%]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-gray-600">if</span>
            <span className="text-red-500">(lluvia = verdadero)</span>
            <span className="text-gray-900">{ }</span>
          </div>
          <div className="ml-3 text-blue-600">
            abrir paraguas
          </div>
        </motion.div>
      )}
      
      {/* Indicador de condición */}
      {playAnimation && (
        <div className="absolute top-[15%] left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-medium shadow-sm">
            {animationState === 'initial' && "Evaluando condición..."}
            {animationState === 'raining' && "lluvia = verdadero (¡Está asignando, no comparando!)"}
            {animationState === 'wrong' && "¡Error! El operador '=' asigna en vez de comparar ❌"}
            {animationState === 'correct' && "Correcto: si lluvia == verdadero ✓"}
          </div>
        </div>
      )}
      
      {/* Código incorrecto */}
      <div className="absolute left-2 bottom-2 text-xs text-red-500 bg-white/80 p-1 rounded">
        <div>si lluvia = verdadero</div>
        <div>&nbsp;&nbsp;abrir paraguas ❌</div>
      </div>
      
      {/* Código correcto */}
      <div className="absolute right-2 bottom-2 text-xs text-green-500 bg-white/80 p-1 rounded">
        <div>si lluvia == verdadero</div>
        <div>&nbsp;&nbsp;abrir paraguas ✓</div>
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