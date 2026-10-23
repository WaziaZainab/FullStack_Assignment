import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { usePlayer } from '../context/PlayerContext';
import { SocketEvents } from '../types';
import { gameService } from '../services/gameService';
import { ChatMessage } from '../../../shared/types';

interface ChatBoxProps {
  isDrawer: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isDrawer }) => {
  const { socket } = useSocket();
  const { player } = usePlayer();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on(SocketEvents.CHAT_MESSAGE, handleNewMessage);

    return () => {
      socket.off(SocketEvents.CHAT_MESSAGE, handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket && !isDrawer) {
      gameService.sendGuess(socket, input, player?.name);
      setInput('');
    }
  };

  return (
    <div className="w-full lg:w-80 bg-[#FFFCF6] flex flex-col h-full shadow-sm">
      <div className="p-4 font-extrabold border-b border-[#DED2EF] bg-[#EDE5FA] text-[#55418D] shadow-sm z-10">
        Chat & Guesses
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F1E5]">
        {messages.map(msg => (
          <div 
            key={msg.id} 
              className={`p-2 rounded-xl text-sm ${
              msg.isSystem && msg.isCorrectGuess
                ? 'bg-[#E2F5E8] text-[#276749] font-bold border border-[#A8DDB8]'
                : msg.isSystem
                ? 'bg-[#FFF1D6] text-[#805B20] font-semibold text-center italic border border-[#F2D9A6]'
                : 'bg-[#FFFCF6] text-[#39304F] shadow-sm border border-[#E7DCCB]'
            }`}
          >
            {!msg.isSystem && <span className="font-extrabold text-[#7762D9] mr-2">{msg.senderName}:</span>}
            {msg.isSystem && msg.isCorrectGuess && <span className="font-bold mr-2">{msg.senderName}</span>}
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#DED2EF] bg-[#FFFCF6]">
        <input 
          type="text" 
          placeholder={isDrawer ? "Drawers cannot guess..." : "Type your guess here..."} 
          className="w-full p-3 border border-[#D5C8E8] rounded-xl bg-white text-[#39304F] placeholder:text-[#9A8CB6] focus:outline-none focus:border-[#7762D9] focus:ring-2 focus:ring-[#7762D9]/20 disabled:bg-[#F0EAF3] disabled:cursor-not-allowed"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isDrawer}
        />
      </form>
    </div>
  );
};

export default ChatBox;
