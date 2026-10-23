import React from 'react';
import ColorPicker from './ColorPicker';
import { Undo2, Trash2, Eraser } from 'lucide-react';
import { ERASER_COLOR, ERASER_BRUSH_SIZE, MIN_BRUSH_SIZE, MAX_BRUSH_SIZE } from '../utils/constants';

interface ToolbarProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ color, setColor, brushSize, setBrushSize, onUndo, onClear }) => {
  return (
    <div className="flex flex-col items-stretch gap-3 p-3 bg-gray-50 rounded-lg shadow-inner w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <ColorPicker color={color} setColor={setColor} />
        
        <div className="flex flex-col ml-2 sm:ml-4">
          <label className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Brush ({brushSize}px)</label>
          <input 
            type="range" 
            min={MIN_BRUSH_SIZE}
            max={MAX_BRUSH_SIZE} 
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 sm:w-32 accent-indigo-600"
          />
        </div>
      </div>

     <div className="flex flex-wrap items-center gap-2 w-full justify-start">
  <button
    type="button"
    onClick={() => {
      setColor(ERASER_COLOR);
      setBrushSize(ERASER_BRUSH_SIZE);
    }}
    className={`flex shrink-0 items-center gap-1 px-3 py-2 border rounded shadow-sm font-medium text-sm ${
      color === ERASER_COLOR
        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
        : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
    }`}
    title="Eraser"
  >
    <Eraser size={18} />
    <span>Eraser</span>
  </button>

  <button
    type="button"
    onClick={onUndo}
    className="flex shrink-0 items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 shadow-sm text-gray-700 font-medium text-sm"
    title="Undo"
  >
    <Undo2 size={18} />
    <span>Undo</span>
  </button>

  <button
    type="button"
    onClick={onClear}
    className="flex shrink-0 items-center gap-1 px-3 py-2 bg-red-50 border border-red-200 rounded hover:bg-red-100 shadow-sm text-red-600 font-medium text-sm"
    title="Clear Canvas"
  >
    <Trash2 size={18} />
    <span>Clear</span>
  </button>
</div>
    </div>
  );
};

export default Toolbar;
