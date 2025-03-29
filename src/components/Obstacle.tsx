
import React from 'react';

interface ObstacleProps {
  position: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ position }) => {
  // Tạo chiều cao ngẫu nhiên cho vật cản
  const height = Math.floor(Math.random() * 80) + 40;
  
  return (
    <div 
      className="obstacle absolute"
      style={{ 
        left: `${position}%`,
        bottom: '16px', // Căn theo mặt đất
        width: '30px',
        height: `${height}px`,
      }}
    >
      <div className="w-full h-full relative">
        {/* Cột vật cản */}
        <div className="w-full h-full bg-brown-600 rounded-t-lg relative flex flex-col items-center">
          <div className="w-full h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-t-lg relative">
            {/* Đường vân trên cột */}
            <div className="absolute top-1/4 w-full h-2 bg-amber-950 opacity-30"></div>
            <div className="absolute top-2/4 w-full h-2 bg-amber-950 opacity-30"></div>
            <div className="absolute top-3/4 w-full h-2 bg-amber-950 opacity-30"></div>
          </div>
          
          {/* Đầu vật cản */}
          <div className="absolute -top-8 w-10 h-8 bg-amber-800 rounded-t-lg overflow-hidden">
            <div className="w-full h-2 bg-amber-950 opacity-30 mt-2"></div>
            <div className="w-full h-2 bg-amber-950 opacity-30 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Obstacle;
