//app/api/missions/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET() {
  try {
    // Leer el archivo JSON de misiones
    const filePath = path.join(process.cwd(), 'src/data/missions.json');
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return new NextResponse(
        JSON.stringify({ error: 'El archivo de misiones no existe' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Leer y parsear el archivo
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Devolver el contenido
    return new NextResponse(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al cargar las misiones:', error);
    
    // Devolver error
    return new NextResponse(
      JSON.stringify({ error: 'Error al cargar las misiones' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}