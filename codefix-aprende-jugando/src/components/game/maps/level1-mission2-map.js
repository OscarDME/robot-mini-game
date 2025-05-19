'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Level1Mission2Map({ playAnimation, showSolution, setShowSolution }) {
  const [robotPosition, setRobotPosition] = useState({ x: 10, y: 50 });
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    if (playAnimation) {
      // Reiniciar estado
      setRobotPosition({ x: 10, y: 50 });
      setStep(0);
      
      // Simular la animación paso a paso
      const stepInterval = 1500; // 1.5 segundos por paso
      
      // Secuencia incorrecta:
      // 1. Presionar interruptor -> permanece en posición inicial (no puede hacerlo)
      // 2. Ir hacia la luz -> se mueve hacia la lámpara
      // 3. Buscar interruptor -> se mueve hacia el interruptor
      
      setTimeout(() => {
        setStep(1); // Intenta presionar interruptor (pero no está ahí)
      }, stepInterval);
      
      setTimeout(() => {
        setStep(2); // Va hacia la luz
        setRobotPosition({ x: 200, y: -100 });
      }, stepInterval * 2);
      
      setTimeout(() => {
        setStep(3); // Busca el interruptor
        setRobotPosition({ x: 170, y: 40 });
      }, stepInterval * 3);
      
      // Mostrar la solución después de todos los pasos
      setTimeout(() => {
        setShowSolution(true);
      }, stepInterval * 4);
    }
  }, [playAnimation, setShowSolution]);
  
  return (
    <div className="relative w-full h-0 pb-[75%] sm:pb-[60%] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Habitación */}
      <div className="absolute inset-0 bg-gray-100">
        {/* Paredes */}
        <div className="absolute inset-0 border-4 border-gray-300 rounded-lg"></div>
        {/* Puerta */}
        <div className="absolute left-0 top-[40%] h-[20%] w-2 bg-yellow-700"></div>
      </div>
      
      {/* Lámpara */}
      <div className="absolute right-[20%] top-[20%]">
        <div className="w-8 h-12 bg-gray-400 rounded-t-lg"></div>
        <div className="w-10 h-2 bg-gray-600 mx-auto -mt-1"></div>
        <motion.div 
          className="w-16 h-6 bg-yellow-100 mx-auto rounded-full -mt-1 shadow-md"
          animate={{ opacity: step === 3 && showSolution ? [0.2, 1] : 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
        ></motion.div>
      </div>
      
      {/* Interruptor */}
      <div className="absolute right-[30%] top-[60%]">
        <div className="w-6 h-8 bg-gray-200 rounded"></div>
        <motion.div 
          className="w-2 h-3 bg-gray-500 mx-auto rounded-b-full"
          animate={step === 3 && showSolution ? { y: -3 } : {}}
          transition={{ duration: 0.3, delay: 0.5 }}
        ></motion.div>
      </div>
      
      {/* Robot */}
      <motion.div 
        className="absolute z-10"
        style={{
          left: `${robotPosition.x}px`,
          top: `${robotPosition.y}px`,
          width: '40px',
          height: '48px'
        }}
        initial={false}
        animate={{
          left: `${robotPosition.x}px`,
          top: `${robotPosition.y}px`
        }}
        transition={{ duration: 1 }}
      >
        <div className="w-full h-full bg-blue-500 rounded-t-lg relative">
          {/* Ojos */}
          <div className="absolute w-2 h-2 bg-white rounded-full top-3 left-2"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full top-3 right-2"></div>
          {/* Boca */}
          <motion.div 
            className="absolute w-4 h-1 bg-white rounded-full bottom-2 left-3"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          {/* Cuerpo */}
          <div className="absolute w-12 h-5 bg-blue-600 rounded-lg -bottom-3 -left-1"></div>
        </div>
      </motion.div>
      
      {/* Pasos correctos */}
      <div className="absolute bottom-3 left-3 text-sm font-medium">
        <div className={`flex items-center mb-1 ${step >= 2 && showSolution ? "text-green-600" : "text-gray-500"}`}>
          <span className="inline-block w-5 h-5 bg-green-100 rounded-full text-center mr-2">1</span>
          Ir hacia la luz
        </div>
        <div className={`flex items-center mb-1 ${step >= 3 && showSolution ? "text-green-600" : "text-gray-500"}`}>
          <span className="inline-block w-5 h-5 bg-green-100 rounded-full text-center mr-2">2</span>
          Buscar interruptor
        </div>
        <div className={`flex items-center ${showSolution ? "text-green-600" : "text-gray-500"}`}>
          <span className="inline-block w-5 h-5 bg-green-100 rounded-full text-center mr-2">3</span>
          Presionar interruptor
        </div>
      </div>
      
      {/* Pasos incorrectos */}
      <div className="absolute bottom-3 right-3 text-sm font-medium">
        <div className={`flex items-center mb-1 ${step >= 1 ? "text-red-500" : "text-gray-400"} ${step >= 1 ? "line-through" : ""} opacity-70`}>
          <span className="inline-block w-5 h-5 bg-red-100 rounded-full text-center mr-2">1</span>
          Presionar interruptor
        </div>
        <div className={`flex items-center mb-1 ${step >= 2 ? "text-red-500" : "text-gray-400"} ${step >= 2 ? "line-through" : ""} opacity-70`}>
          <span className="inline-block w-5 h-5 bg-red-100 rounded-full text-center mr-2">2</span>
          Ir hacia la luz
        </div>
        <div className={`flex items-center ${step >= 3 ? "text-red-500" : "text-gray-400"} ${step >= 3 ? "line-through" : ""} opacity-70`}>
          <span className="inline-block w-5 h-5 bg-red-100 rounded-full text-center mr-2">3</span>
          Buscar interruptor
        </div>
      </div>
      
      {/* Ayuda para interpretar el mapa */}
      {!playAnimation && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/80 rounded-full text-xs text-gray-500 shadow-sm">
            ¡Ejecuta el código para ver qué sucede!
          </div>
        </div>
      )}
      
      {/* Indicadores de pasos actuales */}
      {playAnimation && !showSolution && (
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium shadow-sm">
            {step === 0 && "Ejecutando código..."}
            {step === 1 && "Paso 1: presionar interruptor ❌ (¡No está cerca!)"}
            {step === 2 && "Paso 2: ir hacia la luz ✓"}
            {step === 3 && "Paso 3: buscar interruptor ✓"}
          </div>
        </div>
      )}
    </div>
  );
}