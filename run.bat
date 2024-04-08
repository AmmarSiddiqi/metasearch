@echo off

REM Install NPM Dependencies and Compile TypeScript
echo setting up environment...
set NODE_ENV=development
echo Installing NPM dependencies...
npm ci
echo Compiling TypeScript...
node_modules\.bin\tsc

REM Compile Assets
echo Compiling assets...
node_modules\.bin\uglifyjs -c -m -o dist\ui.js src\ui\ui.js
echo Compiling Sass...
node_modules\.bin\sass --no-source-map -s compressed src\ui\styles.scss dist\styles.css

REM Build and Serve
echo Building and serving...
SET NODE_ENV=production
node src\index.js
