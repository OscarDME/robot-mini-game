'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Componente para el fondo de código animado
export default function CodeBackground() {
  // Usamos useEffect para prevenir problemas de hidratación
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Elementos de "burbujas de código" para el background
  const codeElements = [
    { id: 1, content: "if (robot.detectarObstaculo()) {", size: "text-sm", color: "text-blue-400/40" },
    { id: 2, content: "for (let i = 0; i < 5; i++) {", size: "text-xs", color: "text-purple-400/40" },
    { id: 3, content: "function moverRobot() {", size: "text-sm", color: "text-green-400/40" },
    { id: 4, content: "while (robot.tieneBateria()) {", size: "text-xs", color: "text-yellow-400/40" },
    { id: 5, content: "if (robot.detectorLuz === true) {", size: "text-sm", color: "text-pink-400/40" },
    { id: 6, content: "robot.avanzar(10);", size: "text-xs", color: "text-blue-300/40" },
    { id: 7, content: "let posicion = robot.obtenerPosicion();", size: "text-sm", color: "text-indigo-400/40" },
    { id: 8, content: "robot.girar(90);", size: "text-xs", color: "text-red-300/40" },
    { id: 9, content: "const objetivo = [5, 10];", size: "text-sm", color: "text-emerald-400/40" },
    { id: 10, content: "return robot.estado;", size: "text-xs", color: "text-amber-400/40" },
    { id: 11, content: "}", size: "text-sm", color: "text-blue-400/40" },
    { id: 12, content: "}", size: "text-xs", color: "text-green-300/40" },
  ];
  
  // Solo renderizar las animaciones en el cliente para evitar errores de hidratación
  if (!isMounted) {
    return <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" />;
  }
  
  // Función para generar posiciones aleatorias pero deterministas usando el índice
  const getRandomPosition = (index) => {
    // Usar valores fijos basados en el índice para evitar cambios entre servidor/cliente
    const positions = [
      { x: 23, y: 50 },
      { x: 45, y: 37 },
      { x: 91, y: 16 },
      { x: 13, y: 54 },
      { x: 35, y: 68 },
      { x: 3, y: 54 },
      { x: 96, y: 41 },
      { x: 56, y: 54 },
      { x: 98, y: 66 },
      { x: 54, y: 43 },
      { x: 5, y: 88 },
      { x: 22, y: 0 },
      { x: 67, y: 25 },
      { x: 78, y: 74 },
      { x: 41, y: 13 },
      { x: 84, y: 33 },
    ];
    
    // Usar posiciones fijas o calcular una basada en el índice si no hay suficientes
    const pos = positions[index % positions.length];
    return pos;
  };
  
  // Posiciones objetivo para las animaciones (también deterministas)
  const getTargetPosition = (index) => {
    // Usar valores fijos pero diferentes para los destinos
    const positions = [
      { x: 76, y: 33 },
      { x: 12, y: 65 },
      { x: 45, y: 89 },
      { x: 92, y: 21 },
      { x: 30, y: 42 },
      { x: 65, y: 78 },
      { x: 18, y: 10 },
      { x: 81, y: 45 },
      { x: 52, y: 91 },
      { x: 38, y: 27 },
      { x: 88, y: 60 },
      { x: 7, y: 80 },
      { x: 60, y: 15 },
      { x: 25, y: 55 },
      { x: 73, y: 38 },
      { x: 48, y: 70 },
    ];
    
    const pos = positions[index % positions.length];
    return pos;
  };
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {codeElements.map((el, index) => {
        const startPos = getRandomPosition(index);
        const endPos = getTargetPosition(index);
        
        return (
          <motion.div
            key={el.id}
            className={`absolute font-mono ${el.size} ${el.color} whitespace-nowrap`}
            initial={{ 
              left: `${startPos.x}%`, 
              top: `${startPos.y}%`,
              opacity: 0 
            }}
            animate={{ 
              left: [`${startPos.x}%`, `${endPos.x}%`],
              top: [`${startPos.y}%`, `${endPos.y}%`],
              opacity: [0, 0.7, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15 + (index % 10),
              delay: index * 0.5,
              ease: "linear" 
            }}
          >
            {el.content}
          </motion.div>
        );
      })}
    </div>
  );
}