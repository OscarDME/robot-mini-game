//juego/nivel/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import MissionCard from '@/components/game/mission-card';
import RobotGuide from '@/components/game/robot-guide';
import ProgressBar from '@/components/game/progress-bar';
import LevelNavigation from '@/components/game/level-navigation';
import { useGameStore } from '@/lib/store';
import { loadMissions, getRandomEncouragement } from '@/lib/utils';
import { toast } from 'sonner';
import MapVisualization from '@/components/game/map-visualization';

export default function LevelPage() {
  // Usar useParams en lugar de recibir params como prop
  const params = useParams();
  const levelId = parseInt(params.id, 10);
  
  const { 
    levels, 
    setLevels, 
    currentMissionId, 
    setCurrentMission, 
    setCurrentLevel,
    completeMission, 
    completedMissions,
    score
  } = useGameStore();
  
  const [level, setLevel] = useState(null);
  const [currentMission, setCurrentMissionData] = useState(null);
  const [robotMessage, setRobotMessage] = useState("");
  const [robotEmotion, setRobotEmotion] = useState("normal");

  useEffect(() => {
    // Si aún no se han cargado los niveles, cargarlos
    const initLevel = async () => {
      if (levels.length === 0) {
        try {
          const data = await loadMissions();
          console.log("Niveles cargados:", data.levels);
          setLevels(data.levels);
          
          const loadedLevel = data.levels.find(l => l.id === levelId);
          if (loadedLevel) {
            setLevel(loadedLevel);
            setCurrentLevel(levelId);
            
            // Si hay una misión actual, cargarla
            const mission = loadedLevel.missions.find(m => m.id === currentMissionId) || loadedLevel.missions[0];
            if (mission) {
              setCurrentMissionData(mission);
              setCurrentMission(mission.id);
              setInitialRobotMessage(mission, completedMissions.includes(mission.id));
            }
          }
        } catch (error) {
          console.error("Error loading level:", error);
          toast.error('Error al cargar el nivel', {
            description: 'No se pudo cargar el contenido del nivel.',
          });
        }
      } else {
        // Si ya están cargados los niveles, solo actualizamos el nivel actual
        const foundLevel = levels.find(l => l.id === levelId);
        if (foundLevel) {
          setLevel(foundLevel);
          setCurrentLevel(levelId);
          
          // Si hay una misión actual, cargarla
          const mission = foundLevel.missions.find(m => m.id === currentMissionId) || foundLevel.missions[0];
          if (mission) {
            setCurrentMissionData(mission);
            setCurrentMission(mission.id);
            setInitialRobotMessage(mission, completedMissions.includes(mission.id));
          }
        }
      }
    };
    
    initLevel();
  }, [levelId, levels, setLevels, currentMissionId, setCurrentMission, setCurrentLevel, completedMissions]);

  const setInitialRobotMessage = (mission, isCompleted) => {
    if (isCompleted) {
      setRobotMessage("¡Ya has completado esta misión! ¿Quieres revisar otra?");
      setRobotEmotion("happy");
    } else {
      setRobotMessage(`¡Ayúdame con esta misión! ${mission.description}`);
      setRobotEmotion("thinking");
    }
  };

  const handleCompleteMission = (missionId) => {
    // Verificar si la misión ya está completada
    if (!completedMissions.includes(missionId)) {
      completeMission(missionId);
      setRobotEmotion("happy");
      setRobotMessage(getRandomEncouragement());
    }
  };

  const handleNextMission = () => {
    if (!level) return;
    
    // Encontrar el índice de la misión actual
    const currentIndex = level.missions.findIndex(m => m.id === currentMission.id);
    
    // Si hay una siguiente misión, cargarla
    if (currentIndex < level.missions.length - 1) {
      const nextMission = level.missions[currentIndex + 1];
      setCurrentMissionData(nextMission);
      setCurrentMission(nextMission.id);
      setInitialRobotMessage(nextMission, completedMissions.includes(nextMission.id));
    } else {
      // Si es la última misión del nivel, mostrar mensaje de nivel completado
      const allCompleted = level.missions.every(m => completedMissions.includes(m.id));
      if (allCompleted) {
        setRobotEmotion("happy");
        setRobotMessage("¡Felicidades! Has completado todas las misiones de este nivel. ¡Eres increíble!");
        
        // Ir al siguiente nivel si existe
        const nextLevelId = levelId + 1;
        const nextLevel = levels.find(l => l.id === nextLevelId);
        if (nextLevel) {
          toast.success('¡Nivel completado!', {
            description: `Has desbloqueado el nivel ${nextLevelId}: ${nextLevel.name}`,
          });
        }
      }
    }
  };

  const handlePrevMission = () => {
    if (!level) return;
    
    // Encontrar el índice de la misión actual
    const currentIndex = level.missions.findIndex(m => m.id === currentMission.id);
    
    // Si hay una misión anterior, cargarla
    if (currentIndex > 0) {
      const prevMission = level.missions[currentIndex - 1];
      setCurrentMissionData(prevMission);
      setCurrentMission(prevMission.id);
      setInitialRobotMessage(prevMission, completedMissions.includes(prevMission.id));
    }
  };

  if (!level || !currentMission) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Cargando el nivel...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Encontrar el índice de la misión actual
  const currentIndex = level.missions.findIndex(m => m.id === currentMission.id);
  const isFirstMission = currentIndex === 0;
  const isLastMission = currentIndex === level.missions.length - 1;
  
  // Determinar si la misión actual ya está completada
  const isCurrentMissionCompleted = completedMissions.includes(currentMission.id);
  
  // Calcular cuántas misiones del nivel actual están completadas
  const completedInLevel = level.missions.filter(m => completedMissions.includes(m.id)).length;

  return (
    <div className="container py-8 px-4 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/juego">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Volver al inicio">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">
            Nivel {level.id}: {level.name}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          Misión {currentIndex + 1} de {level.missions.length}
        </div>
      </div>
      
      <LevelNavigation levels={levels} currentLevelId={levelId} />
      
      <ProgressBar 
        value={currentIndex + 1} 
        total={level.missions.length} 
        completed={completedInLevel}
        score={score}
      />
      
      <div className="flex justify-center">
        <RobotGuide 
          emotion={robotEmotion} 
          message={robotMessage} 
        />
      </div>

      <div className="mb-6">
        <MapVisualization mission={currentMission} level={level} />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMission.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <MissionCard 
            mission={currentMission} 
            onComplete={handleCompleteMission}
            isCompleted={isCurrentMissionCompleted}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between mt-6 max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={handlePrevMission}
          disabled={isFirstMission}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <Button
          variant={isCurrentMissionCompleted ? "default" : "outline"}
          onClick={handleNextMission}
          className="flex items-center gap-2"
        >
          {isLastMission && completedInLevel === level.missions.length 
            ? "Finalizar nivel" 
            : "Siguiente"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}