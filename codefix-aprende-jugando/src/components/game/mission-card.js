'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCode, calculateDifficulty } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export default function MissionCard({ mission, onComplete, isCompleted }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  
  // Estados para la misión de ordenamiento
  const [steps, setSteps] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Determinar si es la misión de ordenar pasos (Nivel 1, Misión 2)
  const isOrderableStepsMission = 
    mission.id === 2 && 
    mission.title === "Encendiendo la luz";
  
  // Convertir el código en un array de pasos cuando el componente se monta (para misión 2)
  useEffect(() => {
    if (isOrderableStepsMission && mission && mission.code) {
      // Convertir el código en un array de pasos
      const codeSteps = mission.code.split('\n').filter(step => step.trim());
      
      // Desordena los pasos si aún no se ha completado la misión
      if (!isCompleted) {
        const shuffledSteps = [...codeSteps].sort(() => Math.random() - 0.5);
        setSteps(shuffledSteps);
      } else {
        // Si ya está completada, mostrar los pasos en el orden correcto
        const correctOrderText = mission.explanation.split("La secuencia correcta es:\n\n")[1]?.trim();
        if (correctOrderText) {
          const correctSteps = correctOrderText.split('\n').filter(step => step.trim());
          setSteps(correctSteps);
        } else {
          setSteps(codeSteps);
        }
      }
    }
  }, [mission, isOrderableStepsMission, isCompleted]);
  
  // Función para verificar si los pasos están en el orden correcto
  const verifyOrderableSteps = () => {
    // Para la misión 2 del nivel 1, el orden correcto está en la explicación
    const correctOrderText = mission.explanation.split("La secuencia correcta es:\n\n")[1]?.trim();
    
    if (correctOrderText) {
      const correctSteps = correctOrderText.split('\n').filter(step => step.trim());
      
      // Comparar arrays (solución del usuario vs solución correcta)
      const isAnswerCorrect = arraysEqual(steps, correctSteps);
      
      setIsCorrect(isAnswerCorrect);
      setIsVerified(true);
      
      if (isAnswerCorrect) {
        toast.success('¡Respuesta correcta!', {
          description: 'Has ordenado correctamente los pasos.',
        });
        setShowExplanation(true);
        onComplete && onComplete(mission.id);
      } else {
        toast.error('El orden no es correcto', {
          description: 'Revisa la secuencia lógica de los pasos.',
        });
      }
    }
  };
  
  // Función para comparar arrays (solución del usuario vs solución correcta)
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  
  // Función para ejecutar el código y mostrar la animación
  const executeCode = () => {
    setPlayAnimation(true);
    
    // Reiniciamos la animación después de un tiempo
    setTimeout(() => {
      setPlayAnimation(false);
    }, 8000); // 8 segundos o el tiempo que dure la animación completa
  };
  
  // Calcular la dificultad de la misión
  const difficulty = calculateDifficulty(mission.code.length, mission.options.length);
  
  // Manejar la selección de opción para misiones normales
  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    
    if (optionIndex === mission.correctAnswer) {
      toast.success('¡Respuesta correcta!', {
        description: 'Has ayudado al robot a corregir el código.',
      });
      setShowExplanation(true);
      onComplete && onComplete(mission.id);
    } else {
      toast.error('Mmm, no es correcto', {
        description: 'Intenta de nuevo o pide una pista.',
      });
    }
  };
  
  return (
    <Card className="w-full shadow-lg border-2 relative overflow-hidden">
      {isCompleted && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 transform rotate-0 translate-x-2 -translate-y-0 z-10">
          Completado
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{mission.title}</CardTitle>
            <CardDescription>{mission.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
              ${difficulty === 'Fácil' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                difficulty === 'Medio' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : 
                'bg-red-50 text-red-700 ring-red-600/20'}`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">{mission.question}</h3>
          
          {isOrderableStepsMission ? (
            /* Interfaz de ordenamiento para la misión especial */
            <div className="bg-slate-50 p-4 rounded-md font-mono text-sm">
              <p className="text-gray-500 mb-3 text-xs">Ordena los pasos arrastrándolos a la posición correcta:</p>
              
              <Reorder.Group 
                values={steps} 
                onReorder={setSteps} 
                className="space-y-2"
                axis="y"
                disabled={isCompleted || isVerified && isCorrect}
              >
                {steps.map((step, index) => (
                  <Reorder.Item 
                    key={step} 
                    value={step}
                    className={`p-3 rounded-md border select-none ${
                      isVerified 
                        ? isCorrect 
                          ? "bg-green-50 border-green-200" 
                          : "bg-red-50 border-red-200" 
                        : "bg-white border-gray-200 cursor-move hover:bg-blue-50 hover:border-blue-200"
                    } flex items-center`}
                    disabled={isCompleted || isVerified && isCorrect}
                  >
                    <div className="w-7 h-7 flex items-center justify-center mr-3 text-gray-400 bg-gray-100 rounded-full">
                      {index + 1}
                    </div>
                    <div className="flex-grow font-medium">
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
              
              {!isCompleted && !isVerified && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={verifyOrderableSteps}>
                    Verificar orden
                  </Button>
                </div>
              )}
              
              {isVerified && !isCorrect && !isCompleted && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsVerified(false)}
                  >
                    Intentar de nuevo
                  </Button>
                  <Button onClick={verifyOrderableSteps}>
                    Verificar orden
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Visualización normal del código para otras misiones */
            <div className="bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-sm whitespace-pre">
              {formatCode(mission.code)}
            </div>
          )}
        </div>

        {/* Opciones de respuesta para misiones normales */}
        {!isOrderableStepsMission && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selecciona la respuesta correcta:</h3>
            {mission.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOption === index 
                  ? index === mission.correctAnswer ? "success" : "destructive" 
                  : "outline"}
                className={`w-full justify-start text-left h-auto py-3 ${
                  isCompleted && index === mission.correctAnswer 
                    ? "border-green-500 bg-green-50" 
                    : ""
                }`}
                onClick={() => !isCompleted && handleOptionSelect(index)}
                disabled={isCompleted}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
              </Button>
            ))}
          </div>
        )}

        {showHint && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-blue-50 border border-blue-200 p-3 rounded-md"
          >
            <p className="text-sm text-blue-800">
              <span className="font-bold">Pista:</span> {mission.hint}
            </p>
          </motion.div>
        )}

        {(showExplanation || isCompleted) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-green-50 border border-green-200 p-3 rounded-md"
          >
            <p className="text-sm text-green-800 font-medium mb-2">Explicación:</p>
            <p className="text-sm text-green-800 whitespace-pre-line">{mission.explanation}</p>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isCompleted && !showExplanation && (
          <Button 
            variant="ghost" 
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "Ocultar pista" : "Necesito una pista"}
          </Button>
        )}
        {isCompleted && (
          <Button variant="ghost" className="text-green-600">
            ¡Misión completada!
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}