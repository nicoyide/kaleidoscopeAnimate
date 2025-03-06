import React, { useEffect, useRef, useState } from 'react';
import { Sliders } from 'lucide-react';

interface Shape {
  type: 'triangle' | 'square' | 'circle';
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  speed: number;
}

interface Controls {
  moveSpeed: number;
  rotationSpeed: number;
  branches: number;
  shapesPerSecond: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Shape[]>([]);
  const animationFrameId = useRef<number>();
  const [showControls, setShowControls] = useState(false);
  const [controls, setControls] = useState<Controls>({
    moveSpeed: 2,
    rotationSpeed: 0.02,
    branches: 16,
    shapesPerSecond: 0.1
  });

  const getRandomColor = () => {
    const hue = Math.random() * 360;
    const saturation = 80 + Math.random() * 20; // Increased saturation
    const lightness = 60 + Math.random() * 20; // Increased brightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getRandomShape = (): Shape => {
    const types: Shape['type'][] = ['triangle', 'square', 'circle'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50; // Start shapes at random distances from center
    
    return {
      type: types[Math.floor(Math.random() * types.length)],
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      size: 15 + Math.random() * 25, // Increased size range
      rotation: Math.random() * Math.PI * 2,
      color: getRandomColor(),
      speed: controls.moveSpeed * (0.8 + Math.random() * 0.4) // Base speed modified by random factor
    };
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    ctx.fillStyle = shape.color;
    ctx.beginPath();

    switch (shape.type) {
      case 'triangle':
        ctx.moveTo(0, -shape.size);
        ctx.lineTo(shape.size, shape.size);
        ctx.lineTo(-shape.size, shape.size);
        break;
      case 'square':
        ctx.rect(-shape.size/2, -shape.size/2, shape.size, shape.size);
        break;
      case 'circle':
        ctx.arc(0, 0, shape.size/2, 0, Math.PI * 2);
        break;
    }

    ctx.fill();
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    // Add new shapes periodically
    if (Math.random() < controls.shapesPerSecond) {
      const newShape = getRandomShape();
      shapes.current.push(newShape);
    }

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw shapes
    shapes.current = shapes.current.filter(shape => {
      const distance = Math.sqrt(
        Math.pow(shape.x - canvas.width/2, 2) + 
        Math.pow(shape.y - canvas.height/2, 2)
      );

      if (distance > Math.max(canvas.width, canvas.height) * 0.8) {
        return false;
      }

      // Move shapes outward
      const angle = Math.atan2(shape.y - canvas.height/2, shape.x - canvas.width/2);
      shape.x += Math.cos(angle) * shape.speed;
      shape.y += Math.sin(angle) * shape.speed;
      shape.rotation += controls.rotationSpeed;

      // Draw multiple copies for kaleidoscope effect
      for (let i = 0; i < controls.branches; i++) {
        const rotationAngle = (Math.PI * 2 * i) / controls.branches;
        const mirroredShape = { ...shape };
        const rotatedX = (shape.x - canvas.width/2) * Math.cos(rotationAngle) - 
                        (shape.y - canvas.height/2) * Math.sin(rotationAngle) + canvas.width/2;
        const rotatedY = (shape.x - canvas.width/2) * Math.sin(rotationAngle) + 
                        (shape.y - canvas.height/2) * Math.cos(rotationAngle) + canvas.height/2;
        
        mirroredShape.x = rotatedX;
        mirroredShape.y = rotatedY;
        mirroredShape.rotation = shape.rotation + rotationAngle;
        
        drawShape(ctx, mirroredShape);

        // Draw reflected copies to fill more space
        const reflectedShape = { ...mirroredShape };
        reflectedShape.x = canvas.width/2 - (rotatedX - canvas.width/2);
        reflectedShape.y = rotatedY;
        drawShape(ctx, reflectedShape);
      }

      return true;
    });

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      <button 
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <Sliders className="w-6 h-6" />
      </button>

      {showControls && (
        <div className="fixed top-16 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-4">Controls</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Movement Speed</label>
              <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1"
                value={controls.moveSpeed}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  moveSpeed: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Rotation Speed</label>
              <input 
                type="range" 
                min="0" 
                max="0.1" 
                step="0.001"
                value={controls.rotationSpeed}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  rotationSpeed: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Branches ({controls.branches})</label>
              <input 
                type="range" 
                min="8" 
                max="32" 
                step="2"
                value={controls.branches}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  branches: parseInt(e.target.value)
                }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Shape Frequency</label>
              <input 
                type="range" 
                min="0.02" 
                max="0.2" 
                step="0.02"
                value={controls.shapesPerSecond}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  shapesPerSecond: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;