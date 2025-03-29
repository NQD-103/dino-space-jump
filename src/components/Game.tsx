
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dinosaur from './Dinosaur';
import Obstacle from './Obstacle';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Space } from 'lucide-react';

interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
}

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    highScore: 0
  });
  const [dinosaurPosition, setDinosaurPosition] = useState(50);
  const [obstacles, setObstacles] = useState<{ id: number; position: number }[]>([]);
  const [gravity, setGravity] = useState(2);
  const [velocity, setVelocity] = useState(0);
  const [obstacleSpeed, setObstacleSpeed] = useState(4);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const obstacleIntervalRef = useRef<NodeJS.Timeout>();
  const scoreIntervalRef = useRef<NodeJS.Timeout>();
  const lastTimestampRef = useRef<number>(0);
  const { toast } = useToast();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    console.log("Bắt đầu trò chơi");
    setGameState({
      isPlaying: true,
      gameOver: false,
      score: 0,
      highScore: gameState.highScore
    });
    setDinosaurPosition(50);
    setVelocity(0);
    setObstacles([]);
    setObstacleSpeed(4);
    lastTimestampRef.current = 0;
    
    // Bắt đầu animation frame
    requestRef.current = requestAnimationFrame(updateGameArea);
    
    // Tạo vật cản mới
    obstacleIntervalRef.current = setInterval(() => {
      if (gameState.isPlaying && !gameState.gameOver) {
        setObstacles(prev => [...prev, { id: Date.now(), position: 100 }]);
      }
    }, 2000);
    
    // Tăng điểm
    scoreIntervalRef.current = setInterval(() => {
      if (gameState.isPlaying && !gameState.gameOver) {
        setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      }
    }, 100);
  };

  const endGame = () => {
    console.log("Kết thúc trò chơi");
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      return {
        ...prev,
        isPlaying: false,
        gameOver: true,
        highScore: newHighScore
      };
    });
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    if (obstacleIntervalRef.current) {
      clearInterval(obstacleIntervalRef.current);
    }
    
    if (scoreIntervalRef.current) {
      clearInterval(scoreIntervalRef.current);
    }
    
    toast({
      title: "Game Over!",
      description: `Your score: ${gameState.score}`,
      variant: "destructive"
    });
  };

  const updateGameArea = (timestamp: number) => {
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;
    
    // Cập nhật vị trí khủng long
    setDinosaurPosition(prev => {
      let newPosition = prev + velocity * (deltaTime / 16);
      
      if (newPosition < 0) newPosition = 0;
      if (newPosition > 80) newPosition = 80;
      
      return newPosition;
    });
    
    // Cập nhật vận tốc (trọng lực)
    setVelocity(prev => {
      let newVelocity = prev + gravity * (deltaTime / 16) * 0.1;
      return newVelocity;
    });
    
    // Di chuyển vật cản
    setObstacles(prev => {
      return prev
        .map(obstacle => ({
          ...obstacle,
          position: obstacle.position - obstacleSpeed * (deltaTime / 16)
        }))
        .filter(obstacle => obstacle.position > -10);
    });
    
    // Kiểm tra va chạm
    const dinosaurElement = document.getElementById('dinosaur');
    const dinosaurRect = dinosaurElement?.getBoundingClientRect();
    
    if (dinosaurRect) {
      const obstacleElements = document.querySelectorAll('.obstacle');
      
      obstacleElements.forEach(obstacleElement => {
        const obstacleRect = obstacleElement.getBoundingClientRect();
        
        if (
          dinosaurRect.right > obstacleRect.left + 15 &&
          dinosaurRect.left < obstacleRect.right - 15 &&
          dinosaurRect.bottom > obstacleRect.top + 15 &&
          dinosaurRect.top < obstacleRect.bottom - 15
        ) {
          endGame();
        }
      });
    }
    
    // Tiếp tục vòng lặp game
    if (gameState.isPlaying && !gameState.gameOver) {
      requestRef.current = requestAnimationFrame(updateGameArea);
    }
  };

  const jump = useCallback(() => {
    console.log("Nhảy! Trạng thái game:", gameState.isPlaying, gameState.gameOver);
    if (gameState.isPlaying && !gameState.gameOver) {
      setVelocity(-5);
    } else if (!gameState.isPlaying) {
      startGame();
    } else if (gameState.gameOver) {
      startGame();
    }
  }, [gameState.isPlaying, gameState.gameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log("Phím được nhấn:", e.code);
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  }, [jump]);

  // Gắn sự kiện bàn phím khi component được tạo
  useEffect(() => {
    console.log("Thêm sự kiện bàn phím");
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus vào game container ngay khi component được tạo
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    
    return () => {
      console.log("Gỡ bỏ sự kiện bàn phím");
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Dọn dẹp khi component bị hủy
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      if (obstacleIntervalRef.current) {
        clearInterval(obstacleIntervalRef.current);
      }
      
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
    };
  }, []);

  // Tăng tốc độ game theo điểm số
  useEffect(() => {
    if (gameState.score > 0 && gameState.score % 50 === 0) {
      setObstacleSpeed(prev => Math.min(prev + 0.5, 12));
    }
  }, [gameState.score]);

  return (
    <div 
      ref={gameContainerRef}
      tabIndex={0}
      className="flex flex-col items-center justify-center min-h-screen bg-blue-50 outline-none"
      onKeyDown={(e) => {
        console.log("Sự kiện onKeyDown trên container:", e.code);
        if (e.code === 'Space') {
          e.preventDefault();
          jump();
        }
      }}
    >
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Dino Space Jump</h1>
        <div className="flex gap-4 justify-center">
          <div className="bg-secondary text-white px-4 py-2 rounded-lg">
            Score: {gameState.score}
          </div>
          <div className="bg-accent text-white px-4 py-2 rounded-lg">
            High Score: {gameState.highScore}
          </div>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="game-area w-[800px] h-[400px] border-4 border-primary rounded-lg relative bg-sky-200"
        onClick={() => {
          // Focus vào container và khởi động game khi click vào game area
          gameContainerRef.current?.focus();
          if (!gameState.isPlaying || gameState.gameOver) {
            startGame();
          }
        }}
      >
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white z-10">
            <h2 className="text-3xl font-bold mb-6">Press Space to Start</h2>
            <div className="flex items-center">
              <Space className="w-10 h-10 mr-2" />
              <span className="text-xl">Press Space to Jump</span>
            </div>
          </div>
        )}
        
        {gameState.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white z-10">
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <p className="text-xl mb-6">Score: {gameState.score}</p>
            <Button 
              variant="default" 
              size="lg" 
              onClick={startGame}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80"
            >
              Play Again
            </Button>
          </div>
        )}
        
        <Dinosaur position={dinosaurPosition} />
        
        {obstacles.map(obstacle => (
          <Obstacle key={obstacle.id} position={obstacle.position} />
        ))}
        
        <div className="absolute bottom-0 w-full h-16 bg-amber-800"></div>
        
        <button 
          onClick={jump}
          className="absolute bottom-20 right-6 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white md:hidden"
        >
          <Space className="w-8 h-8" />
        </button>
      </div>
      
      <div className="mt-6 text-center text-gray-600">
        <p className="mb-2">Press Space to control the dinosaur</p>
        <Button 
          variant="default" 
          onClick={jump}
          className="bg-primary text-white"
        >
          <Space className="mr-2 h-4 w-4" /> Jump
        </Button>
      </div>
    </div>
  );
};

export default Game;
