"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Plane,
  Car,
} from "lucide-react";
import type { Gender } from "@/pages/page";
import Webcam from "react-webcam";
import { convertorService } from "@/services/convertorService";

interface PreCallScreenProps {
  userName: string;
  onVoiceDetection: (gender: Gender) => void;
  onJoinCall: () => void;
}

export default function PreCallScreen({
  userName,
  onVoiceDetection,
  onJoinCall,
}: PreCallScreenProps) {
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [genderDetected, setGenderDetected] = useState<
    "Male" | "Female" | null
  >(null);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setMicEnabled(true);
    setIsListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        handleVoiceTest(audioBlob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const handleVoiceTest = async (audioBlob: Blob) => {
    setIsListening(false); // <- Aquí ahora
    setVoiceDetected(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      const response = await convertorService.predictGender(formData);

      if (response.status === 200) {
        const genderDetected = response.data.gender;
        setGenderDetected(genderDetected);
        onVoiceDetection(genderDetected);
      } else {
        console.log(
          "Error al detectar: " + (response.data.error || "Desconocido")
        );
      }
    } catch (err) {
      console.error("Error al transcribir:", err);
    } finally {
      setVoiceDetected(false);
      setMicEnabled(false); // <- Aquí ahora
    }
  };
  const streamRef = useRef<MediaStream | null>(null);
  const webcamRef = useRef(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Panel izquierdo - Vista previa */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-slate-800 dark:text-slate-100">
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Simulación de cámara */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden">
              {cameraEnabled ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: "user", // 'user' para frontal, 'environment' para trasera (en móviles)
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center space-y-2">
                    <VideoOff className="w-12 h-12 text-slate-400 mx-auto" />
                    <p className="text-slate-400">Cámara desactivada</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de dispositivos */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={micEnabled ? "default" : "secondary"}
                size="lg"
                onClick={() => setMicEnabled(!micEnabled)}
                className={`w-14 h-14 rounded-full ${
                  micEnabled
                    ? "bg-[#4A90E2] hover:bg-[#357ABD]"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {micEnabled ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </Button>

              <Button
                variant={cameraEnabled ? "default" : "secondary"}
                size="lg"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`w-14 h-14 rounded-full ${
                  cameraEnabled
                    ? "bg-[#4A90E2] hover:bg-[#357ABD]"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {cameraEnabled ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
              >
                <Settings className="w-6 h-6" />
              </Button>
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
          </CardContent>
        </Card>

        {/* Panel derecho - Configuración */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-slate-800 dark:text-slate-100">
              Preparación de Llamada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                ¡Hola, {userName}!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Antes de unirte a la llamada, vamos a configurar tu perfil de
                voz.
              </p>
            </div>

            {/* Prueba de voz */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Detección de Voz
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Di "Hola, soy {userName}" para que podamos detectar tu perfil
                  de voz automáticamente.
                </p>

                <Button
                  onClick={!micEnabled ? startRecording : stopRecording}
                  disabled={voiceDetected || !!genderDetected}
                  className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                >
                  {!micEnabled && !voiceDetected && !genderDetected && (
                    <>Iniciar Prueba de Voz</>
                  )}

                  {micEnabled && isListening && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Escuchando...</span>
                    </div>
                  )}

                  {micEnabled && voiceDetected && !genderDetected && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analizando voz...</span>
                    </div>
                  )}

                  {genderDetected && (
                    <div className="flex items-center space-x-2 justify-center">
                      <div className="text-4xl">
                        {genderDetected === "Male" ? <Plane /> : <Car />}
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ✓ {genderDetected}
                      </Badge>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Información de la reunión */}
            <div className="p-4 bg-[#4A90E2]/5 border border-[#4A90E2]/20 rounded-lg">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Información de la Reunión
              </h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <strong>Sala:</strong> Reunión Principal
                </p>
                <p>
                  <strong>Participantes:</strong> 2 personas esperando
                </p>
                <p>
                  <strong>Duración estimada:</strong> 30 minutos
                </p>
              </div>
            </div>

            {/* Botón de unirse */}
            <Button
              onClick={onJoinCall}
              disabled={!genderDetected}
              className="w-full h-12 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:from-[#357ABD] hover:to-[#2E6BA8] text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Unirse a la Llamada
            </Button>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Al unirte, aceptas nuestros términos de uso y política de
              privacidad
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
