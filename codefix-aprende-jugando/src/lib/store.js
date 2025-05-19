import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Creación de la tienda con persistencia
export const useGameStore = create(
  persist(
    (set) => ({
      levels: [],
      currentLevelId: 1,
      currentMissionId: 1,
      completedMissions: [],
      score: 0,
      isLoading: true,
      
      // Implementación de acciones
      setLevels: (levels) => set({ levels, isLoading: false }),
      setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),
      setCurrentMission: (missionId) => set({ currentMissionId: missionId }),
      completeMission: (missionId) => set((state) => ({
        completedMissions: [...state.completedMissions, missionId],
        score: state.score + 10
      })),
      addScore: (points) => set((state) => ({ score: state.score + points })),
      resetGame: () => set({ 
        currentLevelId: 1, 
        currentMissionId: 1, 
        completedMissions: [], 
        score: 0 
      }),
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'codefix-game-storage',
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

// Selector para verificar si una misión está completada
export const isMissionCompleted = (state, missionId) => {
  return state.completedMissions.includes(missionId);
};

// Selector para obtener el progreso total (porcentaje)
export const getTotalProgress = (state) => {
  const totalMissions = state.levels.reduce((total, level) => total + level.missions.length, 0);
  return totalMissions > 0 ? (state.completedMissions.length / totalMissions) * 100 : 0;
};