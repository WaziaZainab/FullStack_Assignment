import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSocket } from '../context/SocketContext';
import { usePlayer } from '../context/PlayerContext';
import { SocketEvents } from '../types';
import { gameService } from '../services/gameService';

const Leaderboard: React.FC = () => {
  const { roomState, setRoomState } = useGame();
  const { socket } = useSocket();

  const { player } = usePlayer();

  useEffect(() => {
    if (!socket) return;
    
    socket.on('SCORES_UPDATED', (state: any) => {
      setRoomState(state);
    });

    return () => {
      socket.off('SCORES_UPDATED');
    };
  }, [socket, setRoomState]);

  if (!roomState) return null;

  const isHost = player?.id === roomState.hostId;

  const handleKick = (targetId: string) => {
    if (socket && window.confirm('Are you sure you want to kick this player?')) {
      gameService.kickPlayer(socket, roomState.roomId, targetId);
    }
  };

  const handleVotekick = (targetId: string, targetName: string) => {
    if (socket && window.confirm(`Start a votekick against ${targetName}?`)) {
      gameService.startVotekick(socket, roomState.roomId, targetId, targetName);
    }
  };

  // Sort players by score descending
  const sortedPlayers = [...roomState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full lg:w-64 bg-[#FFFCF6] border-b-2 lg:border-b-0 lg:border-r-2 border-[#DED2EF] flex flex-col h-full shadow-sm z-10 shrink-0">
      <div className="p-4 font-extrabold border-b border-[#DED2EF] bg-[#EDE5FA] text-[#55418D] shadow-sm">
        Players & Leaderboard
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#F8F1E5]">
        {sortedPlayers.map((p, index) => (
          <div 
            key={p.id} 
           className={`p-3 rounded-xl flex items-center justify-between border shadow-sm transition-all ${
              p.hasGuessedCorrectly
                ? 'bg-[#E2F5E8] border-[#A8DDB8]'
                : 'bg-[#FFFCF6] border-[#E7DCCB]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#9A8CB6] w-4 text-center">#{index + 1}</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#EDE5FA] border-2 border-[#CFC0E8] overflow-hidden flex-shrink-0">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black text-black">{p.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`font-extrabold ${p.isDrawer ? 'text-[#7762D9]' : 'text-[#39304F]'}`}>
                  {p.name} {p.isDrawer && '✏️'}
                </span>
                {p.hasGuessedCorrectly && !p.isDrawer && (
                  <span className="text-xs text-green-600 font-bold">Guessed!</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-black text-lg text-[#6551B3]">{p.score}</span>
              {player && player.id !== p.id && (
                <div className="flex gap-1">
                  {isHost && (
                    <button onClick={() => handleKick(p.id)} className="text-[10px] bg-red-100 hover:bg-red-500 hover:text-white text-red-600 px-1 py-0.5 rounded border border-red-200">
                      Kick
                    </button>
                  )}
                  {!isHost && (
                    <button onClick={() => handleVotekick(p.id, p.name)} className="text-[10px] bg-yellow-100 hover:bg-yellow-500 hover:text-white text-yellow-700 px-1 py-0.5 rounded border border-yellow-300">
                      VoteKick
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
