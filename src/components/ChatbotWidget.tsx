import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your OutbreakGuardian AI assistant. I can help you with outbreak analysis, resource optimization, and system insights. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const responses = {
    'outbreak': 'Based on current data, the outbreak risk is at 45% (Medium level). The AI model predicts a potential increase in respiratory cases over the next 48 hours. Would you like me to show you the detailed risk factors?',
    'beds': 'Current bed utilization is at 78%. I recommend redistributing 12 beds from General Ward to ICU to optimize patient flow. This could reduce wait times by 15%.',
    'optimize': 'Running optimization analysis... I suggest: 1) Increase nursing staff during 2-6 PM peak hours, 2) Relocate portable equipment to Emergency, 3) Redistribute bed allocation. Expected improvement: 28% reduction in wait times.',
    'data': 'Your data sources are: Weather API (Connected), Wastewater monitoring (Active), Medical records (Real-time sync), Social media (Disconnected). All systems are operational with 99.2% uptime.',
    'help': 'I can help you with: 📊 Outbreak risk analysis, 🏥 Resource optimization, 📈 Trend analysis, ⚠️ Alert management, 📋 System status, 🔧 Configuration help. Just ask me about any of these topics!',
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple keyword matching for responses
    setTimeout(() => {
      let botResponse = "I understand you're asking about that. Let me provide some general guidance: OutbreakGuardian uses AI to predict outbreaks and optimize hospital resources. For specific queries, try asking about 'outbreak risk', 'bed optimization', or 'data status'.";
      
      const lowerInput = inputText.toLowerCase();
      if (lowerInput.includes('outbreak') || lowerInput.includes('risk')) {
        botResponse = responses.outbreak;
      } else if (lowerInput.includes('bed') || lowerInput.includes('beds')) {
        botResponse = responses.beds;
      } else if (lowerInput.includes('optimize') || lowerInput.includes('optimization')) {
        botResponse = responses.optimize;
      } else if (lowerInput.includes('data') || lowerInput.includes('status')) {
        botResponse = responses.data;
      } else if (lowerInput.includes('help') || lowerInput.includes('what can')) {
        botResponse = responses.help;
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-blue-100">OutbreakGuardian Helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about outbreaks, optimization, or data..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}