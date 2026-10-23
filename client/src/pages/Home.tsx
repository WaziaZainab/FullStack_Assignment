import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { usePlayer } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import { SocketEvents } from '../types';
import { gameService } from '../services/gameService';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const { socket, isConnected } = useSocket();
  const { setPlayer } = usePlayer();
  const { setRoomState } = useGame();
  const navigate = useNavigate();

  const avatars = [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mimi',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sasha',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bandit',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Peanut',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ginger',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Spooky',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Tinkerbell'
  ];

  const currentAvatar = avatars[avatarIndex];

  const handleCreateRoom = () => {
    if (!name.trim() || !socket) {
      setErrorMsg('Please enter your nickname first!');
      return;
    }

    setErrorMsg('');
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    setPlayer({
      id: socket.id || '',
      name: name.trim(),
      score: 0,
      isDrawer: false,
      hasGuessedCorrectly: false,
      avatar: currentAvatar
    });

    socket.once(SocketEvents.ROOM_JOINED, (state) => {
      setRoomState(state);
      navigate(`/lobby/${newRoomId}`);
    });

    gameService.createRoom(socket, newRoomId, name.trim(), currentAvatar);
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !socket) {
      setErrorMsg('Please enter your nickname first!');
      return;
    }

    setErrorMsg('');

    setPlayer({
      id: socket.id || '',
      name: name.trim(),
      score: 0,
      isDrawer: false,
      hasGuessedCorrectly: false,
      avatar: currentAvatar
    });

    if (roomId.trim()) {
      gameService.joinRoom(socket, roomId.trim(), name.trim(), currentAvatar);
    } else {
      gameService.playPublic(socket, name.trim(), currentAvatar);
    }

    socket.once(SocketEvents.ROOM_JOINED, (state) => {
      setRoomState(state);
      navigate(`/lobby/${state.roomId}`);
    });

    socket.once(SocketEvents.ROOM_NOT_FOUND, (error) => {
      setErrorMsg(error.message);
    });
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F1E5] text-[#514477] font-bold">
        Connecting to server...
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F8F1E5] px-4 pt-8 pb-8 sm:pt-10">

      {/* Decorative doodle stickers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <span className="absolute top-24 left-3 text-6xl text-[#8068D9] opacity-70 -rotate-12 hidden sm:block">✎</span>
        <span className="absolute top-44 left-[8%] text-5xl text-[#E7B746] opacity-80 rotate-12 hidden md:block">✧</span>
        <span className="absolute top-24 right-[8%] text-6xl text-[#8068D9] opacity-70 rotate-12 hidden sm:block">✳</span>
        <span className="absolute top-64 right-4 text-5xl text-[#54A9BD] opacity-80 rotate-12 hidden sm:block">♡</span>
        <span className="absolute top-[470px] left-[3%] text-4xl text-[#8068D9] opacity-70 rotate-12 hidden md:block">〰</span>
        <span className="absolute top-[520px] right-[5%] text-5xl text-[#E7B746] opacity-80 hidden md:block">✦</span>
        <span className="absolute bottom-36 left-[8%] text-5xl text-[#54A9BD] opacity-70 -rotate-12 hidden sm:block">♡</span>
        <span className="absolute bottom-24 right-[8%] text-5xl text-[#8068D9] opacity-70 rotate-12 hidden sm:block">✧</span>

        <div className="absolute top-[300px] left-3 sm:left-[4%] rounded-[45%] border-[3px] border-[#8068D9] px-3 py-2 text-sm sm:text-lg font-black text-[#725BC8] -rotate-12 hidden lg:block">
          Draw!
        </div>

        <div className="absolute top-[280px] right-3 sm:right-[4%] rounded-[45%] border-[3px] border-[#8068D9] px-3 py-2 text-sm sm:text-lg font-black text-[#725BC8] rotate-6 hidden lg:block">
          Guess!
        </div>

        <span className="absolute top-[185px] left-[17%] text-3xl text-[#E7B746] hidden lg:block">☼</span>
        <span className="absolute top-[180px] right-[17%] text-4xl text-[#8068D9] hidden lg:block">✩</span>
      </div>

      {/* Main content */}
      <main className="relative z-10 mx-auto flex w-full flex-col items-center">

        {/* Logo */}
        <div
          className="mb-3 flex items-center gap-0.5 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
          style={{
            textShadow: '3px 3px 0 #171717, -1px -1px 0 #171717, 1px -1px 0 #171717, -1px 1px 0 #171717'
          }}
          aria-label="skribbl.io"
        >
          <span className="text-red-500">s</span>
          <span className="text-orange-500">k</span>
          <span className="text-yellow-400">r</span>
          <span className="text-green-500">i</span>
          <span className="text-cyan-400">b</span>
          <span className="text-blue-500">b</span>
          <span className="text-purple-500">l</span>
          <span className="text-pink-500">.</span>
          <span className="text-red-500">i</span>
          <span className="text-orange-500">o</span>
          <span className="text-yellow-400">!</span>
        </div>

       
        <div className="mb-5 px-2 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#39304F] drop-shadow-sm">
            Draw it.
            <span className="text-[#7762D9]"> Guess it.</span>
            <br className="sm:hidden" />
            <span className="text-[#3297B5]"> Win it!</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base font-bold tracking-wide text-[#786B83]">
            ✨ Where imagination meets competition! ✨
          </p>
        </div>


        {/* Colourful logo dots */}
        <div className="mb-7 flex gap-1.5 sm:gap-2">
          {[
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-400',
            'bg-green-500',
            'bg-cyan-400',
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500'
          ].map((color, i) => (
            <div
              key={i}
              className={`h-7 w-7 sm:h-9 sm:w-9 ${color} rounded-full border-2 border-black shadow-sm`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-4 w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-700"
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Game panel */}
        <section className="w-full max-w-md rounded-2xl border border-[#C5B8F2] bg-gradient-to-br from-[#687CE1] to-[#5149B4] p-4 sm:p-5 shadow-[0_7px_0_0_#39316F]">

          {/* Name and language */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              aria-label="Enter your name"
              maxLength={20}
              className="min-w-0 flex-1 rounded-lg border-2 border-[#38305F] bg-[#FFFCF6] p-3 font-semibold text-[#39304F] placeholder:text-[#9286AF] outline-none focus:ring-2 focus:ring-[#B8ACFF]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJoinRoom();
              }}
            />

            <select
              aria-label="Language"
              className="w-24 rounded-lg border-2 border-[#38305F] bg-[#FFFCF6] p-2 font-bold text-[#39304F] outline-none"
              defaultValue="English"
            >
              <option>English</option>
            </select>
          </div>

          {/* Avatar selector */}
          <div className="relative mb-5 flex h-36 items-center justify-center">
            <button
              type="button"
              aria-label="Previous avatar"
              onClick={() =>
                setAvatarIndex((prev) =>
                  prev > 0 ? prev - 1 : avatars.length - 1
                )
              }
              className="absolute left-2 rounded-full px-3 py-2 text-3xl font-black text-white transition hover:bg-white/15 hover:scale-110"
            >
              ‹
            </button>

            <div className="h-28 w-28 overflow-hidden rounded-2xl border-[3px] border-[#272044] bg-[#C9F0EC] shadow-md">
              <img
                src={currentAvatar}
                alt="Selected player avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <button
              type="button"
              aria-label="Next avatar"
              onClick={() =>
                setAvatarIndex((prev) =>
                  prev < avatars.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-2 rounded-full px-3 py-2 text-3xl font-black text-white transition hover:bg-white/15 hover:scale-110"
            >
              ›
            </button>
          </div>

          {/* Join room and Play */}
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              placeholder="Code (if joining)"
              aria-label="Room code"
              maxLength={10}
              className="min-w-0 flex-1 rounded-lg border-2 border-[#30264F] bg-[#F5F0FF] p-3 text-center text-sm font-bold uppercase tracking-wider text-[#39304F] placeholder:text-[#9286AF] outline-none focus:ring-2 focus:ring-white"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJoinRoom();
              }}
            />

            <button
              type="button"
              onClick={handleJoinRoom}
              className="rounded-lg border-b-4 border-r-4 border-[#263C35] bg-[#55D99A] px-4 py-2 text-lg font-black text-[#193F35] transition hover:bg-[#75E7AD] active:translate-y-1 active:border-b-0 active:border-r-0"
            >
              Play!
            </button>
          </div>

          {/* Create private room */}
          <button
            type="button"
            onClick={handleCreateRoom}
            className="w-full rounded-lg border-b-4 border-r-4 border-[#30264F] bg-[#A58AF8] p-3 text-base sm:text-lg font-extrabold text-white transition hover:bg-[#B6A1FF] active:translate-y-1 active:border-b-0 active:border-r-0"
            style={{ textShadow: '1px 2px 2px #514080' }}
          >
            + Create Private Room
          </button>
        </section>

        {/* How to play */}
        <section className="mt-12 w-full max-w-5xl pb-8">
          <div className="mb-7 text-center">
            <p className="mb-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#8068D9]">
              ✦ HOW TO PLAY ✦
            </p>

            <h2 className="mb-3 text-3xl font-black text-[#39304F] sm:text-4xl">
              Three steps. Endless fun.
            </h2>

            <p className="text-sm text-[#776B81] sm:text-base">
              Jump in, get creative, and see who can guess the fastest!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">

            {/* Step 1 */}
            <article className="group rounded-2xl border border-[#E9DCCB] bg-[#FFFCF6] p-6 text-center shadow-[0_5px_12px_rgba(75,57,40,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D9C9F5] bg-[#EDE2FA] text-4xl transition group-hover:rotate-6 group-hover:scale-110">
                ✏️
              </div>

              <span className="inline-block rounded-full bg-[#EDE2FA] px-3 py-1 text-xs font-extrabold tracking-wider text-[#7655B9]">
                STEP 01
              </span>

              <h3 className="mb-2 mt-3 text-xl font-extrabold text-[#39304F]">
                Pick a Word
              </h3>

              <p className="text-sm leading-relaxed text-[#776B81]">
                It's your turn! Choose a secret word and get ready to draw it.
              </p>
            </article>

            {/* Step 2 */}
            <article className="group rounded-2xl border border-[#D6E7E8] bg-[#FFFCF6] p-6 text-center shadow-[0_5px_12px_rgba(75,57,40,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#B8E4E7] bg-[#DDF4F1] text-4xl transition group-hover:rotate-6 group-hover:scale-110">
                🎨
              </div>

              <span className="inline-block rounded-full bg-[#DDF4F1] px-3 py-1 text-xs font-extrabold tracking-wider text-[#328B98]">
                STEP 02
              </span>

              <h3 className="mb-2 mt-3 text-xl font-extrabold text-[#39304F]">
                Draw It
              </h3>

              <p className="text-sm leading-relaxed text-[#776B81]">
                Bring your word to life while everyone else tries to guess it.
              </p>
            </article>

            {/* Step 3 */}
            <article className="group rounded-2xl border border-[#F0DFC0] bg-[#FFFCF6] p-6 text-center shadow-[0_5px_12px_rgba(75,57,40,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#F1D99D] bg-[#FFF0C9] text-4xl transition group-hover:rotate-6 group-hover:scale-110">
                🏆
              </div>

              <span className="inline-block rounded-full bg-[#FFF0C9] px-3 py-1 text-xs font-extrabold tracking-wider text-[#A97519]">
                STEP 03
              </span>

              <h3 className="mb-2 mt-3 text-xl font-extrabold text-[#39304F]">
                Guess &amp; Win
              </h3>

              <p className="text-sm leading-relaxed text-[#776B81]">
                Type your guess in chat, earn points, and compete for the top spot!
              </p>
            </article>
          </div>

          <p className="mt-7 text-center text-sm font-semibold text-[#776B81]">
            🎮 Grab your friends and let the drawing battle begin!
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;

