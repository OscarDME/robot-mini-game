import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función para combinar clases de Tailwind de manera eficiente
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Función para cargar las misiones desde el archivo JSON
// Reemplaza la función loadMissions en utils.js
export async function loadMissions() {
  try {
    console.log("Intentando cargar misiones desde la API...");
    const response = await fetch('/api/missions');
    if (!response.ok) {
      throw new Error(`Error al cargar misiones: ${response.status}`);
    }
    const data = await response.json();
    console.log("Misiones cargadas correctamente:", data);
    return data;
  } catch (error) {
    console.error('Error loading missions:', error);
    
    // Datos de respaldo en caso de error
    console.log("Usando datos de respaldo predefinidos");
    return {
      levels: [
        {
          id: 1,
          name: "Secuencia",
          description: "Aprende a ordenar instrucciones en secuencia",
          missions: [
            {
              id: 1,
              title: "¡El robot necesita moverse!",
              description: "Ayuda al robot a llegar a la meta.",
              code: "mover adelante\nmover izquierda\nmover adelante",
              question: "¿Qué está mal en esta secuencia?",
              options: ["El robot debe moverse a la derecha, no a la izquierda", "Opción 2", "Opción 3"],
              correctAnswer: 0,
              explanation: "Explicación de la respuesta",
              hint: "Una pista útil"
            }
          ]
        }
      ]
    };
  }
}

// Función para generar un color aleatorio para el personaje robot
export function getRandomRobotColor() {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Función para formatear código con espacios adecuados
export function formatCode(code) {
  return code.split('\n').map(line => {
    // Contar espacios iniciales para la indentación
    const indentCount = line.search(/\S|$/);
    const indent = '  '.repeat(indentCount / 2);
    return indent + line.trim();
  }).join('\n');
}

// Calcular nivel de dificultad basado en longitud del código y opciones
export function calculateDifficulty(codeLength, optionsCount) {
  if (codeLength < 30 && optionsCount <= 2) return 'Fácil';
  if (codeLength < 60 && optionsCount <= 3) return 'Medio';
  return 'Desafiante';
}

// Generar mensajes de ánimo aleatorios
export function getRandomEncouragement() {
  const messages = [
    '¡Muy bien! Sigues aprendiendo.',
    '¡Excelente trabajo! Eres un gran programador.',
    '¡Increíble! Estás dominando la lógica de programación.',
    '¡Genial! El robot está muy contento con tu ayuda.',
    '¡Fantástico! Estás resolviendo como profesional.'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Transformar ID a formato legible
export function formatId(id) {
  return id < 10 ? `0${id}` : `${id}`;
}