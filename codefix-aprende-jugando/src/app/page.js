//app/page.js
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          CodeFix: Aprende Jugando
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ayuda al robot a corregir errores en su código mientras aprendes los fundamentos de la programación
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Carta 1: Comienza a jugar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="h-full border-2 hover:border-blue-400 transition-all">
            <CardHeader>
              <CardTitle className="text-blue-600">¡Comienza tu aventura!</CardTitle>
              <CardDescription>Inicia tu viaje de programación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                <div className="w-20 h-24 bg-blue-500 rounded-t-full relative">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-6 left-4"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full top-6 right-4"></div>
                  <div className="absolute w-8 h-2 bg-white rounded-full top-14 left-6"></div>
                </div>
              </div>
              <p>
                Ayuda a nuestro robot amigo a solucionar problemas de código y superar misiones. ¡No se necesita experiencia previa!
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/juego" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  ¡Jugar ahora!
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Carta 2: ¿Qué aprenderás? */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="h-full border-2 hover:border-purple-400 transition-all">
            <CardHeader>
              <CardTitle className="text-purple-600">¿Qué aprenderás?</CardTitle>
              <CardDescription>Habilidades de programación</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Secuencias lógicas de instrucciones</li>
                <li>Condicionales para tomar decisiones</li>
                <li>Bucles para repetir tareas</li>
                <li>Variables para almacenar información</li>
                <li>Funciones para organizar código</li>
              </ul>
              <p className="text-sm text-gray-600">
                Todo explicado de forma simple y divertida
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/juego" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver niveles
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Carta 3: Sobre el juego */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="h-full border-2 hover:border-green-400 transition-all">
            <CardHeader>
              <CardTitle className="text-green-600">¿Por qué CodeFix?</CardTitle>
              <CardDescription>Aprender programación es divertido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p>CodeFix es un juego educativo diseñado para niños y niñas que quieren aprender a programar de forma divertida.</p>
                <p>Al corregir errores, desarrollas habilidades críticas de pensamiento lógico y resolución de problemas.</p>
              </div>
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-2">
                  ODS 4
                </span>
                <span className="text-xs text-gray-500">Educación de calidad</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/juego" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Explorar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}