import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 0, y: -1 }
const INITIAL_FOOD = { x: 15, y: 15 }

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    return newFood
  }, [])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(INITIAL_FOOD)
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      
      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, isPlaying, generateFood])

  const handleKeyPress = useCallback((e) => {
    if (!isPlaying) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev)
        break
      case 'ArrowDown':
        e.preventDefault()
        setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev)
        break
      case 'ArrowLeft':
        e.preventDefault()
        setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev)
        break
      case 'ArrowRight':
        e.preventDefault()
        setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev)
        break
    }
  }, [isPlaying])

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Link to="/" className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-4xl font-bold glow-text">Snake Game</h1>
        </div>
        <p className="text-white/70">
          You found the easter egg! Use arrow keys to control the snake.
        </p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-white/70 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          
          <div className="text-right">
            <p className="text-white/70 text-sm">Length</p>
            <p className="text-2xl font-bold text-white">{snake.length}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div 
            className="grid border-2 border-white/20 bg-black/30 rounded-lg mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: '400px',
              height: '400px'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE
              const y = Math.floor(index / GRID_SIZE)
              
              const isSnake = snake.some(segment => segment.x === x && segment.y === y)
              const isHead = snake[0]?.x === x && snake[0]?.y === y
              const isFood = food.x === x && food.y === y
              
              return (
                <div
                  key={index}
                  className={`border border-white/5 ${
                    isSnake
                      ? isHead
                        ? 'bg-green-400'
                        : 'bg-green-600'
                      : isFood
                      ? 'bg-red-500'
                      : 'bg-transparent'
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Game Controls */}
        <div className="space-y-4">
          {!isPlaying && !gameOver && (
            <button onClick={resetGame} className="btn-primary">
              Start Game
            </button>
          )}
          
          {gameOver && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-red-400 text-xl font-bold">Game Over!</p>
                <p className="text-white/70">Final Score: {score}</p>
              </div>
              <button onClick={resetGame} className="btn-primary">
                Play Again
              </button>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className="btn-secondary"
            >
              Pause
            </button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden">
          <p className="text-white/50 text-sm mb-4">Mobile Controls:</p>
          <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
            <div></div>
            <button
              onClick={() => setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev)}
              className="btn-secondary p-2"
              disabled={!isPlaying}
            >
              ↑
            </button>
            <div></div>
            
            <button
              onClick={() => setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev)}
              className="btn-secondary p-2"
              disabled={!isPlaying}
            >
              ←
            </button>
            <div></div>
            <button
              onClick={() => setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev)}
              className="btn-secondary p-2"
              disabled={!isPlaying}
            >
              →
            </button>
            
            <div></div>
            <button
              onClick={() => setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev)}
              className="btn-secondary p-2"
              disabled={!isPlaying}
            >
              ↓
            </button>
            <div></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-white/60 text-sm">
          🎮 Pro tip: The snake moves faster as you get longer! How high can you score?
        </p>
      </div>
    </div>
  )
}