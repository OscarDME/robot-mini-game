'use client';

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function ProgressBar({ value, total, completed, score }) {
  const progressPercentage = (completed / total) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-700">Progreso de misiones</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-yellow-600">
            <motion.span
              key={score}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {score}
            </motion.span> puntos
          </span>
          <span className="text-xs text-gray-500">
            {completed}/{total} completadas
          </span>
        </div>
      </div>
      <Progress
        value={progressPercentage}
        className="h-2"
      />
      {completed === total && completed > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center text-green-600 text-sm font-medium"
        >
          ¡Nivel completado! 🎉
        </motion.div>
      )}
    </div>
  );
}