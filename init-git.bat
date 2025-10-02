@echo off
echo Initializing Git repository for Sonity...

echo # sonity >> README.md
git init
git add .
git commit -m "🎵 Initial commit: Modern Music Streaming Platform

- HLS audio streaming with 10-second segments
- Private storage system with secure file access
- Advanced rate limiting with IP tracking
- Thumbnail extraction from audio files
- Modern UI/UX with iOS 26 glass morphism
- Comprehensive API v1 structure
- Rate limiting and security features
- Audio converter and HLS manager
- Recent plays tracking system
- Optimized for production deployment"

git branch -M main
git remote add origin https://github.com/theamanone/sonity.git

echo.
echo Git repository initialized successfully!
echo.
echo Next steps:
echo 1. Make sure you have created the repository on GitHub: https://github.com/theamanone/sonity
echo 2. Run: git push -u origin main
echo.
echo Repository structure:
echo - Private storage system implemented
echo - HLS streaming ready
echo - Rate limiting configured
echo - API v1 endpoints created
echo - Modern UI components updated
echo.
pause
