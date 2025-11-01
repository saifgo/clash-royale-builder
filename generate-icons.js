const fs = require('fs');
const { createCanvas } = require('canvas');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const scale = size / 512;
    
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#1a0f0f');
    bgGrad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);
    
    // Gold gradient
    const goldGrad = ctx.createLinearGradient(0, 0, size, size);
    goldGrad.addColorStop(0, '#ffd700');
    goldGrad.addColorStop(0.5, '#ffed4e');
    goldGrad.addColorStop(1, '#ffd700');
    
    // Decorative corner circles
    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    const cornerRadius = 25 * scale;
    ctx.beginPath();
    ctx.arc(80 * scale, 80 * scale, cornerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((512 - 80) * scale, 80 * scale, cornerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(80 * scale, (512 - 80) * scale, cornerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((512 - 80) * scale, (512 - 80) * scale, cornerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Crown
    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 5 * scale;
    
    ctx.beginPath();
    ctx.moveTo(130 * scale, 370 * scale);
    ctx.lineTo(160 * scale, 270 * scale);
    ctx.lineTo(210 * scale, 320 * scale);
    ctx.lineTo(256 * scale, 185 * scale);
    ctx.lineTo(302 * scale, 320 * scale);
    ctx.lineTo(352 * scale, 270 * scale);
    ctx.lineTo(382 * scale, 370 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Crown jewels
    ctx.fillStyle = '#8b6914';
    ctx.beginPath();
    ctx.arc(185 * scale, 290 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(256 * scale, 215 * scale, 15 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(327 * scale, 290 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Card symbol
    const cardX = 200 * scale;
    const cardY = 400 * scale;
    const cardW = 112 * scale;
    const cardH = 80 * scale;
    
    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 4 * scale;
    
    ctx.beginPath();
    roundRect(ctx, cardX, cardY, cardW, cardH, 8 * scale);
    ctx.fill();
    ctx.stroke();
    
    // Card lines
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(230 * scale, 425 * scale);
    ctx.lineTo(282 * scale, 425 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(230 * scale, 455 * scale);
    ctx.lineTo(282 * scale, 455 * scale);
    ctx.stroke();
    
    return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Generate icons
try {
    const canvas192 = drawIcon(192);
    const canvas512 = drawIcon(512);
    
    const buf192 = canvas192.toBuffer('image/png');
    const buf512 = canvas512.toBuffer('image/png');
    
    fs.writeFileSync('icon-192.png', buf192);
    fs.writeFileSync('icon-512.png', buf512);
    
    console.log('Icons generated successfully!');
    console.log('- icon-192.png');
    console.log('- icon-512.png');
} catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('\nNote: This script requires the "canvas" package.');
    console.log('Install it with: npm install canvas');
    console.log('\nAlternatively, use generate-icons.html in your browser.');
}

