// Simple script to generate placeholder icons for testing
// This will be replaced with actual icon files in the final extension

// Create a simple clock icon with a sorting arrow
function generateIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.4, 0, 2*Math.PI);
  ctx.fillStyle = '#4285F4'; // Google blue
  ctx.fill();
  
  // Clock hands
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size/2 + size*0.2, size/2 - size*0.15);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size*0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size/2 - size*0.1, size/2 + size*0.25);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size*0.04;
  ctx.stroke();
  
  // Sorting arrow
  ctx.beginPath();
  ctx.moveTo(size*0.7, size*0.6);
  ctx.lineTo(size*0.9, size*0.6);
  ctx.lineTo(size*0.8, size*0.8);
  ctx.closePath();
  ctx.fillStyle = '#34A853'; // Google green
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// Generate icons for different sizes
const icon16 = generateIcon(16);
const icon48 = generateIcon(48);
const icon128 = generateIcon(128);

// Output the data URLs for testing
console.log('Icon 16x16 generated');
console.log('Icon 48x48 generated');
console.log('Icon 128x128 generated');
