// Create canvas elements for icon generation
const canvas16 = document.createElement('canvas');
canvas16.width = 16;
canvas16.height = 16;
const ctx16 = canvas16.getContext('2d');

const canvas48 = document.createElement('canvas');
canvas48.width = 48;
canvas48.height = 48;
const ctx48 = canvas48.getContext('2d');

const canvas128 = document.createElement('canvas');
canvas128.width = 128;
canvas128.height = 128;
const ctx128 = canvas128.getContext('2d');

// Function to draw a clock icon with an arrow
function drawClockIcon(ctx, size) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Draw clock circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#4285F4'; // Google blue
  ctx.fill();
  ctx.strokeStyle = '#3367D6'; // Darker blue
  ctx.lineWidth = size * 0.05;
  ctx.stroke();
  
  // Draw clock center
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // Draw hour hand (pointing to 2)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(Math.PI / 3) * radius * 0.5,
    centerY + Math.sin(Math.PI / 3) * radius * 0.5
  );
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Draw minute hand (pointing to 10)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(Math.PI * 5/3) * radius * 0.7,
    centerY + Math.sin(Math.PI * 5/3) * radius * 0.7
  );
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Draw sorting arrow
  const arrowSize = size * 0.3;
  const arrowX = size * 0.75;
  const arrowY = size * 0.75;
  
  // Arrow body
  ctx.beginPath();
  ctx.moveTo(arrowX - arrowSize/2, arrowY - arrowSize/2);
  ctx.lineTo(arrowX + arrowSize/2, arrowY - arrowSize/2);
  ctx.lineTo(arrowX, arrowY + arrowSize/2);
  ctx.closePath();
  ctx.fillStyle = '#34A853'; // Google green
  ctx.fill();
}

// Draw icons at different sizes
drawClockIcon(ctx16, 16);
drawClockIcon(ctx48, 48);
drawClockIcon(ctx128, 128);

// Convert to PNG data URLs
const icon16DataURL = canvas16.toDataURL('image/png');
const icon48DataURL = canvas48.toDataURL('image/png');
const icon128DataURL = canvas128.toDataURL('image/png');

// Function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}

// Save icons to files
const icon16Blob = dataURLtoBlob(icon16DataURL);
const icon48Blob = dataURLtoBlob(icon48DataURL);
const icon128Blob = dataURLtoBlob(icon128DataURL);

// URLs for downloading
const icon16URL = URL.createObjectURL(icon16Blob);
const icon48URL = URL.createObjectURL(icon48Blob);
const icon128URL = URL.createObjectURL(icon128Blob);

// Create download links
const link16 = document.createElement('a');
link16.href = icon16URL;
link16.download = 'icon16.png';
document.body.appendChild(link16);
link16.click();
document.body.removeChild(link16);

const link48 = document.createElement('a');
link48.href = icon48URL;
link48.download = 'icon48.png';
document.body.appendChild(link48);
link48.click();
document.body.removeChild(link48);

const link128 = document.createElement('a');
link128.href = icon128URL;
link128.download = 'icon128.png';
document.body.appendChild(link128);
link128.click();
document.body.removeChild(link128);

// Clean up
URL.revokeObjectURL(icon16URL);
URL.revokeObjectURL(icon48URL);
URL.revokeObjectURL(icon128URL);
