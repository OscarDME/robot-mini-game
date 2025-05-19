'use client';

import { useState, useEffect } from 'react';
import Level1Mission1Map from './maps/level1-mission1-map';
import Level1Mission2Map from './maps/level1-mission2-map';
import Level2Mission1Map from './maps/level2-mission1-map';
import Level2Mission2Map from './maps/level2-mission2-map';
import Level3Mission1Map from './maps/level3-mission1-map';

export default function MapVisualization({ mission, level }) {
  const [playAnimation, setPlayAnimation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Reinicia el estado cuando cambia la misión y comienza la animación automáticamente
    setPlayAnimation(false);
    setShowSolution(false);
    setCurrentStep(0);
    
    // Pequeño retardo para comenzar la animación al cargar
    const timer = setTimeout(() => {
      setPlayAnimation(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [mission?.id, level?.id]);

  if (!mission || !level) return null;
  
  // Determinar qué mapa mostrar según el nivel y misión
  const mapKey = `level${level.id}-mission${mission.id}`;
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white border border-gray-200 mb-6 max-w-3xl mx-auto">
      <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Mapa de la misión
        </h3>
      </div>
      
      <div className="p-4">
        {/* Renderizar el mapa correcto según el nivel y misión */}
        {mapKey === 'level1-mission1' && 
          <Level1Mission1Map 
            playAnimation={playAnimation} 
            showSolution={showSolution} 
            setShowSolution={setShowSolution}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        }
        
        {mapKey === 'level1-mission2' && 
          <Level1Mission2Map 
            playAnimation={playAnimation} 
            showSolution={showSolution}
            setShowSolution={setShowSolution}
          />
        }
        
        {mapKey === 'level2-mission1' && 
          <Level2Mission1Map 
            playAnimation={playAnimation}
            showSolution={showSolution}
            setShowSolution={setShowSolution}
          />
        }
        
        {mapKey === 'level2-mission2' && 
          <Level2Mission2Map 
            playAnimation={playAnimation}
            showSolution={showSolution}
            setShowSolution={setShowSolution}
          />
        }
        
        {mapKey === 'level3-mission1' && 
          <Level3Mission1Map 
            playAnimation={playAnimation}
            showSolution={showSolution}
            setShowSolution={setShowSolution}
          />
        }
        
        {/* Mensaje de ayuda si no hay mapa para esta misión */}
        {!['level1-mission1', 'level1-mission2', 'level2-mission1', 'level2-mission2', 'level3-mission1'].includes(mapKey) && (
          <div className="relative w-full h-0 pb-[50%] bg-slate-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-gray-500 text-sm text-center">
                Analiza el código de la misión para encontrar el error. 
                <br className="hidden sm:block" />
                ¡Usa la lógica para resolver el problema!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}