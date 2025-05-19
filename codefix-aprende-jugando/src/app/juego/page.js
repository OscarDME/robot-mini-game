'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import RobotGuide from '@/components/game/robot-guide';
import { loadMissions } from '@/lib/utils';
import { toast } from 'sonner';
import MigrateGameData from '@/components/game/migrate-game-data';

export default function JuegoPage() {
  const router = useRouter();
  const { 
    levels, 
    setLevels, 
    resetGame, 
    currentLevelId, 
    completedMissions,
    getCompletedMissionsForLevel,
    score,
    isLevelCompleted 
  } = useGameStore();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initGame = async () => {
      if (levels.length === 0) {
        try {
          const data = await loadMissions();
          setLevels(data.levels);
          setIsLoading(false);
        } catch (error) {
          console.error("Error initializing game:", error);
          toast.error("Error al inicializar el juego", {
            description: "No se pudieron cargar los niveles del juego."
          });
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    initGame();
  }, [levels, setLevels]);
  
  const handleStartPlaying = () => {
    router.push(`/juego/nivel/${currentLevelId}`);
  };
  
  // Calcular estadísticas del juego
  const totalMissions = levels.reduce((acc, level) => acc + level.missions.length, 0);
  const totalCompletedMissions = completedMissions.length;
  const progressPercentage = totalMissions > 0 ? Math.round((totalCompletedMissions / totalMissions) * 100) : 0;
  
  const lastPlayedLevelId = levels.length > 0 ? currentLevelId : 1;
  const lastPlayedLevel = levels.find(level => level.id === lastPlayedLevelId);
  
  // Determinar si necesitamos mostrar el componente de migración
  const [needsMigration, setNeedsMigration] = useState(false);
  
  useEffect(() => {
    // Verificar si hay misiones en formato antiguo
    if (completedMissions.length > 0) {
      const hasMissionWithoutLevelPrefix = completedMissions.some(
        missionId => typeof missionId === 'number' || (typeof missionId === 'string' && !missionId.includes('-'))
      );
      setNeedsMigration(hasMissionWithoutLevelPrefix);
    }
  }, [completedMissions]);
  
  if (isLoading) {
    return (
      <div className="container py-8 px-4 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Cargando el juego...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8 px-4 md:px-8">
      {/* Mostrar el componente de migración si es necesario */}
      {needsMigration && <MigrateGameData />}
    
      <div className="mb-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          CodeFix: Aprende Jugando
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ayuda al robot a corregir errores en su código mientras aprendes a programar
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <RobotGuide 
          emotion="happy" 
          message="¡Hola! Soy Bit, tu guía en el mundo de la programación. ¡Necesito tu ayuda para arreglar algunos errores en mi código!" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tu progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="inline-block rounded-full bg-slate-100 p-4 mb-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeDasharray={`${progressPercentage * 2.51} 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{progressPercentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Has completado {totalCompletedMissions} de {totalMissions} misiones
                </div>
                <div className="text-xl font-bold text-yellow-500 mb-2">
                  {score} puntos
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm("¿Estás seguro? Se eliminarán todas tus misiones completadas.")) {
                      resetGame();
                      toast.success("Progreso reiniciado", {
                        description: "Has reiniciado tu progreso en el juego."
                      });
                    }
                  }}
                  className="text-sm"
                >
                  Reiniciar progreso
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {totalCompletedMissions > 0 ? "Continuar aprendiendo" : "Comenzar a aprender"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {totalCompletedMissions > 0 ? (
                  <>
                    <p className="mb-4">
                      Continúa tu camino de aprendizaje. Tu último nivel fue:
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                      <h3 className="font-bold">
                        Nivel {lastPlayedLevelId}: {lastPlayedLevel?.name || "Cargando..."}
                      </h3>
                      <p className="text-sm">{lastPlayedLevel?.description || ""}</p>
                    </div>
                  </>
                ) : (
                  <p className="mb-4">
                    Comienza tu aventura de programación ayudando a Bit a resolver misiones.
                    Empezarás aprendiendo secuencias simples, luego condicionales y bucles.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="lg"
                  onClick={handleStartPlaying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {totalCompletedMissions > 0 ? "Continuar jugando" : "Empezar a jugar"}
                </Button>
                <Link href="/" className="text-center">
                  <Button variant="ghost" className="w-full">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.slice(0, 3).map((level, index) => {
          // Obtener el número de misiones completadas para este nivel
          const levelCompletedMissions = getCompletedMissionsForLevel(level.id);
          const levelCompletedCount = levelCompletedMissions.length;
          const isCompleted = isLevelCompleted(level.id);
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <Card className={isCompleted ? "border-green-300 bg-green-50" : ""}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Nivel {level.id}: {level.name}</span>
                    {isCompleted && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Completado
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{level.description}</p>
                  <div className="text-sm mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span>{levelCompletedCount} de {level.missions.length} completadas</span>
                      <span className="text-xs text-gray-500">
                        {level.missions.length > 0 ? Math.round((levelCompletedCount / level.missions.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${level.missions.length > 0 ? (levelCompletedCount / level.missions.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/juego/nivel/${level.id}`}>
                      <Button 
                        variant={isCompleted ? "outline" : "default"} 
                        className={`w-full ${isCompleted ? "border-green-500 text-green-700" : ""}`}
                      >
                        {isCompleted ? "Repasar nivel" : "Ver nivel"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}