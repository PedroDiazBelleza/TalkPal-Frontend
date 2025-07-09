/*import { useRef, useState } from "react";
import "./App.css";
import { convertorService } from "./services/convertorService";

function App() {
  // Variables para conversor de texto a Audio
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  // Variables para conversor de audio a Texto
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  // Variables para predición de genero de audio
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSynthesize = async () => {
    const response = await convertorService.synthesize(text);
    const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
    setAudioSrc(audioSrc);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranscribe = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo MP3");

    const formData = new FormData();
    formData.append("audio", file);

    setLoading(true);
    setTranscription("");

    try {
      const response = await convertorService.transcribe(formData);
      const data = response.data;

      if (response.status === 200) {
        setTranscription(data.transcription || "No se detectó ninguna voz.");
      } else {
        setTranscription(
          "Error al transcribir: " + (data.error || "Desconocido")
        );
      }
    } catch (error) {
      setTranscription("Error de red o servidor: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange2 = (e) => {
    setFile2(e.target.files[0]);
    setResult(null); // Limpia resultado anterior si eliges otro archivo
    setError("");
  };
  const handleTranscribe2 = async (e) => {
    e.preventDefault();

    if (!file2) {
      setError("Por favor selecciona un archivo .mp3");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file2); // debe coincidir con `upload.single('audio')` en backend

    try {
      const response = await convertorService.predictGender(formData);
      const data = response.data;

      if (response.status === 200) {
        setResult(data);
      } else {
        setError(data.error || "Error al procesar el archivo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    }
  };

  const handleFileChange3 = (e) => {
    setFile(e.target.files[0]);
  };

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
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
        //const audioUrl = URL.createObjectURL(audioBlob);
        //setAudioSrc(audioUrl);
        // Aquí puedes enviar el blob a tu servidor o función de transcripción
        handleTranscribe3(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleTranscribe3 = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      const response = await convertorService.communicate(formData);

      if (response.status === 201) {
        const audioBase64 = response.data.data.audioContent;
        const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
        setAudioSrc(audioSrc);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Grabar audio para transcribir
        </h1>

        <div className="flex justify-center space-x-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              🎤 Comenzar grabación
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              ⏹️ Detener grabación
            </button>
          )}
        </div>

        {loading && (
          <p className="text-blue-500 text-center mt-4">
            Transcribiendo audio...
          </p>
        )}

        {audioSrc && (
          <div className="mt-6">
            <h2 className="text-sm text-gray-700 mb-2">Audio grabado:</h2>
            <audio controls src={audioSrc} className="w-full" />
          </div>
        )}
      </div>
    </div>

    /*<>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Subir archivo MP3 para transcribir
          </h1>

          <form onSubmit={handleTranscribe3} className="space-y-4">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Selecciona un archivo MP3
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".mp3"
                onChange={handleFileChange3}
                required
                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              {loading ? "Transcribiendo..." : "Transcribir"}
            </button>
          </form>

          {audioSrc && (
            <div className="mt-6">
              <h2 className="text-sm text-gray-700 mb-2">
                Previsualización de audio:
              </h2>
              <audio controls src={audioSrc} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </>*/

    /*
    <>
      <h1>Text to speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe el texto que desea convertir"
      />
      <br />
      <button onClick={handleSynthesize}>Convertir a mp3</button>
      <br />
      {audioSrc && <audio controls src={audioSrc} />}

      <hr />
      <h1>Subir archivo MP3 para transcribir</h1>
      <form onSubmit={handleTranscribe}>
        <input type="file" accept=".mp3" onChange={handleFileChange} required />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          {loading ? "Transcribiendo..." : "Transcribir"}
        </button>
      </form>

      <h2>Transcripción:</h2>
      <pre>{transcription}</pre>

      <hr />
      <div>
        <h1>Predicción de Género por Voz</h1>

        <form onSubmit={handleTranscribe2}>
          <input
            type="file"
            accept=".mp3"
            onChange={handleFileChange2}
            required
          />
          <button type="submit">Predecir Género</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div id="result">
            <h3>Resultado:</h3>
            <p>
              <strong>Género:</strong> {result.gender}
            </p>
            <p>
              <strong>Probabilidad Masculino:</strong>{" "}
              {result.male_prob.toFixed(2)}%
            </p>
            <p>
              <strong>Probabilidad Femenino:</strong>{" "}
              {result.female_prob.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
*/