import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Play, 
  Smartphone, 
  Monitor, 
  Tv, 
  Download, 
  FileText, 
  Palette, 
  Sliders, 
  RotateCw, 
  Check, 
  Grid, 
  Eye, 
  Loader2, 
  HelpCircle,
  Film,
  Camera,
  RefreshCw,
  Info
} from 'lucide-react';
import { getPlaceholderWebsiteImage } from './utils/placeholderImage';
import ThreeCanvas from './components/ThreeCanvas';
import { AnimationSettings, PresetName, VideoRatio, BrowserTheme, AIAnalysis } from './types';

export default function App() {
  // 1. App State & Resource Loader
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  
  // Custom alerts or tooltips helper
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Active control menu configuration tab
  const [activeTab, setActiveTab] = useState<'move' | 'design' | 'text'>('move');

  // Video recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Default initial configuration settings
  const [settings, setSettings] = useState<AnimationSettings>({
    preset: 'wobble',
    duration: 12,
    ratio: '9:16', // Default to beautiful mobile vertical Reels size
    browserTheme: 'dark',
    bgGradientStart: '#0d0d15',
    bgGradientEnd: '#1e1039',
    showGrid: true,
    gridColor: '#4f46e5',
    glowColor: '#ef4444',
    glowIntensity: 1.5,
    cameraDistance: 10,
    cameraPitch: 45, // isometrical tilt degree
    cameraRoll: 15,
    animationSpeed: 1.0,
    textOverlay: '🚀 LANDING PAGE LIVE!',
    textSubtitle: 'meusite3d.com • Toque para explorar',
    textColor: '#ffffff',
    deviceScale: 1.15,
    curveAmount: 0.8
  });

  // Pre-load default template on mount
  useEffect(() => {
    const defaultImg = getPlaceholderWebsiteImage();
    setImageSrc(defaultImg);
    showNotice('Modelo de website "Aura SaaS" carregado por padrão. Faça upload de sua própria imagem para personalizar!', 'info');
  }, []);

  const showNotice = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(prev => prev?.text === text ? null : prev);
    }, 6000);
  };

  // 2. Drag and Drop + File Upload Handlers
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.match(/image.*/)) {
      showNotice('Tipo de arquivo inválido. Favor carregar uma imagem PNG ou JPG.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageSrc(event.target.result);
        showNotice('Imagem de website carregada com sucesso! Ajuste o movimento abaixo.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Reset parameters to pristine default values
  const handleResetSettings = () => {
    setSettings({
      preset: 'wobble',
      duration: 12,
      ratio: '9:16',
      browserTheme: 'dark',
      bgGradientStart: '#0d0d15',
      bgGradientEnd: '#1e1039',
      showGrid: true,
      gridColor: '#4f46e5',
      glowColor: '#ef4444',
      glowIntensity: 1.5,
      cameraDistance: 10,
      cameraPitch: 45,
      cameraRoll: 15,
      animationSpeed: 1.0,
      textOverlay: '🚀 LANDING PAGE LIVE!',
      textSubtitle: 'meusite3d.com • Toque para explorar',
      textColor: '#ffffff',
      deviceScale: 1.15,
      curveAmount: 0.8
    });
    setAiResult(null);
    showNotice('Configurações redefinidas ao padrão.', 'info');
  };

  // 3. AI Direct Integration via Server call
  const handleAskGeminiForDesignSuggestions = async () => {
    if (!imageSrc) return;
    setIsAiAnalyzing(true);
    setNotification(null);

    try {
      const response = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageSrc,
          mimeType: 'image/png'
        })
      });

      if (!response.ok) {
        throw new Error('Falha no processador de IA do servidor.');
      }

      const data: AIAnalysis = await response.json();
      
      // Update settings using AI suggestions
      setSettings(prev => ({
        ...prev,
        preset: data.recommendedPreset || 'wobble',
        bgGradientStart: data.bgStart || '#0a0a0f',
        bgGradientEnd: data.bgEnd || '#16122d',
        glowColor: data.glow || '#a78bfa',
        textOverlay: data.tagline ? data.tagline.toUpperCase() : prev.textOverlay,
        textSubtitle: data.subtitle || prev.textSubtitle,
        showGrid: true,
        glowIntensity: 1.8
      }));

      setAiResult(data);
      showNotice('⚡ O Gemini recomendou a estética perfeita para o seu site! Presets e cores atualizados.', 'success');
    } catch (err: any) {
      console.error(err);
      showNotice('Análise concluída em modo local básico (pode cadastrar sua GEMINI_API_KEY para análises personalizadas!).', 'info');
      // Set interesting default design suggestion so output is beautiful
      setSettings(prev => ({
        ...prev,
        preset: 'orbit',
        bgGradientStart: '#080d24',
        bgGradientEnd: '#1e0f3c',
        glowColor: '#ec4899',
        textOverlay: 'PORTFÓLIO PREMIUM',
        textSubtitle: 'Design responsivo e interações fluidas'
      }));
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // 4. Recording Lifecycle listeners
  const handleStartVidRecording = () => {
    if (isRecording) return;
    
    // Cleanup previous URL to free up browser memory leaks
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }

    setRecordingProgress({ current: 0, total: 0, percent: 0 });
    setIsRecording(true);
    showNotice('Iniciando gravação determinística de quadros em 60 FPS. Mantenha a aba aberta...', 'info');
  };

  const handleFrameRecordedCallback = (frame: number, total: number) => {
    const pct = Math.round((frame / total) * 100);
    setRecordingProgress({ current: frame, total, percent: pct });
  };

  const handleRecordingCompleteCallback = (blob: Blob) => {
    const videoUrl = URL.createObjectURL(blob);
    setRecordedVideoUrl(videoUrl);
    setIsRecording(false);
    setShowVideoModal(true);
    showNotice('✨ Vídeo renderizado em 3D e gravado com sucesso!', 'success');
  };

  const handleRecordingErrorCallback = (err: Error) => {
    console.error('Recording failed:', err);
    setIsRecording(false);
    showNotice(`Erro na gravação do vídeo: ${err.message}`, 'error');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40" id="header-bar">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Aura 3D Web Animator
            </h1>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              Conversor de Website para Vídeo Isométrico
            </p>
          </div>
        </div>

        {/* Global actions and helper statuses */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetSettings}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition flex items-center gap-2 cursor-pointer"
            title="Excluir customizações e resetar"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redefinir</span>
          </button>
          
          <button
            onClick={handleAskGeminiForDesignSuggestions}
            disabled={isAiAnalyzing || isRecording}
            className="px-4 py-1.5 text-xs font-bold leading-normal text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition flex items-center gap-2 cursor-pointer border border-indigo-400/20"
          >
            {isAiAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analisando Site...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>Otimizar com Gemini IA</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* NOTIFICATION HUD BANNER */}
      {notification && (
        <div className="bg-indigo-950/90 border-b border-indigo-500/20 px-6 py-2.5 flex items-center gap-3 animate-fade-in z-30 relative justify-between text-xs font-medium text-indigo-200">
          <div className="flex items-center gap-2 max-w-[90%] truncate">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{notification.text}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-indigo-400 hover:text-indigo-200 cursor-pointer font-bold px-2 py-0.5 rounded"
          >
            OK
          </button>
        </div>
      )}

      {/* DETAILED LAYOUT: TWO RECOLLECTIVE PANELS */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden" id="workspace-container">
        
        {/* PANEL LEFT: SIDEBAR CONTROLLER (lg:col-span-5) */}
        <section className="lg:col-span-4 border-r border-white/5 flex flex-col h-[calc(100vh-73px)] overflow-hidden bg-slate-950/40" id="sidebar-controls">
          
          {/* Quick upload & image status header */}
          <div className="p-5 border-b border-white/5" id="screenshot-upload-container">
            <label className="text-[11px] font-mono tracking-widest text-slate-500 block uppercase mb-3">
              1. Captura do seu Website
            </label>

            {/* Standard Drag and Drop + Clicking Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 bg-white/[0.01] hover:bg-white/[0.02] p-4 rounded-xl text-center cursor-pointer transition relative group overflow-hidden"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageUploadFile}
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] group-hover:bg-indigo-500/10 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/20 transition-all duration-300">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Solte a imagem completa</span> ou <span className="text-indigo-400 font-semibold group-hover:underline">clique para enviar</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Qualquer tamanho compatível (PNG, JPG, JPEG)
                </p>
              </div>
            </div>

            {/* Default mock templates or custom toggle */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Site Ativo: <span className="text-slate-200">Aura SaaS Mockup</span>
              </span>
              <button 
                onClick={() => {
                  setImageSrc(getPlaceholderWebsiteImage());
                  setAiResult(null);
                  showNotice('Modelo Aura SaaS recarregado com sucesso.', 'info');
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline font-mono"
              >
                Resetar Modelo
              </button>
            </div>
          </div>

          {/* INTERNAL MENU TABS */}
          <div className="flex border-b border-white/5 text-xs font-semibold bg-slate-950/20 shrink-0 select-none">
            <button
              onClick={() => setActiveTab('move')}
              className={`flex-1 py-3 text-center transition flex justify-center items-center gap-2 ${
                activeTab === 'move' 
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/[0.02]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Movimentos</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-3 text-center transition flex justify-center items-center gap-2 ${
                activeTab === 'design' 
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/[0.02]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cenário & Design</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-center transition flex justify-center items-center gap-2 ${
                activeTab === 'text' 
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/[0.02]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Textos / Títulos</span>
            </button>
          </div>

          {/* ACTIVE TAB SETTINGS SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none" id="sidebar-tab-content">
            
            {/* TAB: MOVEMENTS (PRESETS & CAMERAS) */}
            {activeTab === 'move' && (
              <div className="space-y-5">
                
                {/* PRESET CHIPS */}
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase mb-2">
                    Predefinições Cinematográficas 3D
                  </label>
                  <div className="grid grid-cols-2 gap-2" id="cinematic-preset-grid">
                    {[
                      { id: 'scroll', name: 'Rolagem Contínua', desc: 'Deslize linear obliquo do topo ao fim do site' },
                      { id: 'orbit', name: 'Órbita Orbital', desc: 'Câmera gira horizontalmente em 3D sutil' },
                      { id: 'zoom', name: 'Zoom Hero', desc: 'Aproximação constante ideal para focar detalhes' },
                      { id: 'wobble', name: 'Flutuar Balanço', desc: 'Movimento isométrico suave com micro-rotações' },
                      { id: 'reveal', name: 'Revelação Zoom', desc: 'Revelação grande puxando câmera do fechado ao aberto' },
                      { id: 'manual', name: 'Ângulo Livre', desc: 'Controle manual dos ângulos de visualização' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSettings(prev => ({ ...prev, preset: item.id as PresetName }))}
                        className={`p-3 rounded-xl text-left transition select-none flex flex-col gap-0.5 group border ${
                          settings.preset === item.id
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-rose-50'
                            : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 text-slate-400'
                        }`}
                        title={item.desc}
                      >
                        <span className={`text-[11px] font-mono tracking-wider ${settings.preset === item.id ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                          {item.id.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold leading-none truncate mt-0.5">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PHYSICAL ANIMATION METRICS */}
                <div className="space-y-4 pt-3 border-t border-white/5">
                  <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">
                    Métricas de Gravação & Câmera
                  </label>

                  {/* Slider duration (3 to 30) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Duração do Vídeo</span>
                      <span className="font-mono text-indigo-400 font-bold">{settings.duration} segundos</span>
                    </div>
                    <input 
                      type="range"
                      min={3}
                      max={30}
                      step={1}
                      value={settings.duration}
                      onChange={(e) => setSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>3s (Social Rápido)</span>
                      <span>30s (Anúncio Longo)</span>
                    </div>
                  </div>

                  {/* Slider speed */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Velocidade da Câmera</span>
                      <span className="font-mono text-indigo-400 font-bold">{settings.animationSpeed.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range"
                      min={0.2}
                      max={2.5}
                      step={0.1}
                      value={settings.animationSpeed}
                      onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Slider device scale */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Tamanho do Mockup (Escala)</span>
                      <span className="font-mono text-indigo-400 font-bold">{settings.deviceScale.toFixed(2)}x</span>
                    </div>
                    <input 
                      type="range"
                      min={0.6}
                      max={2.0}
                      step={0.05}
                      value={settings.deviceScale}
                      onChange={(e) => setSettings(prev => ({ ...prev, deviceScale: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Slider device curve bend */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium font-sans">Curvatura Isométrica</span>
                      <span className="font-mono text-indigo-400 font-bold">{(settings.curveAmount * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range"
                      min={0.0}
                      max={2.0}
                      step={0.1}
                      value={settings.curveAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, curveAmount: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Fino/Plano</span>
                      <span>Display Curvo Premium</span>
                    </div>
                  </div>

                  {/* MANUAL CONFIG FOR MORE ROTATION (Visible when Manual preset is used or as Offset tweak) */}
                  <div className={`space-y-3 pt-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-300 ${
                    settings.preset === 'manual' ? 'opacity-100' : 'opacity-65'
                  }`}>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Controles Manuais de Rotação (3D Offset)</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Ângulo de Inclinação (Pitch)</span>
                        <span className="font-mono">{settings.cameraPitch}°</span>
                      </div>
                      <input 
                        type="range"
                        min={0}
                        max={90}
                        step={1}
                        value={settings.cameraPitch}
                        onChange={(e) => setSettings(prev => ({ ...prev, cameraPitch: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded accent-indigo-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Ângulo de Giro (Roll)</span>
                        <span className="font-mono">{settings.cameraRoll}°</span>
                      </div>
                      <input 
                        type="range"
                        min={-45}
                        max={45}
                        step={1}
                        value={settings.cameraRoll}
                        onChange={(e) => setSettings(prev => ({ ...prev, cameraRoll: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded accent-indigo-400 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: DESIGN & SCENARIO COLORS */}
            {activeTab === 'design' && (
              <div className="space-y-5">
                
                {/* 1. BACKGROUND GRADIENTS */}
                <div className="space-y-4">
                  <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">
                    Cores do Cenário (Fundo do Vídeo)
                  </label>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">Cor de Origem</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={settings.bgGradientStart}
                          onChange={(e) => setSettings(prev => ({ ...prev, bgGradientStart: e.target.value }))}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={settings.bgGradientStart.toUpperCase()}
                          onChange={(e) => setSettings(prev => ({ ...prev, bgGradientStart: e.target.value }))}
                          className="w-full bg-slate-900 border border-white/5 text-xs px-2 py-1.5 rounded font-mono text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">Cor de Destino</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={settings.bgGradientEnd}
                          onChange={(e) => setSettings(prev => ({ ...prev, bgGradientEnd: e.target.value }))}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={settings.bgGradientEnd.toUpperCase()}
                          onChange={(e) => setSettings(prev => ({ ...prev, bgGradientEnd: e.target.value }))}
                          className="w-full bg-slate-900 border border-white/5 text-xs px-2 py-1.5 rounded font-mono text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gradient Quick Swatches */}
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Presets Premium Rápidos</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Obsidiana Neon', start: '#090910', end: '#1a0c30' },
                        { name: 'Aurora Verde', start: '#040b0e', end: '#062624' },
                        { name: 'Espaço Sombrio', start: '#020205', end: '#111827' },
                        { name: 'Orquídea Cyberpunk', start: '#120215', end: '#04051a' },
                        { name: 'Areia Macia', start: '#110d0d', end: '#2d1a10' }
                      ].map((swatch, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSettings(prev => ({
                            ...prev, 
                            bgGradientStart: swatch.start, 
                            bgGradientEnd: swatch.end
                          }))}
                          className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
                        >
                          {swatch.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. CHASSI DE BROWSER MOCKUP */}
                <div className="space-y-2 pt-4 border-t border-white/5" id="browser-chassis-picker">
                  <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">
                    Moldura do Navegador (Mockup)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dark', name: 'Mac Dark' },
                      { id: 'light', name: 'Mac Light' },
                      { id: 'none', name: 'Sem Moldura' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSettings(prev => ({ ...prev, browserTheme: item.id as BrowserTheme }))}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                          settings.browserTheme === item.id
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-rose-50'
                            : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 text-slate-400'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                    Insere uma moldura sofisticada do macOS com botões transparentes e URL mockup acima do print do seu site.
                  </p>
                </div>

                {/* 3. NEON GLOWS BACKDROP */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">
                    Aura Brilhante Traseira (Glow)
                  </label>

                  <div className="flex items-center gap-3">
                    <input 
                      type="color"
                      value={settings.glowColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, glowColor: e.target.value }))}
                      className="w-10 h-10 rounded-full border border-white/10 cursor-pointer bg-transparent shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Intensidade do Brilho</span>
                        <span className="font-mono text-indigo-400">{settings.glowIntensity.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range"
                        min={0}
                        max={4}
                        step={0.1}
                        value={settings.glowIntensity}
                        onChange={(e) => setSettings(prev => ({ ...prev, glowIntensity: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. GROUND GRID SETTINGS */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                      Exibir Grade Terrestre (Grid 3D)
                    </label>
                    <input 
                      type="checkbox"
                      checked={settings.showGrid}
                      onChange={(e) => setSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-white/10 accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {settings.showGrid && (
                    <div className="space-y-2 p-3 rounded-lg bg-white/[0.01] border border-white/5 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Cor das Linhas da Grade</span>
                        <input 
                          type="color"
                          value={settings.gridColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, gridColor: e.target.value }))}
                          className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: TEXT OVERLAYS BANNERS */}
            {activeTab === 'text' && (
              <div className="space-y-5">
                
                <label className="text-[10px] font-mono tracking-widest text-slate-500 block uppercase">
                  Cinematic Title Overlay (Legendas)
                </label>
                
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Adicione lindos overlays de texto direto na gravação do vídeo. Útil para chamadas promocionais ou marcar o endereço do site para redes sociais.
                </p>

                {/* Overlay Text Input */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Text Superior (Fininho / Header)</span>
                  <input 
                    type="text"
                    value={settings.textOverlay}
                    onChange={(e) => setSettings(prev => ({ ...prev, textOverlay: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 text-xs px-3 py-2 rounded-lg text-slate-200 font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Ex: 🚀 PRODUTO NOVO NO AR!"
                  />
                </div>

                {/* Subtitle Value */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Texto Secundário (Rodapé / Link)</span>
                  <input 
                    type="text"
                    value={settings.textSubtitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, textSubtitle: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 text-xs px-3 py-2 rounded-lg text-slate-200 font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Ex: deslize para cima para ver os preços"
                  />
                </div>

                {/* Text Color picker */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    Cor das Letras
                  </span>
                  <input 
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-7 h-7 rounded border border-white/10 cursor-pointer bg-transparent"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 space-y-1.5 bg-white/[0.01] p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Dica de Marketing
                  </span>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Se você usar a otimização de IA do Gemini (botão no topo), ele gerará títulos persuasivos baseados no nicho e cores reais detectadas na sua imagem!
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* LOWER FIXED RECORD BUTTON PANEL */}
          <div className="p-4 border-t border-white/5 bg-slate-950/80 backdrop-blur" id="recording-action-wrapper">
            {isRecording ? (
              <div className="space-y-2" id="rendering-progress-panel">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    GRAVANDO QUADROS 3D...
                  </span>
                  <span className="font-mono text-xs">{recordingProgress.percent}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${recordingProgress.percent}%` }}
                  />
                </div>

                <p className="text-[9px] text-slate-400 text-center uppercase font-mono tracking-wider">
                  Desenhando {recordingProgress.current}/{recordingProgress.total} frames de WebGL a 60fps
                </p>
              </div>
            ) : (
              <button
                onClick={handleStartVidRecording}
                disabled={isRecording}
                className="w-full py-4 text-sm font-extrabold tracking-wider leading-none text-white bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 active:scale-[0.99] rounded-xl shadow-xl shadow-rose-900/10 cursor-pointer text-center uppercase flex items-center justify-center gap-2 border border-rose-400/20"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-pulse shrink-0" />
                <span>Renderizar e Gravar Vídeo 3D</span>
              </button>
            )}
          </div>
        </section>

        {/* PANEL RIGHT: SCREEN VIEWPORT CANVAS RENDERER & LIVE DEMO VIEWPORT (lg:col-span-8) */}
        <section className="lg:col-span-8 flex flex-col h-[calc(100vh-73px)] relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" id="canvas-workspace">
          
          {/* Top Bar for Viewport: Aspect ratio configurator */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/40 relative z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                PROMO VIEWPORT PREVIEW
              </span>
              <span className="h-3 w-px bg-white/10" />
              <p className="text-xs text-slate-400 leading-normal hidden sm:inline">
                Ajuste a proporção ideal para suas publicações sociais
              </p>
            </div>

            {/* View Ratio Swapper Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-white/5" id="social-aspect-picker">
              {[
                { id: '16:9', name: 'Widescreen', icon: Tv, sub: '16:9 YouTube' },
                { id: '9:16', name: 'Vertical Reels', icon: Smartphone, sub: '9:16 Reels/TikTok' },
                { id: '1:1', name: 'Quadrado', icon: Monitor, sub: '1:1 Post' }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSettings(prev => ({ ...prev, ratio: item.id as VideoRatio }))}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      settings.ratio === item.id
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={item.sub}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI SPEECH CRITIQUE BUBBLE IF RESULTS ARE ACTIVE */}
          {aiResult && (
            <div className="absolute top-16 inset-x-4 z-20 animate-slide-in select-none">
              <div className="glass-panel p-4 rounded-xl border-l-4 border-purple-500 shadow-xl flex gap-3 text-xs">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 shrink-0 flex items-center justify-center font-bold text-purple-300">
                  ✦
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    Crítica de Design do Gemini IA
                    <span className="bg-purple-900/40 border border-purple-400/20 text-[9px] text-purple-300 font-mono px-1.5 py-0.2 rounded uppercase">
                      Análise Ativa
                    </span>
                  </div>
                  <p className="leading-relaxed font-sans italic">
                    "{aiResult.critique}"
                  </p>
                </div>
                <button 
                  onClick={() => setAiResult(null)}
                  className="text-slate-500 hover:text-slate-300 ml-auto shrink-0 font-bold h-fit px-1 bg-white/5 rounded"
                  title="Fechar"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* REAL WEBGL EMBEDDED VIEWPORT CANVAS */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            <ThreeCanvas 
              imageSrc={imageSrc}
              settings={settings}
              isRecording={isRecording}
              onRecordingFrame={handleFrameRecordedCallback}
              onRecordingComplete={handleRecordingCompleteCallback}
              onRecordingError={handleRecordingErrorCallback}
            />

            {/* Instruction tooltip badge overlaid on WebGL preview */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] text-slate-400 pointer-events-none uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur font-mono">
              <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-indigo-400" />
              <span>Preview 3D Dinâmico {settings.preset.toUpperCase()} Ativo</span>
            </div>
          </div>

        </section>

      </main>

      {/* RENDER COMPLETE OUTPUT DOWNLOAD MODAL */}
      {showVideoModal && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" id="output-video-modal">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl shadow-2xl relative border border-white/10 mx-4">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-100">
                    Seu Vídeo 3D Está Pronto!
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Gravado com sucesso no navegador em alta resolução
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowVideoModal(false);
                }}
                className="text-slate-400 hover:text-white px-3 py-1 hover:bg-white/5 rounded-lg text-xs"
              >
                Voltar
              </button>
            </div>

            {/* Embedded video element representing actual output render */}
            <div className="w-full bg-slate-900 rounded-xl overflow-hidden aspect-[9/16] max-h-[460px] flex items-center justify-center relative shadow-inner border border-white/10 p-1 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950">
              <video 
                src={recordedVideoUrl} 
                controls 
                autoPlay 
                loop 
                className="max-h-full rounded-lg object-contain block h-full w-full"
                id="modal-recorded-video"
              />
            </div>

            <div className="mt-5 space-y-3">
              <a
                href={recordedVideoUrl}
                download={`Aura3D_Video_${settings.preset}.webm`}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] rounded-xl font-bold text-sm text-center text-white cursor-pointer shadow-lg shadow-indigo-600/20 block flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Vídeo Cinematográfico</span>
              </a>

              <button
                onClick={() => {
                  setShowVideoModal(false);
                  handleResetSettings();
                }}
                className="w-full py-2.5 text-slate-400 hover:text-slate-200 text-xs font-semibold text-center hover:bg-white/5 rounded-xl cursor-pointer"
              >
                Criar Outra Animação
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
