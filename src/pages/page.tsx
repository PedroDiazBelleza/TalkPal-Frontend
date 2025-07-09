"use client"

import LoginScreen from "@/configs/login-screen"
import PreCallScreen from "@/configs/pre-call-screen"
import VideoCallScreen from "@/configs/video-call-screen"
import { useState } from "react" 

export type AppState = "login" | "pre-call" | "in-call"
export type Gender = "Male" | "Female" | null
export type ViewMode = "presentation" | "conversation"

export default function VideoCallApp() {
  const [currentScreen, setCurrentScreen] = useState<AppState>("login")
  const [userGender, setUserGender] = useState<Gender>(null)
  const [userName, setUserName] = useState("")

  const handleLogin = (name: string) => {
    setUserName(name)
    setCurrentScreen("pre-call")
  }

  const handleVoiceDetection = (gender: Gender) => {
    setUserGender(gender)
  }

  const handleJoinCall = () => {
    setCurrentScreen("in-call")
  }

  const handleEndCall = () => {
    setCurrentScreen("login")
    setUserGender(null)
    setUserName("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}

      {currentScreen === "pre-call" && (
        <PreCallScreen
          userName={userName}
          onVoiceDetection={handleVoiceDetection}
          onJoinCall={handleJoinCall}
        />
      )}

      {currentScreen === "in-call" && (
        <VideoCallScreen userName={userName} userGender={userGender} onEndCall={handleEndCall} />
      )}
    </div>
  )
}
