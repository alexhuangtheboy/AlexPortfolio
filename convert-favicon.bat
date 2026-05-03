@echo off
echo 🎨 Favicon Conversion Helper
echo ============================
echo.
echo This script will help you convert your healthcare dashboard image to favicon format.
echo.
echo 📋 INSTRUCTIONS:
echo.
echo 1. Save your healthcare dashboard image to this directory
echo 2. Visit one of these online converters:
echo    - https://favicon.io/ (Recommended - Free)
echo    - https://www.favicon-generator.org/
echo    - https://realfavicongenerator.net/
echo.
echo 3. Upload your image and download the generated favicon files
echo.
echo 4. Replace these placeholder files with the downloaded ones:
echo    - favicon.ico
echo    - favicon-32x32.png
echo    - favicon-16x16.png
echo    - apple-touch-icon.png
echo.
echo 5. Run: pnpm build
echo.
echo 6. Test: pnpm test:local
echo.
echo 7. Check your browser tab for the new favicon!
echo.
echo 📁 Current files in client/public/:
dir /b client\public\
echo.
echo ✅ HTML is already configured with favicon links!
echo.
pause