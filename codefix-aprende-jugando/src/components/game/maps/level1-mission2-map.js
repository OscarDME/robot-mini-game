'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const positions = {
  start: { x: 30, y: 50 },
  lamp: { x: 65, y: 30 },
  switch: { x: 60, y: 60 }
};

export default function Level1Mission2Map({ playAnimation, showSolution, setShowSolution }) {
  const positions = useMemo(() => ({
    start: { x: 30, y: 50 },
    lamp: { x: 65, y: 30 },
    switch: { x: 60, y: 60 }
  }), []); 
  const [robotPosition, setRobotPosition] = useState({ x: 10, y: 50 });
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    if (playAnimation) {
      // Reiniciar estado
      setRobotPosition(positions.start);
      setStep(0);
      
      // Configurar temporizadores para la animación inicial
      const stepInterval = 1800; // 1.8 segundos por paso
      const cycleDuration = stepInterval * 4; // Duración total de un ciclo
      
      // Paso 1: Intentar presionar interruptor (pero no está ahí)
      const timer1 = setTimeout(() => {
        setStep(1);
      }, stepInterval);
      
      // Paso 2: Ir hacia la luz
      const timer2 = setTimeout(() => {
        setStep(2);
        setRobotPosition(positions.lamp);
      }, stepInterval * 2);
      
      // Paso 3: Buscar interruptor
      const timer3 = setTimeout(() => {
        setStep(3);
        setRobotPosition(positions.switch);
      }, stepInterval * 3);
      
      // Configurar un intervalo para repetir la animación
      const intervalTimer = setInterval(() => {
        // Reiniciar la secuencia
        setRobotPosition(positions.start);
        setStep(0);
        
        // Repetir los pasos
        setTimeout(() => { setStep(1); }, stepInterval);
        setTimeout(() => { 
          setStep(2); 
          setRobotPosition(positions.lamp); 
        }, stepInterval * 2);
        setTimeout(() => { 
          setStep(3); 
          setRobotPosition(positions.switch); 
        }, stepInterval * 3);
      }, cycleDuration);
      
      // Limpiar todos los temporizadores cuando el componente se desmonte
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearInterval(intervalTimer);
      };
    }
  }, [playAnimation]);
  
  // Función para dibujar una línea de puntos entre dos posiciones
  const renderDottedLine = (start, end, color, visible = true) => {
    if (!visible) return null;
    
    // Calcular porcentajes para ubicación en el contenedor
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;
    
    return (
      <svg className="absolute inset-0 w-full h-full z-5 pointer-events-none" style={{ overflow: 'visible' }}>
        <line 
          x1={`${startX}%`} 
          y1={`${startY}%`} 
          x2={`${endX}%`} 
          y2={`${endY}%`} 
          stroke={color}
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>
    );
  };
  
  return (
    <div className="relative w-full h-0 pb-[75%] sm:pb-[60%] bg-slate-50 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
      {/* Habitación */}
      <div className="absolute inset-[5%] border-4 border-gray-300 rounded-lg bg-gray-100 shadow-inner">
        {/* Puerta */}
        <div className="absolute left-0 top-[40%] h-[20%] w-2 bg-yellow-700 rounded-r-sm"></div>
      </div>
      
      {/* Caminos en ejecución - líneas punteadas */}
      {step >= 2 && renderDottedLine(positions.start, positions.lamp, "#60a5fa")}
      {step >= 3 && renderDottedLine(positions.lamp, positions.switch, "#60a5fa")}
      
      {/* Posición inicial - punto destacado */}
      <div className="absolute rounded-full border-2 border-blue-400 flex items-center justify-center"
           style={{ 
             left: `${positions.start.x}%`, 
             top: `${positions.start.y}%`, 
             width: 'min(30px, 8%)', 
             height: 'min(30px, 8%)',
             transform: 'translate(-50%, -50%)'
           }}>
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="absolute text-[10px] sm:text-xs text-blue-500 font-medium whitespace-nowrap -mt-6 sm:-mt-8">Inicio</span>
      </div>
      
      {/* Lámpara con efectos mejorados */}
      <div className="absolute flex flex-col items-center justify-end"
           style={{ 
             left: `${positions.lamp.x}%`, 
             top: `${positions.lamp.y}%`,
             transform: 'translate(-50%, -100%)'
           }}>
        <span className="absolute text-[10px] sm:text-xs text-gray-600 font-medium whitespace-nowrap -mt-6 sm:-mt-8">Lámpara</span>
        <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg shadow-sm">
          <div className="w-8 sm:w-10 h-2 bg-gray-500 -ml-1 absolute bottom-0"></div>
        </div>
        <div className="w-12 sm:w-16 h-5 sm:h-6 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-full shadow-md relative z-10 opacity-30"></div>
      </div>
      
      {/* Interruptor con efectos mejorados */}
      <div className="absolute"
           style={{ 
             left: `${positions.switch.x}%`, 
             top: `${positions.switch.y}%`,
             transform: 'translate(-50%, -50%)'
           }}>
        <span className="absolute text-[10px] sm:text-xs text-gray-600 font-medium whitespace-nowrap -mt-6 sm:-mt-8">Interruptor</span>
        <div className="flex flex-col items-center">
          <div className="w-6 sm:w-8 h-10 sm:h-12 bg-gradient-to-b from-gray-100 to-gray-200 rounded-md shadow-sm border border-gray-300 flex items-center justify-center relative">
            <div className="w-3 sm:w-4 h-5 sm:h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-md absolute" style={{ transform: 'translateY(4px)' }}></div>
          </div>
        </div>
      </div>
      
      {/* Robot con animación mejorada */}
      <motion.div 
        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${robotPosition.x}%`,
          top: `${robotPosition.y}%`,
          width: 'min(50px, 13%)',
          height: 'min(55px, 14%)'
        }}
        initial={false}
        animate={{
          left: `${robotPosition.x}%`,
          top: `${robotPosition.y}%`
        }}
        transition={{ 
          type: "spring", 
          stiffness: 120, 
          damping: 12,
          duration: 1 
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ 
            rotate: [0, step === 1 ? -5 : 0, step === 1 ? 5 : 0, 0],
            y: [0, step === 1 ? -3 : 0, 0]
          }}
          transition={{ 
            duration: step === 1 ? 0.5 : 0.2, 
            repeat: step === 1 ? 2 : 0
          }}
        >
          {/* Cuerpo del robot */}
          <div className="w-full h-[70%] bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-2xl relative shadow-md">
            {/* Ojos */}
            <motion.div 
              className="absolute w-[15%] h-[15%] bg-white rounded-full top-[25%] left-[20%]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            ></motion.div>
            <motion.div 
              className="absolute w-[15%] h-[15%] bg-white rounded-full top-[25%] right-[20%]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
            ></motion.div>
            
            {/* Boca */}
            <motion.div 
              className="absolute w-[30%] h-[7%] bg-white rounded-full bottom-[20%] left-1/2 transform -translate-x-1/2"
              animate={{ 
                scaleX: step === 1 ? [1, 0.6, 1] : [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity 
              }}
            ></motion.div>
            
            {/* Antena */}
            <div className="absolute w-[5%] h-[20%] bg-gray-400 left-1/2 top-0 transform -translate-x-1/2 -translate-y-3/4"></div>
            <div className="absolute w-[10%] h-[10%] bg-red-500 rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-full"></div>
          </div>
          
          {/* Cuerpo inferior / Ruedas */}
          <div className="absolute w-[110%] h-[25%] bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg -bottom-1 -left-[5%] shadow-md"></div>
          
          {/* Ruedas */}
          <div className="absolute w-[15%] h-[15%] bg-gray-700 rounded-full -bottom-2 left-[15%]"></div>
          <div className="absolute w-[15%] h-[15%] bg-gray-700 rounded-full -bottom-2 right-[15%]"></div>
        </motion.div>
      </motion.div>
      
      {/* Panel de instrucciones ejecutadas */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-lg shadow-sm p-2 sm:p-3 text-xs sm:text-sm">
        <h4 className="font-bold text-gray-700 text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Secuencia ejecutada:</h4>
        <div className="space-y-1 sm:space-y-2">
          <div className={`flex items-center ${step >= 1 ? "text-gray-700" : "text-gray-400"}`}>
            <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${step >= 1 ? "bg-gray-100" : "bg-gray-50"} mr-1 sm:mr-2`}>1</div>
            <span className={step >= 1 ? "font-medium" : ""}>Presionar interruptor</span>
            {step >= 1 && <span className="ml-1 sm:ml-2 text-red-500">❌</span>}
          </div>
          <div className={`flex items-center ${step >= 2 ? "text-gray-700" : "text-gray-400"}`}>
            <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${step >= 2 ? "bg-gray-100" : "bg-gray-50"} mr-1 sm:mr-2`}>2</div>
            <span className={step >= 2 ? "font-medium" : ""}>Ir hacia la luz</span>
          </div>
          <div className={`flex items-center ${step >= 3 ? "text-gray-700" : "text-gray-400"}`}>
            <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${step >= 3 ? "bg-gray-100" : "bg-gray-50"} mr-1 sm:mr-2`}>3</div>
            <span className={step >= 3 ? "font-medium" : ""}>Buscar interruptor</span>
          </div>
        </div>
      </div>
      
      {/* Ayuda para interpretar el mapa - estilo mejorado */}
      {!playAnimation && (
        <div className="absolute top-2 sm:top-4 left-0 right-0 flex justify-center">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 rounded-lg text-xs sm:text-sm text-blue-800 shadow-sm border border-blue-200 max-w-xs text-center">
            <p className="font-medium">Misión: Encender la luz</p>
            <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Ejecuta el código para ver la secuencia de instrucciones</p>
          </div>
        </div>
      )}
      
      {/* Indicador de estado actual - más visible */}
      {playAnimation && (
        <div className="absolute top-2 sm:top-4 left-0 right-0 flex justify-center">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-lg text-xs sm:text-sm font-medium shadow-sm border border-gray-200">
            {step === 0 && "Ejecutando código..."}
            {step === 1 && (
              <div className="flex items-center">
                <span>Paso 1: Presionar interruptor</span>
                <span className="ml-1 sm:ml-2 text-[9px] sm:text-xs text-gray-500">(¡No está cerca!)</span>
              </div>
            )}
            {step === 2 && <span>Paso 2: Ir hacia la luz</span>}
            {step === 3 && <span>Paso 3: Buscar interruptor</span>}
          </div>
        </div>
      )}
    </div>
  );
}