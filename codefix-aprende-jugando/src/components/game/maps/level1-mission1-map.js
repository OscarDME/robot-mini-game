'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Level1Mission1Map({ playAnimation, showSolution, setShowSolution, currentStep, setCurrentStep }) {
  const [robotPosition, setRobotPosition] = useState({ x: 8.35, y: 37.5 }); // Posición inicial
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (playAnimation && !isAnimating) {
      // Comenzar animación
      setIsAnimating(true);
      
      // Reiniciar posición
      setRobotPosition({ x: 8.35, y: 37.5 });
      setCurrentStep(0);
      
      // Definir los movimientos con posiciones exactas que coinciden con las líneas
      const movements = [
        { direction: 'derecha', position: { x: 25, y: 37.5 } },    // Mover derecha (hasta el primer cruce)
        { direction: 'arriba', position: { x: 25, y: 12.5 } },     // Mover arriba (hasta el segundo cruce)
        { direction: 'derecha', position: { x: 41.7, y: 12.5 } },  // Mover derecha (hasta el tercer cruce)
        { direction: 'abajo', position: { x: 41.7, y: 62.5 } },    // Mover abajo (hasta el cuarto cruce)
        { direction: 'izquierda', position: { x: 25, y: 62.5 } }   // Mover izquierda (incorrecto)
      ];
      
      // Simular la animación paso a paso
      const stepInterval = 1200; // 1.2 segundos por paso
      
      movements.forEach((movement, index) => {
        setTimeout(() => {
          setCurrentStep(index + 1);
          setRobotPosition(movement.position);
        }, stepInterval * (index + 1));
      });
      
      // Finalizar animación
      setTimeout(() => {
        setIsAnimating(false);
      }, stepInterval * (movements.length + 1));
    }
  }, [playAnimation, setCurrentStep, setShowSolution, isAnimating]);
  
  return (
    <div className="relative w-full h-0 pb-[75%] sm:pb-[60%] md:pb-[50%] bg-slate-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Caminos disponibles */}
      <div className="absolute inset-[5%] border-4 border-dashed border-gray-200 rounded-lg"></div>
      
      {/* Camino correcto - líneas de puntos grises */}
      <div className="absolute left-[8.35%] top-[37.5%] w-[16.65%] h-[1%] bg-gray-300 rounded"></div>
      <div className="absolute left-[25%] top-[12.5%] w-[1%] h-[25%] bg-gray-300 rounded"></div>
      <div className="absolute left-[25%] top-[12.5%] w-[16.7%] h-[1%] bg-gray-300 rounded"></div>
      <div className="absolute left-[41.7%] top-[12.5%] w-[1%] h-[50%] bg-gray-300 rounded"></div>
      <div className="absolute left-[41.7%] top-[62.5%] w-[50%] h-[1%] bg-gray-300 rounded"></div>
      
      {/* Camino incorrecto */}
      <div className="absolute left-[25%] top-[62.5%] w-[16.7%] h-[1%] bg-gray-200 rounded"></div>
      
      {/* Posición inicial del robot */}
      <div className="absolute left-[8.35%] top-[37.5%] w-[6%] h-[9%] sm:w-[5%] sm:h-[7.5%] border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center">
        <span className="text-[10px] text-blue-500">Inicio</span>
      </div>
      
      {/* Meta (estrella) */}
      <div className="absolute right-[8.35%] top-[62.5%] w-[6%] h-[9%] sm:w-[5%] sm:h-[7.5%] flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="w-full h-full"
        >
          <svg className="w-full h-full text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </motion.div>
      </div>
      
      {/* Robot con animación - ajustado para seguir exactamente las líneas */}
      <motion.div 
        className="absolute z-20"
        style={{
          left: `${robotPosition.x}%`,
          top: `${robotPosition.y}%`,
          width: '6%',
          height: '9%',
          marginLeft: '-3%',
          marginTop: '-4.5%'
        }}
        initial={false}
        animate={{
          left: `${robotPosition.x}%`,
          top: `${robotPosition.y}%`,
          x: '0%', // Elimina cualquier transformación adicional
          y: '0%'
        }}
        transition={{ 
          type: "tween",
          duration: 0.8,
          ease: "linear" // Movimiento lineal para seguir exactamente las líneas
        }}
      >
        <div className="w-full h-full bg-blue-500 rounded-t-full relative flex flex-col items-center justify-center">
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] left-[25%]"></div>
          <div className="absolute w-[20%] h-[20%] bg-white rounded-full top-[25%] right-[25%]"></div>
          <motion.div 
            className="absolute w-[40%] h-[10%] bg-white rounded-full bottom-[25%] left-[30%]"
            animate={{ 
              scaleX: currentStep === 5 ? [1, 0.7, 1] : [1, 1.2, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
      
      {/* Camino recorrido - aparece mientras el robot se mueve */}
      {playAnimation && currentStep > 0 && (
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Paso 1: Mover derecha */}
          <line 
            x1="8.35" y1="37.5" 
            x2={currentStep >= 1 ? "25" : "8.35"} y2="37.5" 
            stroke="#60a5fa" 
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          
          {/* Paso 2: Mover arriba */}
          {currentStep >= 2 && (
            <line 
              x1="25" y1="37.5" 
              x2="25" y2="12.5" 
              stroke="#60a5fa" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          )}
          
          {/* Paso 3: Mover derecha */}
          {currentStep >= 3 && (
            <line 
              x1="25" y1="12.5" 
              x2="41.7" y2="12.5" 
              stroke="#60a5fa" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          )}
          
          {/* Paso 4: Mover abajo */}
          {currentStep >= 4 && (
            <line 
              x1="41.7" y1="12.5" 
              x2="41.7" y2="62.5" 
              stroke="#60a5fa" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          )}
          
          {/* Paso 5: Mover izquierda (incorrecto) */}
          {currentStep >= 5 && (
            <line 
              x1="41.7" y1="62.5" 
              x2="25" y2="62.5" 
              stroke="#f87171" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}
      
      {/* Indicadores de pasos actuales */}
      {playAnimation && (
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-medium shadow-sm">
            {currentStep === 0 && "Ejecutando código..."}
            {currentStep === 1 && "Paso 1: mover derecha"}
            {currentStep === 2 && "Paso 2: mover arriba"}
            {currentStep === 3 && "Paso 3: mover derecha"}
            {currentStep === 4 && "Paso 4: mover abajo"}
            {currentStep === 5 && "Paso 5: mover izquierda"}
          </div>
        </div>
      )}
      
      {/* Ayuda para interpretar el mapa */}
      {!playAnimation && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs text-gray-600 shadow-sm">
            Ejecuta el código y observa si el robot llega a la estrella
          </div>
        </div>
      )}
      
      {/* Mensaje cuando el robot termina en el lugar incorrecto */}
      {currentStep === 5 && !isAnimating && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs text-gray-600 shadow-sm">
            ¿Llegó el robot a la estrella? Piensa qué parte del código podría estar mal.
          </div>
        </div>
      )}
    </div>
  );
}