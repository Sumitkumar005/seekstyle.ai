"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Maximize2,
  Minimize2,
  ImageIcon,
  Palette,
  Search,
} from "lucide-react"
import { aiAPI } from "@/lib/api"
import { useAnalytics } from "@/components/analytics-provider"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "suggestion" | "product"
  data?: any
}

const quickSuggestions = [
  { text: "Find me cottagecore dresses", icon: Palette },
  { text: "Show trending Y2K styles", icon: Search },
  { text: "Help me create a moodboard", icon: ImageIcon },
  { text: "What's popular this week?", icon: Sparkles },
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI fashion assistant. I can help you find styles, create moodboards, discover trends, or answer questions about fashion. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackEvent } = useAnalytics()
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      // Track chat event
      trackEvent("chat_message_sent", {
        message_length: textToSend.length,
        user_authenticated: !!user,
      })

      // Get context from previous messages (last 5)
      const context = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Call AI API with enhanced context
      const response = await aiAPI.chat(textToSend, {
        context,
        user_id: user?.id,
        user_preferences: user
          ? {
              name: user.name,
              isPro: user.isPro,
            }
          : null,
      })

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        type: response.type || "text",
        data: response.data,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Track successful response
      trackEvent("chat_response_received", {
        response_type: response.type || "text",
        has_data: !!response.data,
      })
    } catch (error) {
      console.error("Chat error:", error)

      // Enhanced error handling with helpful suggestions
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now, but I can still help! Try asking me about fashion trends, style advice, or creating moodboards. I have lots of fashion knowledge built-in!",
        timestamp: new Date(),
        type: "suggestion",
      }

      setMessages((prev) => [...prev, errorMessage])

      trackEvent("chat_error", { error_type: "api_failure" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    trackEvent("chat_expand_toggle", { expanded: !isExpanded })
  }

  const renderMessage = (message: Message) => {
    if (message.type === "suggestion") {
      return (
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {showSuggestions && (
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="text-xs h-auto p-2 flex items-center gap-1"
                  >
                    <Icon className="w-3 h-3" />
                    {suggestion.text}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={() => {
              setIsOpen(!isOpen)
              trackEvent("chat_toggle", { opened: !isOpen })
            }}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 relative"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            {!isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
          </Button>
        </motion.div>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-40"
            style={{
              bottom: "6rem",
              right: "1.5rem",
              width: isExpanded ? "calc(100vw - 3rem)" : "380px",
              height: isExpanded ? "calc(100vh - 9rem)" : "500px",
              maxWidth: isExpanded ? "900px" : "380px",
            }}
          >
            <Card className="w-full h-full shadow-2xl border-2">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg flex flex-row items-center justify-between p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-5 h-5" />
                  AI Fashion Assistant
                  {user && (
                    <Badge variant="secondary" className="text-xs">
                      {user.isPro ? "Pro" : "Free"}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={toggleExpand}>
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {renderMessage(message)}
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.2 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.4 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        user ? `Ask me anything, ${user.name}...` : "Ask about fashion, styles, or trends..."
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  {messages.length === 1 && (
                    <div className="mt-3 text-xs text-muted-foreground text-center">
                      Try: "Find me trending styles" or "Help me create a moodboard"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
