// Simple PNG icons for the extension
// These are base64-encoded PNG files for the extension icons

// Function to create a simple icon with a clock and sorting arrow
function createIconPNG(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.4, 0, 2*Math.PI);
  ctx.fillStyle = '#4285F4'; // Google blue
  ctx.fill();
  ctx.strokeStyle = '#3367D6'; // Darker blue
  ctx.lineWidth = size * 0.05;
  ctx.stroke();
  
  // Clock center
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.05, 0, 2*Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // Clock hands
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size/2 + size*0.2, size/2 - size*0.15);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size*0.06;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size/2 - size*0.1, size/2 + size*0.25);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size*0.04;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Sorting arrow
  ctx.beginPath();
  ctx.moveTo(size*0.7, size*0.6);
  ctx.lineTo(size*0.9, size*0.6);
  ctx.lineTo(size*0.8, size*0.8);
  ctx.closePath();
  ctx.fillStyle = '#34A853'; // Google green
  ctx.fill();
  
  return canvas.toDataURL('image/png').split(',')[1];
}

// Save the base64 data to files
const fs = require('fs');
const path = require('path');

// Generate icons for different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const iconData = createIconPNG(size);
  const buffer = Buffer.from(iconData, 'base64');
  fs.writeFileSync(path.join(__dirname, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
});
