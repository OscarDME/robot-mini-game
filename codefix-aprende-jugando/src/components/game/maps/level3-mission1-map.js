'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Level3Mission1Map({ playAnimation, showSolution, setShowSolution }) {
  const [step, setStep] = useState(0);
  const [collectedStars, setCollectedStars] = useState(0);
  
  useEffect(() => {
    if (playAnimation) {
      // Reiniciar estado
      setStep(0);
      setCollectedStars(0);
      
      // Simular la animación de recoger estrellas, una por una
      const stepInterval = 1000; // 1 segundo por paso
      
      // Recoger 4 estrellas (ciclo incorrecto)
      for (let i = 1; i <= 4; i++) {
        setTimeout(() => {
          setStep(i);
          setCollectedStars(i);
        }, stepInterval * i);
      }
      
      // Mostrar la solución después
      setTimeout(() => {
        setShowSolution(true);
      }, stepInterval * 5);
    }
  }, [playAnimation, setShowSolution]);
  
  return (
    <div className="relative w-full h-0 pb-[60%] sm:pb-[50%] bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Fondo */}
      <div className="absolute inset-0 bg-blue-50"></div>
      
      {/* Camino */}
      <div className="absolute left-[10%] top-[40%] w-[80%] h-[2%] bg-gray-200 rounded"></div>
      
      {/* Estrellas (5 en total) */}
      <div className="absolute left-[20%] top-[35%] flex space-x-[15%]">
        {[1, 2, 3, 4, 5].map((starNum) => (
          <motion.div 
            key={starNum}
            className="text-yellow-400 text-2xl"
            animate={{
              scale: collectedStars >= starNum ? [1, 1.5, 0] : 1,
              opacity: collectedStars >= starNum ? [1, 1, 0] : 1
            }}
            transition={{ duration: 0.5 }}
          >
            ★
          </motion.div>
        ))}
      </div>
      
      {/* Robot */}
      <motion.div 
        className="absolute left-[10%] top-[35%] w-[8%] h-[12%] sm:w-[6%] sm:h-[10%] z-10"
        animate={{
          x: `${step * 15}%`
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full bg-blue-500 rounded-t-full relative">
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] left-[25%]"></div>
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] right-[25%]"></div>
          <motion.div 
            className="absolute w-[40%] h-[10%] bg-white rounded-full bottom-[25%] left-[30%]"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>
      
      {/* Indicador de bucle */}
      {playAnimation && (
        <div className="absolute top-[20%] left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-medium shadow-sm">
            {step === 0 && "Iniciando bucle: repetir 4 veces"}
            {step > 0 && step < 5 && `Iteración ${step} de 4: Estrella recogida ✓`}
            {step >= 4 && !showSolution && "¡Bucle completado! Pero falta una estrella ❌"}
            {showSolution && "Solución: el bucle debe repetirse 5 veces ✓"}
          </div>
        </div>
      )}
      
      {/* Solución correcta (solo visible después de mostrar la solución) */}
      {showSolution && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-4 z-30">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Problema encontrado:</h4>
          
          <div className="relative w-full max-w-xs h-32 bg-slate-50 rounded-lg border border-gray-200 mb-4 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {Array(5).fill().map((_, i) => (
                <div key={i} className="text-yellow-400 text-2xl">★</div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 text-xs font-medium text-gray-500">
              Total: 5 estrellas
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-red-50 p-2 rounded border border-red-200">
              <div className="text-xs text-red-500 font-medium">Código incorrecto:</div>
              <div className="text-xs text-gray-700 mt-1">
                <div>repetir <span className="text-red-500 font-medium">4</span> veces</div>
                <div>&nbsp;&nbsp;mover adelante</div>
                <div>&nbsp;&nbsp;recoger estrella</div>
              </div>
              <div className="text-xs text-red-500 mt-1">Solo recoge 4 de 5 estrellas ❌</div>
            </div>
            
            <div className="bg-green-50 p-2 rounded border border-green-200">
              <div className="text-xs text-green-600 font-medium">Código correcto:</div>
              <div className="text-xs text-gray-700 mt-1">
                <div>repetir <span className="text-green-600 font-medium">5</span> veces</div>
                <div>&nbsp;&nbsp;mover adelante</div>
                <div>&nbsp;&nbsp;recoger estrella</div>
              </div>
              <div className="text-xs text-green-600 mt-1">Recoge todas las estrellas ✓</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bucle incorrecto */}
      <div className="absolute left-2 bottom-2 text-xs text-red-500 bg-white/80 p-1 rounded">
        <div>repetir 4 veces</div>
        <div>&nbsp;&nbsp;mover adelante</div>
        <div>&nbsp;&nbsp;recoger estrella ❌</div>
      </div>
      
      {/* Bucle correcto */}
      <div className="absolute right-2 bottom-2 text-xs text-green-500 bg-white/80 p-1 rounded">
        <div>repetir 5 veces</div>
        <div>&nbsp;&nbsp;mover adelante</div>
        <div>&nbsp;&nbsp;recoger estrella ✓</div>
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