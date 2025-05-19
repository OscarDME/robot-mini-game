'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCode, calculateDifficulty } from '@/lib/utils';
import { toast } from 'sonner';

export default function MissionCard({ mission, onComplete, isCompleted }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

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

  const difficulty = calculateDifficulty(mission.code.length, mission.options.length);

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
          <div className="bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-sm whitespace-pre">
            {formatCode(mission.code)}
          </div>
        </div>

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