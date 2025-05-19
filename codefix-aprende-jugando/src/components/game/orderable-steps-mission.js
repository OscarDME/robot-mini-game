'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function OrderableStepsMission({ mission, onComplete, isCompleted }) {
  // Estado para los pasos desordenados que el usuario puede reordenar
  const [steps, setSteps] = useState([]);
  
  // Estado para controlar si la respuesta ha sido verificada
  const [isVerified, setIsVerified] = useState(false);
  
  // Estado para saber si la respuesta es correcta
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Estado para mostrar la explicación
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Estado para controlar si se muestra la pista
  const [showHint, setShowHint] = useState(false);
  
  // Estado para animar el código
  const [playAnimation, setPlayAnimation] = useState(false);
  
  // Función para comparar arrays (solución del usuario vs solución correcta)
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  
  // Convertir el código en un array de pasos cuando el componente se monta
  useEffect(() => {
    if (mission && mission.code) {
      // Convertir el código en un array de pasos
      const codeSteps = mission.code.split('\n').filter(step => step.trim());
      
      // Para la misión 2 del nivel 1, usamos estos pasos pero los aleatorizamos
      if (mission.id === 2 && mission.title === "Encendiendo la luz") {
        // Desordena los pasos
        const shuffledSteps = [...codeSteps].sort(() => Math.random() - 0.5);
        setSteps(shuffledSteps);
      } else {
        setSteps(codeSteps);
      }
    }
  }, [mission]);
  
  // Verificar si la respuesta es correcta
  const checkAnswer = () => {
    // Para la misión 2 del nivel 1, el orden correcto está en la explicación
    const correctOrderText = mission.explanation.split("La secuencia correcta es:\n\n")[1]?.trim();
    
    if (correctOrderText) {
      const correctSteps = correctOrderText.split('\n').filter(step => step.trim());
      const isAnswerCorrect = arraysEqual(steps, correctSteps);
      
      setIsCorrect(isAnswerCorrect);
      setIsVerified(true);
      
      if (isAnswerCorrect) {
        // Si la respuesta es correcta, notificar al componente padre
        onComplete(mission.id);
        setShowExplanation(true);
      }
    }
  };
  
  // Función para ejecutar la animación del código
  const executeCode = () => {
    setPlayAnimation(true);
    
    // Reiniciamos la animación después de un tiempo
    setTimeout(() => {
      setPlayAnimation(false);
    }, 10000); // 10 segundos - ajustar según la duración de la animación
  };
  
  // Reiniciar el estado
  const resetState = () => {
    setIsVerified(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };
  
  // Obtener la explicación correcta
  const getExplanation = () => {
    if (mission.explanation) {
      return mission.explanation.replace(/^\¡Correcto\!\s+/, '');
    }
    return '';
  };
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="mb-5">
        <h2 className="text-xl font-bold mb-2">{mission.title}</h2>
        <p className="text-gray-700 mb-4">{mission.description}</p>
        
        {/* Botón para ejecutar el código y ver la animación */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={executeCode} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            disabled={playAnimation}
          >
            <span>Ejecutar código</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Área de código con pasos ordenables */}
        <div className="bg-gray-50 p-4 rounded-md mb-4 font-mono text-sm">
          <p className="text-gray-500 mb-2 text-xs">Ordena los pasos arrastrándolos a la posición correcta:</p>
          
          <Reorder.Group 
            values={steps} 
            onReorder={setSteps} 
            className="space-y-2"
            axis="y"
          >
            {steps.map((step, index) => (
              <Reorder.Item 
                key={step} 
                value={step}
                className={`p-2 rounded-md border ${
                  isVerified 
                    ? isCorrect 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200" 
                    : "bg-white border-gray-200 cursor-move hover:bg-blue-50 hover:border-blue-200"
                } flex items-center`}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-2 text-gray-400">
                  {index + 1}.
                </div>
                <div className="flex-grow">
                  {step}
                </div>
                {isVerified && (
                  <div className="ml-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        
        {/* Pista */}
        {!isVerified && (
          <div className="mb-4">
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-500 p-0"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Ocultar pista" : "Ver pista"}
            </Button>
            
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-3 rounded-md">
                    {mission.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Mensaje de verificación */}
        <AnimatePresence>
          {isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-3 rounded-md mb-4 ${
                isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {isCorrect ? (
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">¡Correcto!</p>
                    {showExplanation && (
                      <p className="text-sm mt-1">{getExplanation()}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Revisa el orden de los pasos.</p>
                    <p className="text-sm mt-1">
                      Piensa en el orden lógico en que debería ejecutarse cada acción.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Botones de acción */}
        <div className="flex justify-between mt-6">
          {isVerified ? (
            <Button 
              variant="outline" 
              onClick={resetState}
              disabled={isCompleted}
            >
              Intentar de nuevo
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Ocultar pista" : "Ver pista"}
            </Button>
          )}
          
          {!isVerified && (
            <Button onClick={checkAnswer}>
              Verificar
            </Button>
          )}
          
          {isVerified && !isCorrect && (
            <Button onClick={checkAnswer}>
              Verificar de nuevo
            </Button>
          )}
          
          {isVerified && isCorrect && (
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? "Ocultar explicación" : "Ver explicación"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}