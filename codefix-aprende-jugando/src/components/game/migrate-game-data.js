'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useGameStore } from '@/lib/store';

// Componente para migrar los datos del estado anterior al nuevo formato
export default function MigrateGameData() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const { levels, completedMissions, setLevels, migrateMissions } = useGameStore();

  useEffect(() => {
    // Comprobar si se necesita migración
    // Si hay misiones completadas en el formato antiguo (sin el prefijo nivel-misión)
    if (completedMissions.length > 0) {
      const needsMigration = completedMissions.some(mission => 
        typeof mission === 'number' || (typeof mission === 'string' && !mission.includes('-'))
      );
      setMigrationNeeded(needsMigration);
      console.log("¿Necesita migración?", needsMigration, completedMissions);
    }
  }, [completedMissions]);

  const handleMigrateData = async () => {
    setIsMigrating(true);
    
    try {
      // 1. Cargar niveles si no están ya cargados
      let currentLevels = levels;
      if (currentLevels.length === 0) {
        // Aquí deberías cargar los niveles desde alguna fuente de datos
        try {
          const response = await fetch('/api/missions');
          const data = await response.json();
          currentLevels = data.levels;
          setLevels(currentLevels);
        } catch (error) {
          console.error('Error al cargar niveles:', error);
          // Usar datos de respaldo
          currentLevels = [
            {
              id: 1,
              name: "Secuencia",
              missions: [{ id: 1 }, { id: 2 }]
            },
            {
              id: 2,
              name: "Condicionales",
              missions: [{ id: 1 }, { id: 2 }]
            },
            {
              id: 3,
              name: "Bucles",
              missions: [{ id: 1 }]
            }
          ];
          setLevels(currentLevels);
        }
      }
      
      // 2. Migrar las misiones al nuevo formato
      const newCompletedMissions = migrateMissions();
      
      setMigrationComplete(true);
      toast.success('Migración completada', {
        description: 'Tu progreso ha sido actualizado al nuevo formato.'
      });
      
      console.log('Misiones migradas:', newCompletedMissions);
    } catch (error) {
      console.error('Error durante la migración:', error);
      toast.error('Error en la migración', {
        description: 'No se pudo completar la migración. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Si no se necesita migración o ya está completada, no mostrar nada
  if (!migrationNeeded || migrationComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Actualización necesaria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Hemos mejorado CodeFix y necesitamos actualizar tu información de progreso.
            Esto solo tomará un momento y no afectará tus niveles completados.
          </p>
          <div className="flex justify-end">
            <Button 
              onClick={handleMigrateData} 
              disabled={isMigrating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isMigrating ? (
                <>
                  <span className="mr-2 animate-spin">⟳</span>
                  Actualizando...
                </>
              ) : (
                'Actualizar ahora'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}