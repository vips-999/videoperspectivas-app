/**
 * Generates an elegant high-resolution placeholder website screenshot using Canvas.
 * This ensures the user starts with a gorgeous 3D rendering preview instantly.
 */
export function getPlaceholderWebsiteImage(): string {
  const canvas = document.createElement('canvas');
  // High quality texture size (ideal ratio: long vertical screenshot)
  const width = 1200;
  const height = 2400;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Background
  ctx.fillStyle = '#0a0b10'; // Deep dark mode base
  ctx.fillRect(0, 0, width, height);

  // Subtle grid overlay for the SaaS look
  ctx.strokeStyle = '#161925';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Neon ambient backglows
  const glow1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 600);
  glow1.addColorStop(0, 'rgba(99, 102, 241, 0.15)'); // indigo
  glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1000, 800, 100, 1000, 800, 800);
  glow2.addColorStop(0, 'rgba(236, 72, 153, 0.12)'); // pink
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  const glow3 = ctx.createRadialGradient(400, 1700, 50, 400, 1700, 700);
  glow3.addColorStop(0, 'rgba(20, 184, 166, 0.1)'); // teal
  glow3.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow3;
  ctx.fillRect(0, 0, width, height);

  // Helper for drawing rounded rect with glass status
  function drawGlassCard(x: number, y: number, w: number, h: number, r: number, borderCol = 'rgba(255,255,255,0.08)', bg = 'rgba(20,22,33,0.65)') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // --- TOP NAVIGATION ---
  drawGlassCard(40, 40, width - 80, 80, 20, 'rgba(255, 255, 255, 0.1)', 'rgba(15, 17, 28, 0.8)');
  
  // Brand Logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('AURA', 80, 88);
  // Logo graphic
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.arc(65, 78, 8, 0, Math.PI * 2);
  ctx.fill();

  // Navigation Links
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 18px sans-serif';
  ctx.fillText('Soluções', 220, 88);
  ctx.fillText('Recursos', 340, 88);
  ctx.fillText('Preços', 460, 88);
  ctx.fillText('FAQ', 560, 88);

  // Call to Action button
  drawGlassCard(width - 240, 55, 160, 50, 12, 'rgba(99, 102, 241, 0.4)', 'rgba(99, 102, 241, 0.2)');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Experimentar', width - 160, 85);
  ctx.textAlign = 'left'; // reset

  // --- HERO SECTION ---
  // Badge
  drawGlassCard(width / 2 - 130, 240, 260, 40, 20, 'rgba(236, 72, 153, 0.3)', 'rgba(236, 72, 153, 0.1)');
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦  A PLATAFORMA 3D DO FUTURO  ✦', width / 2, 265);

  // Big Headline
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText('Seu site transformado', width / 2, 360);
  ctx.fillText('em cinematografia 3D', width / 2, 435);

  // Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '22px sans-serif';
  ctx.fillText('Crie animações impressionantes em bento grids e perspectivas', width / 2, 505);
  ctx.fillText('em segundos, ideais para Reels, TikTok, Shorts e portfólios.', width / 2, 540);

  // Buttons under Hero
  drawGlassCard(width / 2 - 230, 600, 210, 60, 15, 'rgba(99, 102, 241, 0.5)', '#6366f1');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Começar Grátis', width / 2 - 125, 637);

  drawGlassCard(width / 2 + 20, 600, 210, 60, 15, 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)');
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Ver Demo', width / 2 + 125, 637);
  ctx.textAlign = 'left'; // reset

  // --- DASHBOARD PREVIEW MOCKUP ---
  const dashX = 100;
  const dashY = 740;
  const dashW = 1000;
  const dashH = 550;
  drawGlassCard(dashX, dashY, dashW, dashH, 24, 'rgba(255, 255, 255, 0.15)', 'rgba(15, 17, 30, 0.95)');

  // Mock Windows Control Buttons
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(dashX + 30, dashY + 30, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(dashX + 55, dashY + 30, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(dashX + 80, dashY + 30, 8, 0, Math.PI * 2); ctx.fill();

  // Dashboard Header Title
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('https://dashboard.aura-ai.com/analytics', dashX + 120, dashY + 35);

  // Sidebar elements
  drawGlassCard(dashX + 25, dashY + 70, 180, dashH - 95, 14, 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)');
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('Dashboard', dashX + 50, dashY + 110);
  ctx.fillStyle = '#64748b'; 
  ctx.fillText('Análises', dashX + 50, dashY + 155);
  ctx.fillText('Configurações', dashX + 50, dashY + 200);
  ctx.fillText('Segurança', dashX + 50, dashY + 245);
  ctx.fillText('Faturamento', dashX + 50, dashY + 290);

  // Analytics Cards inside mock Dashboard
  const cardW = 230;
  const cardH = 130;
  // Card 1
  drawGlassCard(dashX + 230, dashY + 70, cardW, cardH, 16, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)');
  ctx.fillStyle = '#94a3b8'; ctx.font = '500 13px sans-serif'; ctx.fillText('Visualizações Ativas', dashX + 250, dashY + 105);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('142.8K', dashX + 250, dashY + 155);
  ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('+12.4% este mês', dashX + 250, dashY + 180);

  // Card 2 (Teal Accent)
  drawGlassCard(dashX + 480, dashY + 70, cardW, cardH, 16, 'rgba(20, 184, 166, 0.4)', 'rgba(20, 184, 166, 0.05)');
  ctx.fillStyle = '#94a3b8'; ctx.font = '500 13px sans-serif'; ctx.fillText('Taxa de Conversão', dashX + 500, dashY + 105);
  ctx.fillStyle = '#2dd4bf'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('4.82%', dashX + 500, dashY + 155);
  ctx.fillStyle = '#2dd4bf'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('+3.6% de aumento', dashX + 500, dashY + 180);

  // Card 3
  drawGlassCard(dashX + 730, dashY + 70, cardW, cardH, 16, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)');
  ctx.fillStyle = '#94a3b8'; ctx.font = '500 13px sans-serif'; ctx.fillText('Receita Projetada', dashX + 750, dashY + 105);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('$32,450', dashX + 750, dashY + 155);
  ctx.fillStyle = '#6366f1'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('Meta 98% alcançada', dashX + 750, dashY + 180);

  // Large Chart underneath cards
  const chartY = dashY + 225;
  const chartH = 290;
  drawGlassCard(dashX + 230, chartY, 730, chartH, 16, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.01)');
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('Performance Operacional', dashX + 260, chartY + 40);

  // Draw simulated chart lines
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(dashX + 270, chartY + 230);
  ctx.bezierCurveTo(dashX + 370, chartY + 180, dashX + 470, chartY + 240, dashX + 570, chartY + 110);
  ctx.bezierCurveTo(dashX + 670, chartY + 40, dashX + 770, chartY + 210, dashX + 870, chartY + 70);
  ctx.bezierCurveTo(dashX + 870, chartY + 70, dashX + 910, chartY + 120, dashX + 930, chartY + 100);
  ctx.stroke();

  // Grid/Vertical marker lines for chart
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const chartPointsX = [270, 380, 490, 600, 710, 820, 930];
  const chartPointsLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
  chartPointsX.forEach((ptX, idx) => {
    ctx.beginPath();
    ctx.moveTo(dashX + ptX, chartY + 70);
    ctx.lineTo(dashX + ptX, chartY + 240);
    ctx.stroke();
    // Labels
    ctx.fillStyle = '#475569';
    ctx.font = '500 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(chartPointsLabels[idx], dashX + ptX, chartY + 265);
    ctx.textAlign = 'left';
  });

  // --- FEATURES/BENTO TILES SECTION ---
  const bentoY = 1350;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('Por que usar a Aura?', width / 2 - 250, bentoY - 50);

  // Tile 1: Left
  const tileY = bentoY + 20;
  drawGlassCard(100, tileY, 470, 360, 24, 'rgba(255, 255, 255, 0.08)', 'rgba(20, 22, 33, 0.4)');
  ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.fillText('Animações Fáceis', 140, tileY + 60);
  ctx.fillStyle = '#94a3b8'; ctx.font = '16px sans-serif';
  ctx.fillText('Carregue sua imagem, configure o ângulo e a', 140, tileY + 110);
  ctx.fillText('velocidade, e nossa ferramenta constrói a', 140, tileY + 140);
  ctx.fillText('sua apresentação 3D instantaneamente.', 140, tileY + 170);
  // Elegant mini canvas vector illustration inside tile
  drawGlassCard(140, tileY + 200, 390, 120, 16, 'rgba(99,102,241,0.2)', 'rgba(99,102,241,0.05)');
  ctx.fillStyle = '#818cf8'; ctx.font = '13px monospace'; ctx.fillText('const renderer = new THREE.WebGLRenderer();', 160, tileY + 245);
  ctx.fillText('camera.rotation.y = Math.sin(time) * 0.4;', 160, tileY + 275);

  // Tile 2: Right
  drawGlassCard(630, tileY, 470, 360, 24, 'rgba(255, 255, 255, 0.08)', 'rgba(20, 22, 33, 0.4)');
  ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.fillText('Exportação Direta em Vídeo', 670, tileY + 60);
  ctx.fillStyle = '#94a3b8'; ctx.font = '16px sans-serif';
  ctx.fillText('Renderize direto no navegador em resoluções', 670, tileY + 110);
  ctx.fillText('otimizadas para TikTok, Instagram Reels,', 670, tileY + 140);
  ctx.fillText('YouTube ou postagens de mídias sociais.', 670, tileY + 170);
  // Record Button Mockup in bento card
  drawGlassCard(770, tileY + 220, 190, 50, 12, 'rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.15)');
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(795, tileY + 245, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px sans-serif'; ctx.fillText('GRAVAR VÍDEO', 815, tileY + 251);

  // --- CTA LOWER BANNER ---
  const ctaY = 1790;
  drawGlassCard(100, ctaY, 1000, 320, 30, 'rgba(99,102,241,0.5)', 'linear-gradient(135deg, rgba(15,17,28,0.9) 0%, rgba(99,102,241,0.1) 100%)');
  
  // Big CTA title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('Pronto para impressionar seu público?', 160, ctaY + 100);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = '20px sans-serif';
  ctx.fillText('Crie um vídeo em perspectiva 3D dos seus projetos agora.', 160, ctaY + 155);

  drawGlassCard(160, ctaY + 200, 230, 60, 15, 'rgba(255,255,255,0.4)', '#ffffff');
  ctx.fillStyle = '#0f111c';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Criar Minha Conta', 195, ctaY + 237);

  // --- FOOTER ---
  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('© 2026 Aura AI Technologies. Todos os direitos reservados.', 100, 2300);
  ctx.fillText('Termos de Serviço   |   Política de Privacidade', width - 420, 2300);

  return canvas.toDataURL('image/png');
}
