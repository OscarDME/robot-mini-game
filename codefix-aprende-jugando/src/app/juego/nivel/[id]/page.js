'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
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
  const router = useRouter();
  const levelId = parseInt(params.id, 10);
  
  const { 
    levels, 
    setLevels, 
    currentMissionId, 
    setCurrentMission, 
    setCurrentLevel,
    completeMission, 
    isMissionCompleted,
    getCompletedMissionsForLevel,
    isLevelCompleted,
    score
  } = useGameStore();
  
  const [level, setLevel] = useState(null);
  const [currentMission, setCurrentMissionData] = useState(null);
  const [robotMessage, setRobotMessage] = useState("");
  const [robotEmotion, setRobotEmotion] = useState("normal");
  const [showLevelCompletedMessage, setShowLevelCompletedMessage] = useState(false);
  const [nextLevelId, setNextLevelId] = useState(null);

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
            
            // Seleccionar la primera misión no completada o la primera si todas están completas
            selectAppropriateInitialMission(loadedLevel);
            
            // Verificar si todas las misiones del nivel están completadas
            checkLevelCompletion(loadedLevel);
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
          
          // Seleccionar la primera misión no completada o la primera si todas están completas
          selectAppropriateInitialMission(foundLevel);
          
          // Verificar si todas las misiones del nivel están completadas
          checkLevelCompletion(foundLevel);
        }
      }
    };
    
    initLevel();
  }, [levelId, levels, setLevels, setCurrentMission, setCurrentLevel, isMissionCompleted]);

  // Función para seleccionar la misión inicial apropiada
  const selectAppropriateInitialMission = (currentLevel) => {
    if (!currentLevel || !currentLevel.missions.length) return;
    
    // Buscar la primera misión no completada
    const firstUncompletedMission = currentLevel.missions.find(
      mission => !isMissionCompleted(levelId, mission.id)
    );
    
    // Si hay una misión no completada, seleccionarla
    if (firstUncompletedMission) {
      setCurrentMissionData(firstUncompletedMission);
      setCurrentMission(firstUncompletedMission.id);
      setInitialRobotMessage(firstUncompletedMission, false);
    } else {
      // Si todas están completadas, seleccionar la primera
      const firstMission = currentLevel.missions[0];
      setCurrentMissionData(firstMission);
      setCurrentMission(firstMission.id);
      setInitialRobotMessage(firstMission, true);
    }
  };

  // Función para verificar si el nivel está completado
  const checkLevelCompletion = (level) => {
    if (!level) return;
    
    // Usar la función del store para verificar si el nivel está completado
    const completed = isLevelCompleted(levelId);
    
    if (completed) {
      // Buscar el siguiente nivel
      const nextLevel = levels.find(l => l.id === levelId + 1);
      if (nextLevel) {
        setNextLevelId(nextLevel.id);
      }
      setShowLevelCompletedMessage(true);
    } else {
      setShowLevelCompletedMessage(false);
    }
    
    console.log(`Nivel ${levelId} completado: ${completed ? 'Sí' : 'No'}`);
    
    return completed;
  };

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
    if (!isMissionCompleted(levelId, missionId)) {
      // La función completeMission ahora guardará el formato correcto levelId-missionId
      completeMission(missionId);
      setRobotEmotion("happy");
      setRobotMessage(getRandomEncouragement());
      
      // Verificar si con esta misión se completa el nivel
      setTimeout(() => {
        if (level) {
          const levelNowCompleted = checkLevelCompletion(level);
          
          if (levelNowCompleted) {
            // Buscar el siguiente nivel
            const nextLevel = levels.find(l => l.id === levelId + 1);
            if (nextLevel) {
              setNextLevelId(nextLevel.id);
              toast.success('¡Nivel completado!', {
                description: `Has desbloqueado el nivel ${nextLevel.id}: ${nextLevel.name}`,
              });
            }
          }
        }
      }, 100); // Pequeño retardo para asegurar que el estado se ha actualizado
    }
  };

  const handleNextMission = () => {
    if (!level) return;
    
    // Si todas las misiones están completadas y es la última misión, ir al siguiente nivel
    if (isLevelCompleted(levelId) && nextLevelId) {
      console.log(`Navegando al siguiente nivel: ${nextLevelId}`);
      router.push(`/juego/nivel/${nextLevelId}`);
      return;
    }
    
    // Encontrar el índice de la misión actual
    const currentIndex = level.missions.findIndex(m => m.id === currentMission.id);
    
    // Si hay una siguiente misión, cargarla
    if (currentIndex < level.missions.length - 1) {
      const nextMission = level.missions[currentIndex + 1];
      setCurrentMissionData(nextMission);
      setCurrentMission(nextMission.id);
      setInitialRobotMessage(nextMission, isMissionCompleted(levelId, nextMission.id));
    } else {
      // Si es la última misión del nivel y todas están completadas
      if (isLevelCompleted(levelId)) {
        setRobotEmotion("happy");
        setRobotMessage("¡Felicidades! Has completado todas las misiones de este nivel. ¡Eres increíble!");
        
        // Si hay siguiente nivel, navegar hacia él
        if (nextLevelId) {
          console.log(`Navegando al siguiente nivel: ${nextLevelId}`);
          router.push(`/juego/nivel/${nextLevelId}`);
        } else {
          // Si es el último nivel y no hay siguiente, volver a la página principal
          toast.success('¡Juego completado!', {
            description: 'Has completado todos los niveles. ¡Felicidades!',
          });
          router.push('/juego');
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
      setInitialRobotMessage(prevMission, isMissionCompleted(levelId, prevMission.id));
    }
  };

  const goToNextLevel = () => {
    if (nextLevelId) {
      console.log(`Navegando al siguiente nivel: ${nextLevelId}`);
      router.push(`/juego/nivel/${nextLevelId}`);
    } else {
      console.warn("No hay siguiente nivel definido");
      // Si no hay siguiente nivel, volver a la página principal
      router.push('/juego');
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
  const isCurrentMissionCompleted = isMissionCompleted(levelId, currentMission.id);
  
  // Calcular cuántas misiones del nivel actual están completadas
  const levelCompletedMissions = getCompletedMissionsForLevel(levelId);
  const completedInLevel = levelCompletedMissions.length;
  
  // Verificar si todo el nivel está completado
  const levelCompleted = isLevelCompleted(levelId);

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

      {/* Mensaje de nivel completado */}
      {levelCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
        >
          <h3 className="text-lg font-bold text-green-700 mb-2">¡Nivel completado!</h3>
          <p className="text-green-600 mb-3">Has superado todas las misiones de este nivel.</p>
          {nextLevelId ? (
            <Button 
              onClick={goToNextLevel}
              className="bg-green-600 hover:bg-green-700"
            >
              Ir al Nivel {nextLevelId}
            </Button>
          ) : (
            <Button 
              onClick={() => router.push('/juego')}
              className="bg-green-600 hover:bg-green-700"
            >
              Volver al inicio
            </Button>
          )}
        </motion.div>
      )}

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
          variant={isCurrentMissionCompleted || levelCompleted ? "default" : "outline"}
          onClick={handleNextMission}
          className="flex items-center gap-2"
        >
          {isLastMission && levelCompleted
            ? nextLevelId 
              ? "Ir al siguiente nivel" 
              : "Volver al inicio"
            : "Siguiente"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}