
import React from 'react';

interface DinosaurProps {
  position: number;
}

const Dinosaur: React.FC<DinosaurProps> = ({ position }) => {
  return (
    <div 
      id="dinosaur"
      className="absolute left-20"
      style={{ bottom: `${position}%` }}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <div className="relative">
          {/* Thân khủng long */}
          <div className="w-12 h-14 bg-green-700 rounded-t-lg relative">
            {/* Mắt */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full">
              <div className="absolute top-0 left-0 w-1 h-1 bg-black rounded-full"></div>
            </div>
            
            {/* Miệng */}
            <div className="absolute bottom-2 right-0 w-4 h-2 bg-green-800 rounded-r-lg"></div>
            
            {/* Cánh tay */}
            <div className="absolute top-4 right-10 w-4 h-1 bg-green-800 rounded"></div>
            
            {/* Chân */}
            <div className="absolute bottom-0 left-2 w-2 h-3 bg-green-800 rounded-b"></div>
            <div className="absolute bottom-0 left-7 w-2 h-3 bg-green-800 rounded-b"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dinosaur;
