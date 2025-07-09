import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MoreVertical,
  Maximize,
  Grid3X3,
  CameraIcon,
} from "lucide-react";
import type { Gender, ViewMode } from "@/pages/page";
import Webcam from "react-webcam";
import { convertorService } from "@/services/convertorService";

interface VideoCallScreenProps {
  userName: string;
  userGender: Gender;
  onEndCall: () => void;
}

export default function VideoCallScreen({
  userName,
  userGender,
  onEndCall,
}: VideoCallScreenProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female" | null>(userGender);
  const [loading, setLoading] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("presentation");
  // const [currentSpeaker, setCurrentSpeaker] = useState<"user" | "other" | null>(null);
  const [transcriptionText, setTranscriptionText] = useState("");

  const webcamRef = useRef<Webcam>(null);
  //const [screenshot, setScreenshot] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
     // const imageSrc = webcamRef.current.getScreenshot();
      //setScreenshot(imageSrc);
    }
  }, [webcamRef]);

  // PRINCIPAL FUNCTIONS
  const startRecording = async () => {
    setMicEnabled(true);
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
        handleTranscribe3(audioBlob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setMicEnabled(false);
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const handleTranscribe3 = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      const response = await convertorService.communicate(formData);

      if (response.status === 201) {
        const audioBase64 = response.data.data.audioContent;
        const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
        const genderDetected = response.data.gender;
        const textGenerated = response.data.text;
        setAudioSrc(audioSrc);
        setGender(genderDetected);
        setTranscriptionText(textGenerated);
      } else {
        console.log(
          "Error al transcribir: " + (response.data.error || "Desconocido")
        );
      }
    } catch (err) {
      console.error("Error al transcribir:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Video principal */}
      <div className="absolute inset-0">
        {viewMode === "presentation" ? (
          // Modo presentación - una persona grande, otra pequeña
          <>
            {/* Video principal */}
            <div className="w-full h-full bg-gradient-to-br from-[#101212] to-[#232526] flex items-center justify-center relative">
              <div className="text-center space-y-4">
                {gender === "Male" ? (
                  <>
                    <video
                      src={
                        isPlaying
                          ? "./videos/hombre_hablando.mp4"
                          : micEnabled
                          ? "./videos/hombre_oyendo.mp4"
                          : "./videos/hombre_existiendo.mp4"
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                    ></video>
                    <div className="absolute bottom-30 left-160 z-10">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-white">
                            Jordan Paolo
                          </p>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Conectado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <video
                      src={
                        isPlaying
                          ? "./videos/mujer_hablando.mp4"
                          : micEnabled
                          ? "./videos/mujer_oyendo.mp4"
                          : "./videos/mujer_existiendo.mp4"
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                    ></video>
                    <div className="absolute bottom-30 left-160 z-10">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-white">
                            Morelia Paola
                          </p>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Conectada
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {audioSrc && (
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    autoPlay
                    onPlay={() => {
                      setIsPlaying(true);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                    }}
                  />
                )}
              </div>

              {/* Indicador de voz para el usuario principal */}
              {isPlaying && (
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center space-x-3 bg-black/50 rounded-full px-4 py-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-sm">
                      {gender === "Male"
                        ? "Jordan Paolo está hablando"
                        : "Morelia Paola está hablando"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video propio (miniatura) */}
            <div className="absolute bottom-6 right-6 w-64 h-48 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl overflow-hidden border-2 border-white/20">
              {cameraEnabled ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div
                    className="text-6xl transition-all duration-300 scale-100"
                    style={{
                      filter: "none",
                    }}
                  >
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: "user", // 'user' para frontal, 'environment' para trasera (en móviles)
                      }}
                    />
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/50 text-white text-xs">Tú</Badge>
                  </div>
                  {!micEnabled && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <VideoOff className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
          </>
        ) : (
          // Modo conversación - ambos del mismo tamaño
          <div className="grid grid-cols-2 h-full gap-1">
            {/* Usuario actual */}
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center relative">
              <div className="text-center space-y-4">
                {cameraEnabled ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: "user", // 'user' para frontal, 'environment' para trasera (en móviles)
                      }}
                      width={800}
                    />
                    <div className="absolute bottom-30 left-70 z-10">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-white">
                            {userName}
                          </p>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Conectado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <VideoOff className="w-16 h-16 text-slate-400 mx-auto" />
                    <p className="text-slate-400">Cámara desactivada</p>
                  </div>
                )}
              </div>

              {!micEnabled && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <MicOff className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Otro usuario */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
              <div className="text-center space-y-4">
                {gender === "Male" ? (
                  <>
                    <video
                      src={
                        isPlaying
                          ? "./videos/hombre_hablando.mp4"
                          : micEnabled
                          ? "./videos/hombre_oyendo.mp4"
                          : "./videos/hombre_existiendo.mp4"
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                    ></video>
                    <div className="absolute bottom-30 left-70 z-10">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-white">
                            Jordan Paolo
                          </p>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Conectado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <video
                      src={
                        isPlaying
                          ? "./videos/mujer_hablando.mp4"
                          : micEnabled
                          ? "./videos/mujer_oyendo.mp4"
                          : "./videos/mujer_existiendo.mp4"
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                    ></video>
                    <div className="absolute bottom-30 left-70 z-10">
                      <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-semibold text-white">
                            Morelia Paola
                          </p>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Conectada
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {audioSrc && (
                  <audio src={audioSrc} autoPlay className="w-full" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transcripción flotante */}
      {isPlaying && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full max-w-md text-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {gender === "Male" ? "Jordan Paolo" : "Ana Garscía"}:
              </span>
            </div>
            <p className="text-sm mt-1">{transcriptionText}</p>
          </div>
        </div>
      )}

      {/* Esperando respuesta de la IA*/}
      {loading && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full max-w-md text-center">
            <p className="text-sm mt-1">Preparando respuesta...</p>
          </div>
        </div>
      )}

      {/* Controles inferiores */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Control de micrófono */}
          {!micEnabled ? (
            <Button
              variant={micEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={startRecording}
              className="w-14 h-14 rounded-full"
            >
              <MicOff className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              variant={micEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={stopRecording}
              className="w-14 h-14 rounded-full"
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}

          {/* Control de cámara */}
          <Button
            variant={cameraEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className="w-14 h-14 rounded-full"
          >
            {cameraEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Cambiar vista */}
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              setViewMode(
                viewMode === "presentation" ? "conversation" : "presentation"
              )
            }
            className="w-14 h-14 rounded-full"
          >
            {viewMode === "presentation" ? (
              <Grid3X3 className="w-6 h-6" />
            ) : (
              <Maximize className="w-6 h-6" />
            )}
          </Button>

          {/* Captura */}
          <Button
            variant="secondary"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={capture}
          >
            <CameraIcon className="w-6 h-6" />
          </Button>

          {/* Más opciones */}
          <Button
            variant="secondary"
            size="lg"
            className="w-14 h-14 rounded-full"
          >
            <MoreVertical className="w-6 h-6" />
          </Button>

          {/* Colgar */}
          <Button
            variant="destructive"
            size="lg"
            onClick={onEndCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Información de la llamada */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Llamada activa</span>
            <span className="text-sm text-slate-300">• 2 participantes</span>
          </div>
        </div>
      </div>

      {/* Indicador de modo de vista */}
      <div className="absolute top-6 right-6 z-10">
        <Badge className="bg-[#3fa1e7]/20 text-[#3fa1e7] border-[#3fa1e7]/30">
          {viewMode === "presentation"
            ? "Modo Presentación"
            : "Modo Conversación"}
        </Badge>
      </div>
    </div>
  );
}
