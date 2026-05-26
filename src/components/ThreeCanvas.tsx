import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnimationSettings } from '../types';

interface ThreeCanvasProps {
  imageSrc: string;
  settings: AnimationSettings;
  isRecording: boolean;
  onRecordingFrame?: (frame: number, total: number) => void;
  onRecordingComplete?: (videoBlob: Blob) => void;
  onRecordingError?: (err: Error) => void;
}

export default function ThreeCanvas({
  imageSrc,
  settings,
  isRecording,
  onRecordingFrame,
  onRecordingComplete,
  onRecordingError,
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for animation state
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const glowLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);

  // Animation ticks
  const animationFrameId = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const curTimeRef = useRef<number>(0);

  // Size trackers
  const [aspect, setAspect] = useState(1);

  // We load clean textures by combining browser framing
  const createFramedTexture = (imgSrc: string, browserTheme: 'dark' | 'light' | 'none'): Promise<{ texture: THREE.Texture, ratio: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const textureCanvas = document.createElement('canvas');
        const hasFrame = browserTheme !== 'none';
        const frameHeight = hasFrame ? 50 : 0;
        
        textureCanvas.width = img.width;
        // Keep website height and append browser chrome height proportionally
        const scaleFactor = img.width / 1200;
        const scaledFrameHeight = Math.round(frameHeight * scaleFactor);
        
        textureCanvas.height = img.height + scaledFrameHeight;
        
        const ctx = textureCanvas.getContext('2d');
        if (ctx) {
          // Fill background
          ctx.fillStyle = browserTheme === 'dark' ? '#18181b' : '#f4f4f5';
          ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
          
          if (hasFrame) {
            // Write traffic light buttons
            const radius = 6 * scaleFactor;
            const y = scaledFrameHeight / 2;
            
            // Red
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(20 * scaleFactor, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Yellow
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.arc(40 * scaleFactor, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Green
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(60 * scaleFactor, y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Mock Address bar
            ctx.fillStyle = browserTheme === 'dark' ? '#27272a' : '#e4e4e7';
            const barW = 500 * scaleFactor;
            const barH = 26 * scaleFactor;
            const barX = (textureCanvas.width - barW) / 2;
            const barY = (scaledFrameHeight - barH) / 2;
            
            ctx.beginPath();
            ctx.roundRect(barX, barY, barW, barH, 6 * scaleFactor);
            ctx.fill();
            
            // Address text
            ctx.fillStyle = browserTheme === 'dark' ? '#71717a' : '#a1a1aa';
            ctx.font = `${Math.round(11 * scaleFactor)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('meusite3d.com', textureCanvas.width / 2, barY + barH / 2 + 4 * scaleFactor);
            ctx.textAlign = 'left';
          }
          
          // Draw website screenshot
          ctx.drawImage(img, 0, scaledFrameHeight);
        }

        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        resolve({
          texture,
          ratio: textureCanvas.width / textureCanvas.height
        });
      };
      
      img.onerror = () => {
        // Fallback texture
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 512;
        fallbackCanvas.height = 1024;
        const ctx = fallbackCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(0, 0, 512, 1024);
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px sans-serif';
          ctx.fillText('Erro ao carregar imagem', 50, 200);
        }
        resolve({
          texture: new THREE.CanvasTexture(fallbackCanvas),
          ratio: 0.5
        });
      };
      
      img.src = imgSrc;
    });
  };

  // 1. Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;
    setAspect(width / height);

    // Initial Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // Crucial for Canvas Recording
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Group for containing the screen meshes
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Glow highlight point light (simulating dynamic screen lighting glow)
    const glowLight = new THREE.PointLight(0xffffff, 3, 15);
    glowLight.position.set(0, 0, -1.5);
    scene.add(glowLight);
    glowLightRef.current = glowLight;

    // Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x6366f1, 0x1e1b4b);
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // Shadow catcher plane inside scene
    const shadowGeo = new THREE.PlaneGeometry(100, 100);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -4.49;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Clock
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Clean up
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
    };
  }, []);

  // 2. Load Screen Design Texture and Create Mesh
  useEffect(() => {
    let active = true;
    if (!sceneRef.current || !mainGroupRef.current) return;

    // Clear previous website plane from the mainGroup
    while (mainGroupRef.current.children.length > 0) {
      const obj = mainGroupRef.current.children[0];
      mainGroupRef.current.remove(obj);
    }

    createFramedTexture(imageSrc, settings.browserTheme).then(({ texture, ratio }) => {
      if (!active || !sceneRef.current || !mainGroupRef.current) return;

      // Calculate width and height of the 3D planes proportional to the screenshot
      // Standard target size width
      const targetW = 5 * settings.deviceScale;
      const targetH = targetW / ratio;

      // Plane with dense segments for beautiful curvilinear bending
      const segmentsX = 1;
      const segmentsY = 64; // High y-segments allows high fidelity curved screen
      const geometry = new THREE.PlaneGeometry(targetW, targetH, segmentsX, segmentsY);

      // Perform Cylinder Curve bend
      const posAttr = geometry.attributes.position;
      const bendFactor = settings.curveAmount * 0.4;
      if (bendFactor !== 0) {
        for (let i = 0; i < posAttr.count; i++) {
          const y = posAttr.getY(i);
          // Bend the top and bottom back mathematically
          const relY = y / (targetH / 2); // -1 to +1
          const zValue = Math.cos(relY * Math.PI / 2) * bendFactor - bendFactor;
          posAttr.setZ(i, zValue);
        }
        geometry.computeVertexNormals();
      }

      // Material
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.18,
        metalness: 0.1,
      });

      const planeMesh = new THREE.Mesh(geometry, material);
      planeMesh.castShadow = true;
      planeMesh.receiveShadow = true;
      mainGroupRef.current.add(planeMesh);
      planeRef.current = planeMesh;

      // Adjust camera distance based on website plane height
      if (cameraRef.current) {
        const fitD = Math.max(targetH * 0.9, 8);
        cameraRef.current.position.set(0, 0, fitD);
        cameraRef.current.lookAt(0, 0, 0);
      }
    });

    return () => {
      active = false;
    };
  }, [imageSrc, settings.browserTheme, settings.deviceScale, settings.curveAmount]);

  // 3. Dynamic Controls Configuration
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = settings.showGrid;
      // Re-colorize grid lines dynamically
      const customCol = new THREE.Color(settings.gridColor || '#312e81');
      gridRef.current.material.color = customCol;
    }

    if (glowLightRef.current) {
      glowLightRef.current.color.set(settings.glowColor);
      glowLightRef.current.intensity = settings.glowIntensity * 5;
    }
  }, [settings.showGrid, settings.gridColor, settings.glowColor, settings.glowIntensity]);

  // 4. Recording and Frame Timing Loop
  const recStateRef = useRef({
    isRecording: false,
    frame: 0,
    totalFrames: 0,
    mediaRecorder: null as MediaRecorder | null,
    chunks: [] as Blob[],
  });

  useEffect(() => {
    recStateRef.current.isRecording = isRecording;
    if (isRecording) {
      const fps = 30;
      const totalFrames = fps * settings.duration;
      recStateRef.current.frame = 0;
      recStateRef.current.totalFrames = totalFrames;
      recStateRef.current.chunks = [];

      try {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas element not available");

        const stream = canvas.captureStream(fps);
        const options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 5000000 // 5 Mbps for pristine 3D texture rendering
        };
        
        // Fallback for Safari or older browsers that don't support VP9
        let mediaRecorder: MediaRecorder;
        try {
          mediaRecorder = new MediaRecorder(stream, options);
        } catch {
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        }

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recStateRef.current.chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(recStateRef.current.chunks, { type: 'video/webm' });
          if (onRecordingComplete) onRecordingComplete(videoBlob);
        };

        recStateRef.current.mediaRecorder = mediaRecorder;
        mediaRecorder.start();
      } catch (err: any) {
        if (onRecordingError) onRecordingError(err);
      }
    } else {
      // If turned off, stop mediaRecorder
      const mr = recStateRef.current.mediaRecorder;
      if (mr && mr.state !== 'inactive') {
        mr.stop();
      }
    }
  }, [isRecording, settings.duration]);

  // 5. Main Animation Rendering Engine
  useEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;
    
    // Reset timer
    clock.getDelta(); // clear initial tick

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const plane = planeRef.current;
      const mainGroup = mainGroupRef.current;

      if (!scene || !camera || !renderer || !plane || !mainGroup) return;

      // Handle custom sizes
      let width = containerRef.current?.clientWidth || 600;
      let height = containerRef.current?.clientHeight || 450;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Determine Time: Deterministic for render recording, real-time for interactive preview
      let time = 0;
      if (recStateRef.current.isRecording) {
        const currentFrame = recStateRef.current.frame;
        const total = recStateRef.current.totalFrames;
        
        // Match speed multiplier
        const simulatedTime = (currentFrame / total) * settings.duration;
        time = simulatedTime;

        if (onRecordingFrame) {
          onRecordingFrame(currentFrame, total);
        }

        recStateRef.current.frame++;
        
        // Stop recording if reached limit
        if (currentFrame >= total) {
          recStateRef.current.isRecording = false;
          if (recStateRef.current.mediaRecorder && recStateRef.current.mediaRecorder.state !== 'inactive') {
            recStateRef.current.mediaRecorder.stop();
          }
        }
      } else {
        time = clock.getElapsedTime();
      }

      curTimeRef.current = time;

      // Adjust camera and plane rotations depending on selected Cinematic Preset
      const speedMult = settings.animationSpeed;
      const baseDistance = settings.cameraDistance;
      const targetHeight = plane.geometry.parameters.height || 10;

      // Reset transforms
      mainGroup.rotation.set(0, 0, 0);
      mainGroup.position.set(0, 0, 0);
      camera.position.set(0, 0, baseDistance);
      camera.lookAt(0, 0, 0);

      const computedPitch = settings.cameraPitch * Math.PI / 180;
      const computedRoll = settings.cameraRoll * Math.PI / 180;

      switch (settings.preset) {
        case 'scroll': {
          // Smooth glide from top scroll layout to bottom scroll layout in 3D perspective
          // Calculate scrolling progress ratio
          const progress = (time * speedMult) % settings.duration;
          const pct = Math.min(progress / settings.duration, 1.0);
          
          // Position target goes from top of page towards bottom
          const startTargetY = targetHeight / 2 - 2;
          const endTargetY = -targetHeight / 2 + 2;
          const currentTargetY = startTargetY + (endTargetY - startTargetY) * pct;

          // Camera locks in an oblique physical pitch
          const lookAtTarget = new THREE.Vector3(0, currentTargetY, 0);
          
          // Place camera pointing down beautifully
          const angleRad = -35 * Math.PI / 180;
          camera.position.set(2, currentTargetY + baseDistance * Math.sin(-angleRad), baseDistance * Math.cos(-angleRad));
          camera.lookAt(lookAtTarget);
          
          // Introduce a gentle lateral rotate
          mainGroup.rotation.y = 0.2 + (Math.sin(time * 0.5) * 0.05);
          break;
        }

        case 'orbit': {
          // Rotate orbit circles around center of screenshot
          const orbitAngle = time * 0.3 * speedMult;
          const radius = baseDistance;
          
          camera.position.set(
            Math.sin(orbitAngle) * radius,
            Math.sin(time * 0.5) * (radius * 0.2) + 1,
            Math.cos(orbitAngle) * radius
          );
          
          // Focus at center
          camera.lookAt(0, 0, 0);
          break;
        }

        case 'zoom': {
          // Slow cinematic crop in towards dashboard or grid details with a sweeping pan
          const progress = (time * speedMult) % settings.duration;
          const progressRatio = Math.sin((progress / settings.duration) * Math.PI / 2); // easing
          
          const maxZoom = 0.5;
          const curZoom = baseDistance - (baseDistance * maxZoom * progressRatio);
          
          // Oblique camera
          camera.position.set(1.5, 1, curZoom);
          camera.lookAt(0, -targetHeight * 0.1 * progressRatio, 0);
          
          // Rotate screen mesh isometrical
          mainGroup.rotation.y = computedPitch + 0.1;
          mainGroup.rotation.x = 0.1;
          break;
        }

        case 'wobble': {
          // Perfect isometric float/rotate, oscillating nicely in 3D outer space
          const floatOffset = Math.sin(time * 1.5) * 0.2;
          mainGroup.position.y = floatOffset;
          
          // Tilt oscillations
          mainGroup.rotation.y = computedPitch + Math.sin(time * speedMult * 0.8) * 0.12;
          mainGroup.rotation.x = Math.cos(time * speedMult * 0.5) * 0.06;
          mainGroup.rotation.z = Math.sin(time * speedMult * 0.4) * 0.04;
          
          // Static camera angle but high gloss
          camera.position.set(0, 0.5, baseDistance);
          camera.lookAt(0, 0, 0);
          break;
        }

        case 'reveal': {
          // Starts tightly packed inside landing page hero copy, sweeps out beautifully into full view
          const progress = (time * speedMult) % settings.duration;
          const revealPct = progress / settings.duration;
          
          // High-ease out curve
          const revealEase = 1.0 - Math.pow(1.0 - revealPct, 3);
          
          const startDist = baseDistance * 0.35;
          const currentDistance = startDist + (baseDistance - startDist) * revealEase;
          
          // Look values glide from top-left offset to center
          const startLook = new THREE.Vector3(-1.5, targetHeight * 0.35, 0);
          const endLook = new THREE.Vector3(0, 0, 0);
          const currentLook = startLook.clone().lerp(endLook, revealEase);
          
          camera.position.set(0, 0.5, currentDistance);
          camera.lookAt(currentLook);

          // Mesh glides from flat to tilted
          mainGroup.rotation.y = (0.5 * revealEase);
          mainGroup.rotation.x = (0.2 * revealEase);
          break;
        }

        case 'manual': {
          // Precise user customizable angles from settings panel
          camera.position.set(0, 0, baseDistance);
          camera.lookAt(0, 0, 0);
          
          mainGroup.rotation.y = computedPitch;
          mainGroup.rotation.z = computedRoll;
          mainGroup.rotation.x = 0.1; // modest incline for isometric depth
          break;
        }
      }

      // Draw active frames onto the screen
      renderer.render(scene, camera);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [settings, isRecording]);

  // Combine background colors into inline gradient CSS for visual consistency behind WebGL
  const gradientStyle = {
    background: `linear-gradient(135deg, ${settings.bgGradientStart} 0%, ${settings.bgGradientEnd} 100%)`
  };

  // Determine width-caps based on aspect ratio chosen by user
  let aspectClass = 'w-full h-full';
  if (settings.ratio === '9:16') {
    aspectClass = 'aspect-[9/16] h-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
  } else if (settings.ratio === '1:1') {
    aspectClass = 'aspect-[1/1] h-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
  }

  return (
    <div 
      className="flex items-center justify-center w-full h-full p-4 overflow-hidden rounded-2xl relative"
      style={gradientStyle}
    >
      {/* 3D Render Frame Area */}
      <div 
        ref={containerRef}
        className={`relative ${aspectClass} transition-all duration-300`}
        id="canvas-3d-wrapper"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block" 
          id="render-canvas"
        />

        {/* Burned Typography Overlays (Drawn styled above Canvas inside preview) */}
        {(settings.textOverlay || settings.textSubtitle) && (
          <div className="absolute inset-x-4 bottom-6 text-center select-none pointer-events-none transition-all">
            <div 
              className="font-sans text-md font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              style={{ color: settings.textColor }}
            >
              {settings.textOverlay}
            </div>
            <div className="font-sans text-xs mt-1 text-slate-300 font-medium drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.85)] max-w-[85%] mx-auto text-center truncate">
              {settings.textSubtitle}
            </div>
          </div>
        )}

        {/* Dynamic Watermark Accent to look like a cinematic reel output */}
        <div className="absolute top-4 right-4 pointer-events-none text-[9px] font-mono tracking-widest text-white/30 truncate bg-black/40 px-2 py-0.5 rounded backdrop-blur">
          3D PERSPECTIVE RENDERING
        </div>
      </div>
    </div>
  );
}
