
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const CareerCoach = () => {
  const [messages, setMessages] = useState<{
    id: number;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }[]>([
    {
      id: 1,
      content: "Hello! I'm your AI Career Coach. How can I help you with your career questions today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Mock response function - in a real app, this would call to OpenAI or another API
  const getBotResponse = (userMessage: string) => {
    // Simple responses based on keywords
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('engineering') || lowerCaseMessage.includes('engineer')) {
      return "Engineering is a great career path! There are many specializations like computer science, mechanical, civil, or electrical engineering. Based on your interests in technology and problem-solving, you might enjoy software engineering or AI development. Would you like to know about top engineering colleges in India?";
    } else if (lowerCaseMessage.includes('medical') || lowerCaseMessage.includes('doctor')) {
      return "A career in medicine is rewarding but demanding. Besides becoming a doctor, you can consider fields like medical research, healthcare management, or specialized areas like radiology or pediatrics. NEET is the main entrance exam for medical courses in India. Would you like tips on preparing for medical entrance exams?";
    } else if (lowerCaseMessage.includes('arts') || lowerCaseMessage.includes('humanities')) {
      return "The arts and humanities offer diverse career options! You could explore journalism, content creation, education, psychology, law, or design. These fields value critical thinking and creativity. Many successful people have arts backgrounds. What specific area within humanities interests you?";
    } else if (lowerCaseMessage.includes('exam') || lowerCaseMessage.includes('preparation') || lowerCaseMessage.includes('study')) {
      return "For effective exam preparation, create a structured study plan, use active recall techniques, take regular breaks, and practice with previous years' papers. Would you like specific tips for a particular exam like JEE, NEET, or UPSC?";
    } else if (lowerCaseMessage.includes('college') || lowerCaseMessage.includes('university')) {
      return "When choosing a college, consider factors like reputation, location, faculty expertise, placement records, and course curriculum. What subject are you interested in studying? I can recommend some top institutions in that field.";
    } else {
      return "That's an interesting question about your career journey. To give you the best guidance, could you tell me more about your interests, strengths, and what subjects you enjoy studying?";
    }
  };
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate typing delay for the bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        content: getBotResponse(inputMessage),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Career Coach</h1>
        <p className="text-muted-foreground">Get personalized guidance for your education and career decisions</p>
      </div>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-campus-blue" />
            Career Coach Assistant
          </CardTitle>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4 h-[50vh]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'bg-campus-blue' : 'bg-campus-purple'}`}>
                    <AvatarFallback>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-campus-blue text-white'
                        : 'bg-muted'
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-campus-purple">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex gap-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <Separator />
        
        <CardFooter className="p-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full gap-2"
          >
            <Input
              placeholder="Ask me anything about careers, colleges or exams..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              className="bg-campus-blue hover:bg-campus-blue/90"
              disabled={!inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CareerCoach;
