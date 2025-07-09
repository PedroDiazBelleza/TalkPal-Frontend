"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Shield, Zap } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = email.split("@")[0] || "Usuario";
    onLogin(name);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Panel izquierdo - TalkPal, tu amigo fiel de voz */}
        <div className="hidden lg:flex flex-col justify-center space-y-10 p-8">
          {/* Branding principal */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <img src="./images/favicon-talkpal.png"/>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                TalkPal
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Tu amigo fiel que siempre escucha y te acompaña en cada
              videollamada, ayudándote a comunicar tu voz con confianza.
            </p>
          </div>

          {/* Características temáticas */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#4A90E2]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Siempre a tu lado
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  TalkPal escucha tu voz y te ayuda a expresarte mejor,
                  detectando quién eres para personalizar tu experiencia.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#4A90E2]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Confianza y privacidad
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Tus conversaciones están protegidas con la máxima seguridad
                  para que hables sin preocupaciones.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#4A90E2]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Hecho por un gran equipo
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Tres desarrolladores dedicados que crearon TalkPal para
                  acompañarte en cada palabra.
                </p>
              </div>
            </div>
          </div>

          {/* Créditos del equipo */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sistema desarollado por:
            </p>
            <ul className="text-slate-700 dark:text-slate-200 text-sm space-y-1 list-disc list-inside">
              <li>Jordan Paolo Davila Durazno - U21218023</li>
              <li>Morelia Paola Gonzales Valdivia - U21210984</li>
              <li>Pedro Jesus Diaz Belleza - U21210433</li>
            </ul>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="justify-center mx-auto ">
                <img src="./images/logo-talkpal.png" width={250}/>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Accede a tu cuenta para comenzar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                    className="h-12 border-slate-200 dark:border-slate-600 focus:border-[#4A90E2] focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-12 border-slate-200 dark:border-slate-600 focus:border-[#4A90E2] focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-slate-600 dark:text-slate-300"
                    >
                      Recordarme
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="text-[#28c2f0] hover:text-[#357ABD] p-0 h-auto"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#28c2f0] to-[#357ABD] hover:from-[#357ABD] hover:to-[#28c2f0] text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  ¿No tienes cuenta?{" "}
                  <Button
                    variant="link"
                    className="text-[#28c2f0] hover:text-[#357ABD] p-0 h-auto"
                  >
                    Regístrate aquí
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
