'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";

export default function LevelNavigation({ levels, currentLevelId }) {
  const completedMissions = useGameStore(state => state.completedMissions);
  
  // Calcula si un nivel está desbloqueado (completado al menos una misión del nivel anterior)
  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true; // El primer nivel siempre está desbloqueado
    
    // Encuentra el nivel anterior
    const previousLevel = levels.find(level => level.id === levelId - 1);
    if (!previousLevel) return false;
    
    // Verifica si al menos una misión del nivel anterior está completada
    return previousLevel.missions.some(mission => completedMissions.includes(mission.id));
  };
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">Niveles</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {levels.map((level) => {
          const isSelected = level.id === currentLevelId;
          const isUnlocked = isLevelUnlocked(level.id);
          const missionCount = level.missions.length;
          const completedCount = level.missions.filter(mission => 
            completedMissions.includes(mission.id)
          ).length;
          
          return (
            <Link 
              key={level.id}
              href={isUnlocked ? `/juego/nivel/${level.id}` : "#"}
              className={!isUnlocked ? "cursor-not-allowed" : ""}
              onClick={(e) => !isUnlocked && e.preventDefault()}
            >
              <motion.div
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                className={`
                  relative min-w-[120px] rounded-lg p-3 border-2 
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : isUnlocked 
                      ? 'border-gray-200 hover:border-blue-200 bg-white' 
                      : 'border-gray-200 bg-gray-100 opacity-60'
                  }
                `}
              >
                <h3 className="font-medium">
                  {level.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {level.description}
                </p>
                <div className="flex items-center mt-2 justify-between">
                  <span className="text-xs">
                    {completedCount}/{missionCount}
                  </span>
                  {!isUnlocked && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">
                      🔒
                    </span>
                  )}
                  {isUnlocked && completedCount === missionCount && missionCount > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                      ✓
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}