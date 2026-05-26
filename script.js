/* script.js - Pure WebGL ThreeJS core of Aura 3D Web Animator */

// --- GERADOR DE IMAGEM MOCKUP PARA TEXTURA VIA CANVAS ---
function getPlaceholderWebsiteImage() {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 2400;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Preenche fundo escuro
  ctx.fillStyle = '#0a0b10';
  ctx.fillRect(0, 0, width, height);

  // Grade para visual SaaS
  ctx.strokeStyle = '#161925';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Degradês vibrantes de neon
  const grad1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 600);
  grad1.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
  grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad1; ctx.fillRect(0, 0, width, height);

  const grad2 = ctx.createRadialGradient(1000, 800, 100, 1000, 800, 800);
  grad2.addColorStop(0, 'rgba(236, 72, 153, 0.12)');
  grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad2; ctx.fillRect(0, 0, width, height);

  // Função de Card Glassmorphism
  function drawGlassCard(x, y, w, h, r, bCol = 'rgba(255,255,255,0.08)', bg = 'rgba(20,22,33,0.65)') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = bg; ctx.fill();
    ctx.strokeStyle = bCol; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
  }

  // NAV BAR
  drawGlassCard(40, 40, width - 80, 80, 20, 'rgba(255,255,255,0.1)', 'rgba(15,17,28,0.8)');
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px sans-serif'; ctx.fillText('AURA 3D', 80, 88);
  ctx.fillStyle = '#6366f1'; ctx.beginPath(); ctx.arc(65, 78, 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#94a3b8'; ctx.font = '500 18px sans-serif';
  ctx.fillText('Soluções', 230, 88); ctx.fillText('Preços', 360, 88); ctx.fillText('Recursos', 480, 88);

  // CTA
  drawGlassCard(width - 240, 55, 160, 50, 12, 'rgba(99, 102, 241, 0.4)', 'rgba(99, 102, 241, 0.2)');
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Testar Agora', width - 160, 85); ctx.textAlign = 'left';

  // HERO SECTION
  drawGlassCard(width / 2 - 130, 240, 260, 40, 20, 'rgba(236,72,153,0.3)', 'rgba(236,72,153,0.1)');
  ctx.fillStyle = '#ec4899'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('✦  A INTELIGÊNCIA 3D DO FUTURO  ✦', width / 2, 265);

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 64px sans-serif';
  ctx.fillText('Crie vídeos de websites', width / 2, 360);
  ctx.fillText('em perspectivas 3D', width / 2, 435);

  ctx.fillStyle = '#64748b'; ctx.font = '22px sans-serif';
  ctx.fillText('Converta screenshots simples em animações cinematográficas', width / 2, 510);
  ctx.fillText('perfeitas para atrair atenção de leads em Reels e TikTok.', width / 2, 545);
  ctx.textAlign = 'left';

  // DASHBOARD PREVIEW MOCKUP
  const dX = 100, dY = 640, dW = 1000, dH = 500;
  drawGlassCard(dX, dY, dW, dH, 24, 'rgba(255,255,255,0.12)', 'rgba(15,17,30,0.95)');
  
  // Window Dots
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(dX + 30, dY + 30, 8, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(dX + 55, dY + 30, 8, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(dX + 80, dY + 30, 8, 0, Math.PI*2); ctx.fill();

  // Cards inside Mockup
  const cW = 230, cH = 130;
  drawGlassCard(dX + 250, dY + 70, cW, cH, 16, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)');
  ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.fillText('Visualizações Ativas', dX + 270, dY + 105);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('142.8K', dX + 270, dY + 155);

  // Bento card on bottom
  drawGlassCard(dX + 250, dY + 220, 700, 240, 16, 'rgba(99,102,241,0.2)', 'rgba(255,255,255,0.01)');
  ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.fillText('Taxa de Engajamento Diário', dX + 280, dY + 265);
  
  ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 4; ctx.beginPath();
  ctx.moveTo(dX + 280, dY + 380); ctx.bezierCurveTo(dX + 400, dY + 310, dX + 500, dY + 410, dX + 650, dY + 290);
  ctx.bezierCurveTo(dX + 750, dY + 250, dX + 850, dY + 360, dX + 920, dY + 280); ctx.stroke();

  // Footer lower CTA
  drawGlassCard(100, 1220, 1000, 220, 24, 'rgba(236,72,153,0.2)', 'linear-gradient(135deg, rgba(15,17,28,0.9) 0%, rgba(236,72,153,0.05) 100%)');
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px sans-serif'; ctx.fillText('Pronto para animar suas próprias criações?', 140, 1310);
  ctx.fillStyle = '#94a3b8'; ctx.font = '18px sans-serif'; ctx.fillText('Suba sua foto na barra esquerda agora mesmo e mude os presets.', 140, 1355);

  return canvas.toDataURL('image/png');
}


// 1. ESTADO GLOBAL DEFAULT
const state = {
  imageSrc: getPlaceholderWebsiteImage(),
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
  cameraDistance: 11,
  cameraPitch: 45,
  cameraRoll: 15,
  perspectiveDirection: 'direita',
  perspectiveHorizontalOffset: 50,
  scrollRevealEnabled: false,
  animationSpeed: 1.0,
  textOverlay: '🚀 LANDING PAGE LIVE!',
  textSubtitle: 'meusite3d.com • Toque para explorar',
  textColor: '#ffffff',
  deviceScale: 1.15,
  imageWidth: 5.0,
  imageHeight: 9.0,
  brightness: 1.0,
  curveAmount: 0.8,
  activeTab: 'move'
};

// 2. ELEMENTOS DO DOM
const dom = {
  btnReset: document.getElementById('btn-reset'),
  btnGemini: document.getElementById('btn-gemini'),
  geminiBtnText: document.getElementById('gemini-btn-text'),
  notificationBanner: document.getElementById('notification-banner'),
  notificationText: document.getElementById('notification-text'),
  notificationClose: document.getElementById('notification-close'),
  
  fileInput: document.getElementById('file-input'),
  dropArea: document.getElementById('drop-area'),
  activeFilename: document.getElementById('active-filename'),
  btnRestoreMockup: document.getElementById('btn-restore-mockup'),
  
  tabMove: document.getElementById('tab-btn-move'),
  tabDesign: document.getElementById('tab-btn-design'),
  tabEffect: document.getElementById('tab-btn-effect'),
  tabText: document.getElementById('tab-btn-text'),
  
  secMove: document.getElementById('section-move'),
  secDesign: document.getElementById('section-design'),
  secEffect: document.getElementById('section-effect'),
  secText: document.getElementById('section-text'),
  
  inputDuration: document.getElementById('input-duration'),
  labelDuration: document.getElementById('label-duration'),
  inputSpeed: document.getElementById('input-speed'),
  labelSpeed: document.getElementById('label-speed'),
  inputScale: document.getElementById('input-scale'),
  labelScale: document.getElementById('label-scale'),
  inputImageWidth: document.getElementById('input-image-width'),
  labelImageWidth: document.getElementById('label-image-width'),
  inputImageHeight: document.getElementById('input-image-height'),
  labelImageHeight: document.getElementById('label-image-height'),
  inputBrightness: document.getElementById('input-brightness'),
  labelBrightness: document.getElementById('label-brightness'),
  inputCurve: document.getElementById('input-curve'),
  labelCurve: document.getElementById('label-curve'),
  
  panelManual: document.getElementById('manual-controls-panel'),
  inputPitch: document.getElementById('input-pitch'),
  labelPitch: document.getElementById('label-pitch'),
  inputRoll: document.getElementById('input-roll'),
  labelRoll: document.getElementById('label-roll'),
  selectDirection: document.getElementById('select-direction'),
  inputHorizontalOffset: document.getElementById('input-horizontal-offset'),
  labelHorizontalOffset: document.getElementById('label-horizontal-offset'),
  inputScrollReveal: document.getElementById('input-scroll-reveal'),
  
  inputColStart: document.getElementById('input-col-start'),
  inputColStartText: document.getElementById('input-col-start-text'),
  inputColEnd: document.getElementById('input-col-end'),
  inputColEndText: document.getElementById('input-col-end-text'),
  quickGradients: document.getElementById('quick-gradient-swatches'),
  
  inputColGlow: document.getElementById('input-col-glow'),
  inputGlowIntensity: document.getElementById('input-glow-intensity'),
  labelGlowIntensity: document.getElementById('label-glow-intensity'),
  
  inputShowGrid: document.getElementById('input-show-grid'),
  gridColorSubpanel: document.getElementById('grid-color-subpanel'),
  inputColGrid: document.getElementById('input-col-grid'),
  
  inputTextTitle: document.getElementById('input-text-title'),
  inputTextSub: document.getElementById('input-text-sub'),
  inputColText: document.getElementById('input-col-text'),
  
  canvasWrapper: document.getElementById('canvas-wrapper'),
  renderCanvas: document.getElementById('render-canvas'),
  
  btnRenderVideo: document.getElementById('btn-render-video'),
  recProgressPanel: document.getElementById('recording-progress-overlay'),
  recProgressBar: document.getElementById('recording-progress-bar'),
  recPercentText: document.getElementById('recording-percent'),
  recFramesText: document.getElementById('recording-frames-count'),
  
  outputVideoModal: document.getElementById('video-output-modal'),
  modalRecordedVideo: document.getElementById('modal-recorded-video'),
  btnDownloadVideo: document.getElementById('btn-download-video'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCreateAnother: document.getElementById('btn-create-another'),
  
  geminiCritiquePanel: document.getElementById('gemini-critique-panel'),
  geminiCritiqueText: document.getElementById('gemini-critique-text'),
  btnCloseCritique: document.getElementById('btn-close-critique'),
};

// 3. VARIÁVEIS DO AMBIENTE THREE.JS
let scene, camera, renderer, planeMesh, gridHelper, glowLight, shadowPlane;
let ambientLight, dirLight;
let playAnimFrameId = null;

// Plano de Clipping para Revelação gradual por Scroll
const scrollRevealClipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 100);

// Gestores de gravação de vídeo
let isRecording = false;
let recordedChunks = [];
let mediaRecorder = null;
let recordingFrame = 0;
let recordingTotal = 0;

// 4. INICIALIZAÇÃO DO THREE ENGINE
function initThreeEngine() {
  const width = dom.canvasWrapper.clientWidth;
  const height = dom.canvasWrapper.clientHeight;

  scene = new THREE.Scene();

  // Câmera de captura perspetiva
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 5, 12);

  renderer = new THREE.WebGLRenderer({
    canvas: dom.renderCanvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(width, height);
  renderer.localClippingEnabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Grupo para encapsular e rodar com isolamento
  mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Iluminação Traseira Soft (Glow)
  glowLight = new THREE.PointLight(0xffffff, 1.5, 30);
  glowLight.position.set(0, 0, -3);
  glowLight.castShadow = false;
  scene.add(glowLight);

  // Luz de Chão (Ambiental + Direcional)
  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0004;
  scene.add(dirLight);

  // Grade de Referência Espacial Infinita
  gridHelper = new THREE.GridHelper(60, 40, 0x4f46e5, 0x221c5a);
  gridHelper.position.y = -4.5;
  scene.add(gridHelper);

  // Sombra suave no chão
  const shadowGeo = new THREE.PlaneGeometry(100, 100);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
  shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -4.49;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Event Listeners de resize
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!renderer || !camera) return;
  const width = dom.canvasWrapper.clientWidth;
  const height = dom.canvasWrapper.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// 5. CRIA TEXTURA COM MOLDURA DO SAFARI/MAC VIA CANVAS DINÂMICO
function createFramedTexture(imgSource, theme) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const hasFrame = theme !== 'none';
      const frameH = hasFrame ? 50 : 0;
      
      // Proporção de tamanho para alta qualidade
      tempCanvas.width = img.width;
      const factor = img.width / 1200;
      const scaledFrameH = Math.round(frameH * factor);
      tempCanvas.height = img.height + scaledFrameH;
      
      const g = tempCanvas.getContext('2d');
      if (g) {
        // Fundo
        g.fillStyle = theme === 'dark' ? '#18181b' : '#f4f4f5';
        g.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        if (hasFrame) {
          // Botões clássicos mac
          const r = 6 * factor;
          const y = scaledFrameH / 2;
          
          g.fillStyle = '#ef4444'; g.beginPath(); g.arc(20 * factor, y, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#eab308'; g.beginPath(); g.arc(40 * factor, y, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#22c55e'; g.beginPath(); g.arc(60 * factor, y, r, 0, Math.PI * 2); g.fill();

          // Barra de endereço mockup
          g.fillStyle = theme === 'dark' ? '#27272a' : '#e4e4e7';
          const bW = 500 * factor, bH = 26 * factor;
          const bX = (tempCanvas.width - bW) / 2, bY = (scaledFrameH - bH) / 2;
          g.beginPath(); g.roundRect(bX, bY, bW, bH, 6 * factor); g.fill();
          
          g.fillStyle = theme === 'dark' ? '#71717a' : '#a1a1aa';
          g.font = `${Math.round(11 * factor)}px sans-serif`; g.textAlign = 'center';
          g.fillText('meusite3d.com', tempCanvas.width / 2, bY + bH / 2 + 4 * factor);
          g.textAlign = 'left';
        }

        // Desenha screenshot
        g.drawImage(img, 0, scaledFrameH);
      }

      const texture = new THREE.CanvasTexture(tempCanvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      resolve({
        texture,
        ratio: tempCanvas.width / tempCanvas.height
      });
    };
    
    img.onerror = () => {
      // Fallback
      const failCanvas = document.createElement('canvas');
      failCanvas.width = 512; failCanvas.height = 1024;
      const g = failCanvas.getContext('2d');
      g.fillStyle = '#22003c'; g.fillRect(0, 0, 512, 1024);
      g.fillStyle = '#ff3366'; g.font = '22px sans-serif';
      g.fillText('Erro ao renderizar website', 40, 200);
      resolve({
        texture: new THREE.CanvasTexture(failCanvas),
        ratio: 0.5
      });
    };

    img.src = imgSource;
  });
}

// 6. RECONSTRÓI A GRADE DE CURVATURA GEOMÉTRICA DO DISPOSITIVO
function rebuild3DPlaneMesh() {
  if (!scene) return;
  
  if (planeMesh) {
    mainGroup.remove(planeMesh);
    planeMesh.geometry.dispose();
    if (planeMesh.material.map) planeMesh.material.map.dispose();
    planeMesh.material.dispose();
  }

  createFramedTexture(state.imageSrc, state.browserTheme).then(({ texture, ratio }) => {
    // Lógica de object-fit: contain baseada nos controles de Largura e Altura sem qualquer distorção visual
    const maxW = state.imageWidth * state.deviceScale;
    const maxH = state.imageHeight * state.deviceScale;
    
    let targetW, targetH;
    if (maxW / maxH > ratio) {
      targetH = maxH;
      targetW = maxH * ratio;
    } else {
      targetW = maxW;
      targetH = maxW / ratio;
    }

    // Garante malha fina e curvada usando PlaneGeometry deformado
    const segmentsX = 2;
    const segmentsY = 64; 
    const geometry = new THREE.PlaneGeometry(targetW, targetH, segmentsX, segmentsY);

    // Deforma os vértices para criar a maravilhosa curvatura isométrica (efeito cinema)
    const pos = geometry.attributes.position;
    const strength = state.curveAmount * 1.6;

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      // Fator de curvatura senoidal
      const normY = y / (targetH / 2); // -1.0 a 1.0
      const offsetZ = Math.sin(Math.PI * (normY + 1) / 2) * strength;
      pos.setZ(i, offsetZ);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.16,
      metalness: 0.1
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.brightness = { value: state.brightness };
      material.userData.shader = shader;
      
      shader.fragmentShader = 'uniform float brightness;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\n    gl_FragColor.rgb *= brightness;'
      );
    };

    if (state.scrollRevealEnabled) {
      material.clippingPlanes = [ scrollRevealClipPlane ];
    }

    planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    mainGroup.add(planeMesh);

    // Centraliza a altura da câmera
    const dist = Math.max(targetH * 0.9, 8.5);
    state.cameraDistance = dist;
  });
}

// 7. ANIMANDO A SCENE - LAÇO DE RENDERIZAÇÃO
const startTime = Date.now();

function animate() {
  playAnimFrameId = requestAnimationFrame(animate);
  if (!scene || !camera || !renderer || !planeMesh) return;

  // Atualiza shader uniform de brilho (brightness) em tempo-real na renderização
  if (planeMesh && planeMesh.material && planeMesh.material.userData && planeMesh.material.userData.shader) {
    planeMesh.material.userData.shader.uniforms.brightness.value = state.brightness;
  }

  // Controla o tempo dependendo se estamos gravando vídeo em background ou simulando ao vivo
  let t = 0;
  if (isRecording) {
    const currentFrame = recordingFrame;
    const total = recordingTotal;
    const simulatedSecs = (currentFrame / total) * state.duration;
    t = simulatedSecs;
    
    // Progresso
    const pct = Math.round((currentFrame / total) * 100);
    dom.recPercentText.innerText = `${pct}%`;
    dom.recProgressBar.style.width = `${pct}%`;
    dom.recFramesText.innerText = `Renderizando quadro ${currentFrame} de ${total}`;

    recordingFrame++;

    if (currentFrame >= total) {
      isRecording = false;
      stopRecordingMedia();
    }
  } else {
    t = (Date.now() - startTime) / 1000;
  }

  // Variáveis físicas calculadas
  const speedMult = state.animationSpeed;
  const speedTime = t * speedMult;
  const targetHeight = planeMesh.geometry.parameters.height || 10;
  const baseDistance = state.cameraDistance;

  // Limpar posições
  mainGroup.rotation.set(0, 0, 0);
  mainGroup.position.set(0, 0, 0);
  camera.position.set(0, 0, baseDistance);
  camera.lookAt(0, 0, 0);

  const computedPitch = state.cameraPitch * Math.PI / 180;
  const computedRoll = state.cameraRoll * Math.PI / 180;

  // APLICAÇÃO DOS FAMOSOS PRESETS CINEMATOGRÁFICOS DE CÂMERA
  let lookAtTarget = new THREE.Vector3(0, 0, 0);

  switch (state.preset) {
    case 'scroll': {
      // Rolagem infinita do topo para a base
      const progress = speedTime % state.duration;
      const pct = Math.min(progress / state.duration, 1.0);
      
      const startY = targetHeight / 2 - 2;
      const endY = -targetHeight / 2 + 2;
      const currentY = startY + (endY - startY) * pct;

      lookAtTarget = new THREE.Vector3(0, currentY, 0);
      const cameraAngle = -35 * Math.PI / 180;
      camera.position.set(2, currentY + baseDistance * Math.sin(-cameraAngle), baseDistance * Math.cos(-cameraAngle));

      mainGroup.rotation.y = 0.22 + (Math.sin(t * 0.4) * 0.04);
      break;
    }

    case 'orbit': {
      // Rotação orbital constante
      const angle = speedTime * 0.3;
      camera.position.set(
        Math.sin(angle) * baseDistance,
        Math.sin(t * 0.5) * (baseDistance * 0.15) + 1,
        Math.cos(angle) * baseDistance
      );
      lookAtTarget = new THREE.Vector3(0, 0, 0);
      break;
    }

    case 'zoom': {
      // Zoom in progressivo
      const progress = speedTime % state.duration;
      const easing = Math.sin((progress / state.duration) * Math.PI / 2);
      const zoomAmount = baseDistance - (baseDistance * 0.45 * easing);

      camera.position.set(1.5, 1, zoomAmount);
      lookAtTarget = new THREE.Vector3(0, -targetHeight * 0.12 * easing, 0);

      mainGroup.rotation.y = computedPitch + 0.1;
      break;
    }

    case 'wobble': {
      // Flutuação diagonal isométrica sutil
      const bounce = Math.sin(t * 1.5) * 0.22;
      mainGroup.position.y = bounce;

      mainGroup.rotation.y = computedPitch + Math.sin(speedTime * 0.7) * 0.12;
      mainGroup.rotation.x = Math.cos(speedTime * 0.5) * 0.05;
      mainGroup.rotation.z = Math.sin(speedTime * 0.4) * 0.03;

      camera.position.set(0, 0.4, baseDistance);
      lookAtTarget = new THREE.Vector3(0, 0, 0);
      break;
    }

    case 'reveal': {
      // Revelação da câmera fechada para aberta
      const progress = speedTime % state.duration;
      const ease = 1.0 - Math.pow(1.0 - (progress / state.duration), 3); // cubic ease out
      
      const startD = baseDistance * 0.35;
      const curD = startD + (baseDistance - startD) * ease;

      const startLook = new THREE.Vector3(-1.5, targetHeight * 0.3, 0);
      const endLook = new THREE.Vector3(0, 0, 0);
      lookAtTarget = startLook.clone().lerp(endLook, ease);

      camera.position.set(0, 0.4, curD);

      mainGroup.rotation.y = 0.52 * ease;
      mainGroup.rotation.x = 0.2 * ease;
      break;
    }

    case 'manual': {
      // Controle livre
      camera.position.set(0, 0, baseDistance);
      lookAtTarget = new THREE.Vector3(0, 0, 0);

      mainGroup.rotation.y = computedPitch;
      mainGroup.rotation.z = computedRoll;
      mainGroup.rotation.x = 0.12;
      break;
    }
  }

  // ANIMAÇÃO DE REVELAÇÃO POR SCROLL
  if (state.scrollRevealEnabled && planeMesh) {
    const progress = speedTime % state.duration;
    const pct = Math.min(progress / state.duration, 1.0);
    
    const planeHeight = planeMesh.geometry.parameters ? planeMesh.geometry.parameters.height : 10;
    const yLimit = (planeHeight / 2) - planeHeight * pct;
    
    scrollRevealClipPlane.constant = -yLimit;
    
    if (planeMesh.material && !planeMesh.material.clippingPlanes) {
      planeMesh.material.clippingPlanes = [ scrollRevealClipPlane ];
    }
  } else {
    scrollRevealClipPlane.constant = 100;
  }

  // Aplicação do Deslocamento Horizontal da Perspectiva (0 a 100%) e Direção (Esquerda/Direita)
  const shiftRange = 4.5;
  const shiftFraction = state.perspectiveHorizontalOffset / 100;
  const shiftX = (state.perspectiveDirection === 'esquerda' ? -1 : 1) * shiftFraction * shiftRange;

  camera.position.x += shiftX;
  lookAtTarget.x += shiftX;
  camera.lookAt(lookAtTarget);

  // Renderiza
  renderer.render(scene, camera);
}

// Atualiza valores nas tags dinamicamente
function syncSettingsVisuals() {
  // Cores de fundo
  dom.canvasWrapper.style.background = `linear-gradient(135deg, ${state.bgGradientStart} 0%, ${state.bgGradientEnd} 100%)`;
  
  // Brilho traseiro do mockup
  if (glowLight) {
    glowLight.color.set(state.glowColor);
    glowLight.intensity = state.glowIntensity * 1.2;
  }

  // Grade
  if (gridHelper) {
    gridHelper.visible = state.showGrid;
    gridHelper.material.color.set(state.gridColor);
  }

  // Configuração de texto mockup overlay
  document.getElementById('promo-tag-title').innerText = state.textOverlay;
  document.getElementById('promo-tag-subtitle').innerText = state.textSubtitle;
  document.getElementById('promo-tag-title').style.color = state.textColor;
}

// 8. EVENT LISTENERS DE CONFIGURAÇÕES DE DURAÇÃO/MÉTRICAS
dom.inputDuration.addEventListener('input', (e) => {
  state.duration = parseInt(e.target.value);
  dom.labelDuration.innerText = `${state.duration} segundos`;
});
dom.inputSpeed.addEventListener('input', (e) => {
  state.animationSpeed = parseFloat(e.target.value);
  dom.labelSpeed.innerText = `${state.animationSpeed.toFixed(1)}x`;
});
dom.inputScale.addEventListener('input', (e) => {
  state.deviceScale = parseFloat(e.target.value);
  dom.labelScale.innerText = `${state.deviceScale.toFixed(2)}x`;
  rebuild3DPlaneMesh();
});
if (dom.inputImageWidth) {
  dom.inputImageWidth.addEventListener('input', (e) => {
    state.imageWidth = parseFloat(e.target.value);
    if (dom.labelImageWidth) dom.labelImageWidth.innerText = state.imageWidth.toFixed(1);
    rebuild3DPlaneMesh();
  });
}
if (dom.inputImageHeight) {
  dom.inputImageHeight.addEventListener('input', (e) => {
    state.imageHeight = parseFloat(e.target.value);
    if (dom.labelImageHeight) dom.labelImageHeight.innerText = state.imageHeight.toFixed(1);
    rebuild3DPlaneMesh();
  });
}
if (dom.inputBrightness) {
  dom.inputBrightness.addEventListener('input', (e) => {
    state.brightness = parseFloat(e.target.value);
    if (dom.labelBrightness) dom.labelBrightness.innerText = `${state.brightness.toFixed(2)}x`;
    if (planeMesh && planeMesh.material && planeMesh.material.userData && planeMesh.material.userData.shader) {
      planeMesh.material.userData.shader.uniforms.brightness.value = state.brightness;
    }
  });
}
dom.inputCurve.addEventListener('input', (e) => {
  state.curveAmount = parseFloat(e.target.value);
  dom.labelCurve.innerText = `${(state.curveAmount * 100).toFixed(0)}%`;
  rebuild3DPlaneMesh();
});

// Rotação Manual & Deslocamento de Perspectiva
dom.inputPitch.addEventListener('input', (e) => {
  state.cameraPitch = parseInt(e.target.value);
  dom.labelPitch.innerText = `${state.cameraPitch}°`;
});
dom.inputRoll.addEventListener('input', (e) => {
  state.cameraRoll = parseInt(e.target.value);
  dom.labelRoll.innerText = `${state.cameraRoll}°`;
});
if (dom.selectDirection) {
  dom.selectDirection.addEventListener('change', (e) => {
    state.perspectiveDirection = e.target.value;
  });
}
if (dom.inputHorizontalOffset) {
  dom.inputHorizontalOffset.addEventListener('input', (e) => {
    state.perspectiveHorizontalOffset = parseInt(e.target.value);
    if (dom.labelHorizontalOffset) {
      dom.labelHorizontalOffset.innerText = `${state.perspectiveHorizontalOffset}%`;
    }
  });
}

if (dom.inputScrollReveal) {
  dom.inputScrollReveal.addEventListener('change', (e) => {
    state.scrollRevealEnabled = e.target.checked;
    rebuild3DPlaneMesh();
    showNotification(state.scrollRevealEnabled ? '✦ Efeito Revelação por Scroll ativado!' : 'Efeito Revelação por Scroll desativado.', 'info');
  });
}

// Cores do Fundo
dom.inputColStart.addEventListener('input', (e) => {
  state.bgGradientStart = e.target.value;
  dom.inputColStartText.value = e.target.value.toUpperCase();
  syncSettingsVisuals();
});
dom.inputColStartText.addEventListener('change', (e) => {
  state.bgGradientStart = e.target.value;
  dom.inputColStart.value = e.target.value;
  syncSettingsVisuals();
});

dom.inputColEnd.addEventListener('input', (e) => {
  state.bgGradientEnd = e.target.value;
  dom.inputColEndText.value = e.target.value.toUpperCase();
  syncSettingsVisuals();
});
dom.inputColEndText.addEventListener('change', (e) => {
  state.bgGradientEnd = e.target.value;
  dom.inputColEnd.value = e.target.value;
  syncSettingsVisuals();
});

// Glow traseiro
dom.inputColGlow.addEventListener('input', (e) => {
  state.glowColor = e.target.value;
  syncSettingsVisuals();
});
dom.inputGlowIntensity.addEventListener('input', (e) => {
  state.glowIntensity = parseFloat(e.target.value);
  dom.labelGlowIntensity.innerText = `${state.glowIntensity.toFixed(1)}x`;
  syncSettingsVisuals();
});

// Grade de chão
dom.inputShowGrid.addEventListener('change', (e) => {
  state.showGrid = e.target.checked;
  if (state.showGrid) {
    dom.gridColorSubpanel.classList.remove('hidden');
  } else {
    dom.gridColorSubpanel.classList.add('hidden');
  }
  syncSettingsVisuals();
});
dom.inputColGrid.addEventListener('input', (e) => {
  state.gridColor = e.target.value;
  syncSettingsVisuals();
});

// Títulos
dom.inputTextTitle.addEventListener('input', (e) => {
  state.textOverlay = e.target.value;
  syncSettingsVisuals();
});
dom.inputTextSub.addEventListener('input', (e) => {
  state.textSubtitle = e.target.value;
  syncSettingsVisuals();
});
dom.inputColText.addEventListener('input', (e) => {
  state.textColor = e.target.value;
  syncSettingsVisuals();
});

// Cliques Gradients Swatches
dom.quickGradients.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  state.bgGradientStart = btn.dataset.start;
  state.bgGradientEnd = btn.dataset.end;
  dom.inputColStart.value = state.bgGradientStart;
  dom.inputColStartText.value = state.bgGradientStart.toUpperCase();
  dom.inputColEnd.value = state.bgGradientEnd;
  dom.inputColEndText.value = state.bgGradientEnd.toUpperCase();
  syncSettingsVisuals();
});

// Seletor de aspect ratio na barra de visualização
const zoomRatioPanel = document.getElementById('social-aspect-picker');
zoomRatioPanel.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  state.ratio = btn.dataset.ratio;
  document.querySelectorAll('.aspect-btn').forEach(b => {
    b.className = "aspect-btn px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer text-slate-400 hover:text-slate-200";
  });
  btn.className = "aspect-btn px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer bg-indigo-500 text-white shadow-md";
  
  syncSettingsVisuals();
});

// Seletor de presets cinematográficos
const presetGrid = document.getElementById('cinematic-preset-grid');
presetGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  state.preset = btn.dataset.preset;
  document.querySelectorAll('[data-preset]').forEach(b => {
    b.className = "p-3 rounded-xl text-left transition select-none flex flex-col gap-0.5 group border bg-white/[0.01] hover:bg-white/[0.04] border-white/5 text-slate-400";
    const sub = b.querySelector('span:first-child');
    if (sub) sub.className = "text-[11px] font-mono tracking-wider text-slate-500";
  });

  // Estilo do botão selecionado
  btn.className = "p-3 rounded-xl text-left transition select-none flex flex-col gap-0.5 group border bg-indigo-500/10 border-indigo-500/40 text-rose-50 font-bold";
  const selectedSub = btn.querySelector('span:first-child');
  if (selectedSub) selectedSub.className = "text-[11px] font-mono tracking-wider text-indigo-400 font-bold";

  // Toggles da visibilidade para controles adicionais se for manual
  if (state.preset === 'manual') {
    dom.panelManual.classList.remove('opacity-65');
    dom.panelManual.classList.add('opacity-100');
  } else {
    dom.panelManual.classList.remove('opacity-100');
    dom.panelManual.classList.add('opacity-65');
  }

  syncSettingsVisuals();
});

// Seletor de tema do mockup de browser
const themePicker = document.getElementById('browser-chassis-picker');
themePicker.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  state.browserTheme = btn.dataset.theme;
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.className = "theme-btn py-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] border-white/5 text-slate-400";
  });
  btn.className = "theme-btn py-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer bg-indigo-500/10 border-indigo-500/40 text-rose-50 font-bold";

  rebuild3DPlaneMesh();
});

// Resetar aos padrões iniciais
dom.btnReset.addEventListener('click', () => {
  state.preset = 'wobble';
  state.duration = 12;
  state.bgGradientStart = '#0d0d15';
  state.bgGradientEnd = '#1e1039';
  state.showGrid = true;
  state.gridColor = '#4f46e5';
  state.glowColor = '#ef4444';
  state.glowIntensity = 1.5;
  state.cameraPitch = 45;
  state.cameraRoll = 15;
  state.perspectiveDirection = 'direita';
  state.perspectiveHorizontalOffset = 50;
  state.animationSpeed = 1.0;
  state.textOverlay = '🚀 LANDING PAGE LIVE!';
  state.textSubtitle = 'meusite3d.com • Toque para explorar';
  state.textColor = '#ffffff';
  state.deviceScale = 1.15;
  state.imageWidth = 5.0;
  state.imageHeight = 9.0;
  state.brightness = 1.0;
  state.curveAmount = 0.8;

  // Reset inputs
  dom.inputDuration.value = 12;
  dom.labelDuration.innerText = '12 segundos';
  dom.inputSpeed.value = 1.0;
  dom.labelSpeed.innerText = '1.0x';
  dom.inputScale.value = 1.15;
  dom.labelScale.innerText = '1.15x';
  if (dom.inputImageWidth) {
    dom.inputImageWidth.value = 5.0;
  }
  if (dom.labelImageWidth) {
    dom.labelImageWidth.innerText = '5.0';
  }
  if (dom.inputImageHeight) {
    dom.inputImageHeight.value = 9.0;
  }
  if (dom.labelImageHeight) {
    dom.labelImageHeight.innerText = '9.0';
  }
  if (dom.inputBrightness) {
    dom.inputBrightness.value = 1.0;
  }
  if (dom.labelBrightness) {
    dom.labelBrightness.innerText = '1.00x';
  }
  dom.inputCurve.value = 0.8;
  dom.labelCurve.innerText = '80%';
  dom.inputPitch.value = 45;
  dom.labelPitch.innerText = '45°';
  dom.inputRoll.value = 15;
  dom.labelRoll.innerText = '15°';
  if (dom.selectDirection) {
    dom.selectDirection.value = 'direita';
  }
  if (dom.inputHorizontalOffset) {
    dom.inputHorizontalOffset.value = 50;
  }
  if (dom.labelHorizontalOffset) {
    dom.labelHorizontalOffset.innerText = '50%';
  }
  
  state.scrollRevealEnabled = false;
  if (dom.inputScrollReveal) {
    dom.inputScrollReveal.checked = false;
  }
  
  dom.inputColStart.value = '#0d0d15';
  dom.inputColStartText.value = '#0D0D15';
  dom.inputColEnd.value = '#1e1039';
  dom.inputColEndText.value = '#1E1039';
  dom.inputColGlow.value = '#ef4444';
  dom.inputGlowIntensity.value = 1.5;
  dom.labelGlowIntensity.innerText = '1.5x';
  dom.inputShowGrid.checked = true;
  dom.gridColorSubpanel.classList.remove('hidden');
  dom.inputColGrid.value = '#4f46e5';
  
  dom.inputTextTitle.value = '🚀 LANDING PAGE LIVE!';
  dom.inputTextSub.value = 'meusite3d.com • Toque para explorar';
  dom.inputColText.value = '#ffffff';

  rebuild3DPlaneMesh();
  syncSettingsVisuals();
  showNotification('Configurações do cenário redefinidas ao padrão do sistema.', 'info');
});

// GESTÃO DE ARQUIVO E DRAG AND DROP DETECT
dom.dropArea.addEventListener('click', () => dom.fileInput.click());
dom.fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

dom.dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dom.dropArea.classList.add('border-indigo-500', 'bg-indigo-500/[0.02]');
});
dom.dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dom.dropArea.classList.remove('border-indigo-500', 'bg-indigo-500/[0.02]');
});
dom.dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dom.dropArea.classList.remove('border-indigo-500', 'bg-indigo-500/[0.02]');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file.type.match('image.*')) {
    showNotification('Formato inválido! Envie uma captura PNG ou JPG.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    state.imageSrc = event.target.result;
    dom.activeFilename.innerText = file.name;
    rebuild3DPlaneMesh();
    showNotification('Sua imagem foi aplicada com sucesso à malha geométrica!', 'success');
  };
  reader.readAsDataURL(file);
}

dom.btnRestoreMockup.addEventListener('click', () => {
  state.imageSrc = getPlaceholderWebsiteImage();
  dom.activeFilename.innerText = 'Mockup Aura SaaS';
  rebuild3DPlaneMesh();
  showNotification('Modelo default de website recarregado.', 'info');
});

// OTIMIZAÇÃO CRIATIVA VIA GEMINI IA
dom.btnGemini.addEventListener('click', async () => {
  dom.geminiBtnText.innerText = "Analisando com Gemini...";
  dom.btnGemini.disabled = true;

  try {
    const response = await fetch('/api/analyze-screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: state.imageSrc,
        mimeType: 'image/png'
      })
    });

    if (!response.ok) {
      throw new Error('Sem backend');
    }

    const resData = await response.json();
    
    state.preset = resData.recommendedPreset || 'wobble';
    state.bgGradientStart = resData.bgStart || '#0a0d14';
    state.bgGradientEnd = resData.bgEnd || '#120f2b';
    state.glowColor = resData.glow || '#ec4899';
    state.textOverlay = resData.tagline ? resData.tagline.toUpperCase() : state.textOverlay;
    state.textSubtitle = resData.subtitle || state.textSubtitle;
    state.showGrid = true;
    state.glowIntensity = 2.0;

    dom.inputColStart.value = state.bgGradientStart;
    dom.inputColStartText.value = state.bgGradientStart.toUpperCase();
    dom.inputColEnd.value = state.bgGradientEnd;
    dom.inputColEndText.value = state.bgGradientEnd.toUpperCase();
    dom.inputColGlow.value = state.glowColor;
    dom.inputTextTitle.value = state.textOverlay;
    dom.inputTextSub.value = state.textSubtitle;
    dom.inputGlowIntensity.value = 2.0;
    dom.labelGlowIntensity.innerText = '2.0x';

    dom.geminiCritiqueText.innerText = `"${resData.critique}"`;
    dom.geminiCritiquePanel.classList.remove('hidden');

    rebuild3DPlaneMesh();
    syncSettingsVisuals();
    showNotification('✦ Design otimizado pelo diretor criativo do Gemini IA!', 'success');

  } catch (err) {
    console.warn('Rodando offline. Presets locais aplicados!');
    state.preset = 'orbit';
    state.bgGradientStart = '#02030d';
    state.bgGradientEnd = '#12061e';
    state.glowColor = '#a855f7';
    state.textOverlay = "AURA 3D CINEMA";
    state.textSubtitle = "Modo estático compatível ativo!";

    dom.inputColStart.value = state.bgGradientStart;
    dom.inputColStartText.value = '#02030D';
    dom.inputColEnd.value = state.bgGradientEnd;
    dom.inputColEndText.value = '#12061E';
    dom.inputColGlow.value = state.glowColor;
    dom.inputTextTitle.value = state.textOverlay;
    dom.inputTextSub.value = state.textSubtitle;

    rebuild3DPlaneMesh();
    syncSettingsVisuals();
    showNotification('Otimização offline: Preset Espaço Orquídea ativo!', 'info');
  } finally {
    dom.geminiBtnText.innerText = "Otimizar com Gemini IA";
    dom.btnGemini.disabled = false;
  }
});

dom.btnCloseCritique.addEventListener('click', () => {
  dom.geminiCritiquePanel.classList.add('hidden');
});

// GRAVAÇÃO DETERMINÍSTICA DE VÍDEO (MEDIA RECORDER)
dom.btnRenderVideo.addEventListener('click', () => {
  if (isRecording) return;

  if (dom.modalRecordedVideo.src) {
    URL.revokeObjectURL(dom.modalRecordedVideo.src);
  }

  recordedChunks = [];
  isRecording = true;
  recordingFrame = 0;
  
  const fps = 30;
  recordingTotal = fps * state.duration;

  dom.recProgressPanel.classList.remove('hidden');
  dom.btnRenderVideo.classList.add('hidden');

  try {
    const stream = dom.renderCanvas.captureStream(fps);
    
    let mimeTypeToUse = 'video/mp4;codecs=h264';
    if (!MediaRecorder.isTypeSupported(mimeTypeToUse)) {
      mimeTypeToUse = 'video/mp4;codecs=avc1';
    }
    if (!MediaRecorder.isTypeSupported(mimeTypeToUse)) {
      mimeTypeToUse = 'video/mp4';
    }
    if (!MediaRecorder.isTypeSupported(mimeTypeToUse)) {
      mimeTypeToUse = 'video/webm;codecs=vp9';
    }
    if (!MediaRecorder.isTypeSupported(mimeTypeToUse)) {
      mimeTypeToUse = 'video/webm';
    }

    let options = { mimeType: mimeTypeToUse, videoBitsPerSecond: 6000000 };
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
      } catch (e2) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      }
    }

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
      const vidUrl = URL.createObjectURL(videoBlob);
      
      dom.modalRecordedVideo.src = vidUrl;
      dom.btnDownloadVideo.href = vidUrl;
      dom.btnDownloadVideo.download = `Aura3D_Video_${state.preset}.mp4`;

      dom.outputVideoModal.classList.remove('hidden');
      showNotification('Seu vídeo promocional foi gerado com sucesso em formato MP4!', 'success');

      dom.recProgressPanel.classList.add('hidden');
      dom.btnRenderVideo.classList.remove('hidden');
    };

    mediaRecorder.start();
  } catch (err) {
    console.error('Falhou ao iniciar gravação:', err);
    isRecording = false;
    dom.recProgressPanel.classList.add('hidden');
    dom.btnRenderVideo.classList.remove('hidden');
    showNotification('Erro ao iniciar gravador nativo do navegador.', 'error');
  }
});

function stopRecordingMedia() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

dom.btnCloseModal.addEventListener('click', () => {
  dom.outputVideoModal.classList.add('hidden');
});
dom.btnCreateAnother.addEventListener('click', () => {
  dom.outputVideoModal.classList.add('hidden');
});

// HUD Notification Helper
function showNotification(msg, type = 'info') {
  dom.notificationText.innerText = msg;
  dom.notificationBanner.classList.remove('hidden');
  dom.notificationBanner.className = `bg-indigo-950/90 border-b px-6 py-2.5 flex items-center gap-3 animate-fade-in z-30 relative justify-between text-xs font-medium ${
    type === 'error' ? 'border-red-500/20 text-red-200 bg-red-950/90' : 'border-indigo-500/20 text-indigo-200 bg-indigo-950/90'
  }`;
}

dom.notificationClose.addEventListener('click', () => {
  dom.notificationBanner.classList.add('hidden');
});

// BOOT DA COMPILAÇÃO
initThreeEngine();
rebuild3DPlaneMesh();
animate();
syncSettingsVisuals();
