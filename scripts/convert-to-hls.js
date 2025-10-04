// scripts/convert-to-hls.js - Convert MP3 to HLS format
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const inputFile = path.join(__dirname, '..', 'public', 'uploads', '8D Audio - Dhun Song  Saiyaara  Ahaan P, Aneet Padda  Mithoon  Arijit Singh  Use Headphones - 8DRhythm Official (720p, av1).mp3');
const outputDir = path.join(__dirname, '..', 'private', 'audio', 'saiyaara_8d');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// FFmpeg command to convert MP3 to HLS
const ffmpegCommand = `ffmpeg -i "${inputFile}" -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${path.join(outputDir, 'playlist.m3u8')}"`;

console.log('Converting MP3 to HLS format...');
console.log('Input:', inputFile);
console.log('Output:', outputDir);

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('Error converting to HLS:', error);
    return;
  }
  
  console.log('✅ Successfully converted to HLS format!');
  console.log('Files created in:', outputDir);
  
  // List created files
  fs.readdir(outputDir, (err, files) => {
    if (err) {
      console.error('Error reading output directory:', err);
      return;
    }
    
    console.log('Created files:');
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  });
});
