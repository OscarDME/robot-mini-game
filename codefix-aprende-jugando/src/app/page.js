"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, BrainCircuit, Sparkles, Zap, CheckCircle, RocketIcon, XCircle } from "lucide-react";
import CodeBackground from "@/components/code-background";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Efecto para manejar la animación inicial
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Ventajas del juego con iconos
  const features = [
    { 
      icon: <BrainCircuit className="h-6 w-6" />, 
      title: "Pensamiento lógico", 
      description: "Desarrolla habilidades de resolución de problemas" 
    },
    { 
      icon: <Code className="h-6 w-6" />, 
      title: "Conceptos de código", 
      description: "Aprende secuencias, variables, bucles y más" 
    },
    { 
      icon: <Sparkles className="h-6 w-6" />, 
      title: "Interfaz interactiva", 
      description: "Aprende viendo cómo el código cobra vida" 
    },
    { 
      icon: <Zap className="h-6 w-6" />, 
      title: "Progresión gradual", 
      description: "De lo simple a lo complejo, a tu ritmo" 
    },
  ];
  
  // Niveles destacados
  const highlightedLevels = [
    {
      number: 1,
      title: "Secuencias",
      description: "Aprende a ordenar instrucciones en secuencia",
      color: "from-blue-500 to-cyan-400",
      icon: "🔢",
      delay: 0.2
    },
    {
      number: 2,
      title: "Condicionales",
      description: "Aprende a tomar decisiones basadas en condiciones",
      color: "from-purple-500 to-pink-400",
      icon: "🔀",
      delay: 0.4
    },
    {
      number: 3,
      title: "Bucles",
      description: "Aprende a repetir instrucciones con bucles",
      color: "from-amber-500 to-orange-400",
      icon: "🔄",
      delay: 0.6
    }
  ];
  
  // Robot flotante con animación
  const RobotAnimation = () => (
    <motion.div
      className="absolute z-10"
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <div className="relative w-32 h-40">
        {/* Antena */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 rounded-full bg-red-500"></div>
        </motion.div>
        
        {/* Cabeza */}
        <div className="absolute top-4 w-full h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-2xl shadow-lg">
          {/* Ojos */}
          <motion.div 
            className="absolute top-5 left-5 w-5 h-5 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
          </motion.div>
          <motion.div 
            className="absolute top-5 right-5 w-5 h-5 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
          </motion.div>
          
          {/* Boca */}
          <motion.div 
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-white rounded-full"
            animate={{ scaleX: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          ></motion.div>
        </div>
        
        {/* Cuerpo */}
        <div className="absolute bottom-0 w-full h-12 bg-blue-700 rounded-b-lg shadow-lg">
          {/* Luces */}
          <motion.div 
            className="absolute top-3 left-4 w-3 h-3 bg-yellow-300 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute top-3 right-4 w-3 h-3 bg-green-400 rounded-full"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Partículas de código en el fondo */}
      <CodeBackground />
      
      {/* Contenido principal */}
      <div className="container relative z-10 pt-16 pb-24 px-4 mx-auto">
        <motion.header
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full text-blue-800 font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aprender a programar nunca fue tan divertido
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="inline-block relative">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CodeFix
              </span>
              <motion.span 
                className="absolute -top-8 -right-6 text-2xl"
                animate={{ 
                  rotate: [0, 10, 0],
                  y: [0, -4, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ✨
              </motion.span>
            </span>
            <span className="block mt-2 text-slate-800">Aprende Jugando</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Ayuda al robot a corregir errores en su código mientras aprendes los fundamentos de la programación a través de misiones interactivas y divertidas
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link href="/juego" className="w-full sm:w-auto">
              <Button className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 group">
                <span>¡Comenzar a jugar!</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto h-14 text-lg border-2 shadow-sm">
              Ver tutorial
            </Button>
          </div>
        </motion.header>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-24 relative">
          {/* Imagen destacada */}
          <div className="relative flex items-center justify-center order-2 lg:order-1">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl opacity-60"
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.div
              className="relative z-10 w-full max-w-md p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4 text-xs text-slate-500">
                  <div className="flex space-x-1.5 mr-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  main.js
                </div>
                
                <div className="font-mono text-sm mb-5">
                  <div className="text-slate-500">// Misión: Encender la luz</div>
                  <div className="flex items-center">
                    <span className="w-6 inline-block text-slate-400">1</span>
                    <span className="text-purple-600">function</span>
                    <span className="text-blue-600 mx-1">encenderLuz</span>
                    <span>()</span>
                    <span className="text-slate-700 mx-1">&#123;</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 inline-block text-slate-400">2</span>
                    <span className="ml-4 text-slate-700">
                      <span className="text-pink-600">presionar</span>
                      <span> interruptor;</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 inline-block text-slate-400">3</span>
                    <span className="ml-4 text-slate-700">
                      <span className="text-pink-600">ir</span>
                      <span> hacia </span>
                      <span className="text-green-600">la</span>
                      <span> luz;</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 inline-block text-slate-400">4</span>
                    <span className="ml-4 text-slate-700">
                      <span className="text-pink-600">buscar</span>
                      <span> interruptor;</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 inline-block text-slate-400">5</span>
                    <span className="text-slate-700">&#125;</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-sm text-red-500 font-medium flex items-center px-3 py-1.5 rounded-full bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" /> ¡La secuencia es incorrecta!
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <RobotAnimation />
              </div>
            </motion.div>
          </div>
          
          {/* Características del juego */}
          <motion.div 
            className="flex flex-col justify-center order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Aprende a programar de forma divertida
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                CodeFix te enseña los conceptos fundamentales de la programación mientras ayudas a un simpático robot a corregir errores en su código.
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex p-4 bg-white rounded-xl shadow-sm border border-slate-100"
                >
                  <div className="mr-4 p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Niveles del juego */}
        <div className="mb-24">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Explora los niveles</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Progresa a través de divertidos desafíos mientras dominas diferentes conceptos de programación
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
            {highlightedLevels.map((level, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: level.delay, duration: 0.5 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10"
                  style={{ 
                    background: `linear-gradient(to right, ${level.color.split(' ')[1]}, ${level.color.split(' ')[3]})`,
                  }}
                />
                <div className="h-full bg-white border-2 rounded-2xl overflow-hidden group-hover:border-transparent shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <div className={`h-24 bg-gradient-to-r ${level.color} flex items-center justify-center text-white relative overflow-hidden`}>
                    <motion.div
                      className="absolute w-32 h-32 bg-white/10 rounded-full"
                      initial={false}
                      animate={hoveredCard === index ? { 
                        scale: [1, 1.5],
                        x: [0, 30],
                        y: [0, -20]
                      } : {}}
                      transition={{ duration: 1.5 }}
                    />
                    <motion.div
                      className="absolute w-20 h-20 bg-white/10 rounded-full left-10 bottom-0"
                      initial={false}
                      animate={hoveredCard === index ? { 
                        scale: [1, 1.8],
                        x: [-20, 10],
                        y: [0, 20]
                      } : {}}
                      transition={{ duration: 1.5, delay: 0.1 }}
                    />
                    <div className="z-10 flex items-center">
                      <span className="text-4xl mr-4">{level.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-lg">Nivel {level.number}</div>
                        <div className="text-white/90">{level.title}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-gray-600 mb-5">{level.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                          {level.number === 1 ? '3 misiones' : level.number === 2 ? '2 misiones' : '1 misión'}
                        </span>
                      </div>
                      <motion.button
                        className="text-blue-600 font-medium text-sm flex items-center"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Ver detalles
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA final */}
        <motion.div 
          className="text-center max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100">
            <motion.div 
              className="inline-block text-4xl mb-5"
              animate={{ 
                y: [0, -10, 0],
                rotate: [-5, 5, -5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🚀
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              ¿Listo para comenzar tu aventura?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Inicia tu viaje a través del mundo de la programación con nuestro amigable robot. ¡No se necesita experiencia previa!
            </p>
            <Link href="/juego">
              <Button className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-blue-500/20 group">
                <RocketIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
                <span>¡Comenzar aventura!</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}