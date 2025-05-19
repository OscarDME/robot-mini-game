import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Creación de la tienda con persistencia
export const useGameStore = create(
  persist(
    (set, get) => ({
      levels: [],
      currentLevelId: 1,
      currentMissionId: 1,
      completedMissions: [],
      score: 0,
      isLoading: true,
      
      // Implementación de acciones
      setLevels: (levels) => set({ levels, isLoading: false }),
      
      setCurrentLevel: (levelId) => {
        set({ currentLevelId: levelId });
        
        // Opcionalmente, seleccionar la primera misión no completada del nivel
        const state = get();
        const level = state.levels.find(l => l.id === levelId);
        if (level && level.missions.length > 0) {
          // Buscar la primera misión no completada de este nivel
          const firstUncompletedMission = level.missions.find(
            m => !state.isMissionCompleted(levelId, m.id)
          );
          
          // Si todas están completadas, establecer la primera misión
          // Si hay alguna no completada, establecer esa
          const missionToSet = firstUncompletedMission || level.missions[0];
          set({ currentMissionId: missionToSet.id });
        }
      },
      
      setCurrentMission: (missionId) => set({ currentMissionId: missionId }),
      
      // Completar una misión y guardarla con el formato correcto
      completeMission: (missionId) => {
        const state = get();
        const levelId = state.currentLevelId;
        const missionKey = `${levelId}-${missionId}`;
        
        // Verificar si ya está completada
        if (state.completedMissions.includes(missionKey)) {
          return;
        }
        
        console.log(`Completando misión: ${missionKey}`);
        
        // Actualizar lista de misiones completadas y puntuación
        set({ 
          completedMissions: [...state.completedMissions, missionKey],
          score: state.score + 10
        });
      },
      
      addScore: (points) => set((state) => ({ score: state.score + points })),
      
      resetGame: () => set({
        currentLevelId: 1,
        currentMissionId: 1,
        completedMissions: [],
        score: 0
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      // Verificar si una misión específica está completada
      isMissionCompleted: (levelId, missionId) => {
        const state = get();
        const missionKey = `${levelId}-${missionId}`;
        return state.completedMissions.includes(missionKey);
      },
      
      // Obtener las misiones completadas para un nivel específico
      getCompletedMissionsForLevel: (levelId) => {
        const state = get();
        const levelPrefix = `${levelId}-`;
        return state.completedMissions.filter(key => 
          typeof key === 'string' && key.startsWith(levelPrefix)
        );
      },
      
      // Verificar si un nivel está completamente terminado
      isLevelCompleted: (levelId) => {
        const state = get();
        const level = state.levels.find(l => l.id === levelId);
        if (!level) return false;
        
        // Obtener todas las misiones completadas de este nivel
        const levelCompletedMissions = state.getCompletedMissionsForLevel(levelId);
        
        // Verificar si todas las misiones del nivel están completadas
        const allCompleted = level.missions.every(mission => {
          const missionKey = `${levelId}-${mission.id}`;
          return levelCompletedMissions.includes(missionKey);
        });
        
        return allCompleted;
      },
      
      // Método para migrar misiones completadas antiguas al nuevo formato
      migrateMissions: () => {
        const state = get();
        const oldCompletedMissions = [...state.completedMissions];
        const newCompletedMissions = [];
        
        // Recorrer todas las misiones completadas
        for (const mission of oldCompletedMissions) {
          // Si ya tiene el formato correcto (levelId-missionId), mantenerlo
          if (typeof mission === 'string' && mission.includes('-')) {
            newCompletedMissions.push(mission);
            continue;
          }
          
          // Si es un número o una cadena sin guión, buscar a qué nivel pertenece
          const missionId = typeof mission === 'number' ? mission : parseInt(mission, 10);
          
          // Buscar la misión en todos los niveles
          let found = false;
          for (const level of state.levels) {
            const mission = level.missions.find(m => m.id === missionId);
            if (mission) {
              newCompletedMissions.push(`${level.id}-${missionId}`);
              found = true;
              break;
            }
          }
          
          // Si no se encontró el nivel, mantener la misión tal cual
          if (!found) {
            console.log(`No se pudo encontrar nivel para la misión ${missionId}`);
            // Intenta asignar la misión al nivel 1 como fallback
            newCompletedMissions.push(`1-${missionId}`);
          }
        }
        
        // Actualizar la lista de misiones completadas
        set({ completedMissions: newCompletedMissions });
        console.log('Migración completada:', newCompletedMissions);
        
        return newCompletedMissions;
      }
    }),
    {
      name: 'codefix-game-storage',
      version: 2, // Incrementar la versión para forzar una migración
    }
  )
);

// Selector para obtener la misión actual
export const getCurrentMission = (state) => {
  const currentLevel = state.levels.find(level => level.id === state.currentLevelId);
  if (!currentLevel) return null;
  
  return currentLevel.missions.find(mission => mission.id === state.currentMissionId);
};

// Selector para obtener todos los niveles
export const getLevels = (state) => state.levels;

// Selector para obtener el progreso total (porcentaje)
export const getTotalProgress = (state) => {
  const totalMissions = state.levels.reduce((total, level) => total + level.missions.length, 0);
  // Contar las misiones completadas por su formato nivel-misión
  const completedCount = state.completedMissions.length;
  return totalMissions > 0 ? (completedCount / totalMissions) * 100 : 0;
};