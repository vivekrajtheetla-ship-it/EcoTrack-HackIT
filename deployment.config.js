/**
 * EcoTrack Deployment Configuration
 * 
 * This file contains configuration for deploying the EcoTrack application
 * to various cloud platforms.
 */

module.exports = {
  // Render.com deployment configuration
  render: {
    // Backend service configuration
    backend: {
      name: 'ecotrack-api',
      runtime: 'node',
      buildCommand: 'cd backend && npm install',
      startCommand: 'cd backend && npm start',
      envVars: [
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'GEMINI_API_KEY'
      ],
      plan: 'free',
      region: 'ohio',
      healthCheckPath: '/api/health'
    },
    
    // Frontend static site configuration
    frontend: {
      name: 'ecotrack-web',
      buildCommand: 'cd frontend && npm install && npm run build',
      publishDirectory: 'frontend/build',
      envVars: [
        'REACT_APP_API_URL'
      ]
    }
  },
  
  // Vercel deployment configuration
  vercel: {
    // Backend configuration
    backend: {
      buildCommand: 'cd backend && npm install',
      outputDirectory: 'backend',
      devCommand: 'cd backend && npm run dev',
      installCommand: 'npm install',
      framework: null
    },
    
    // Frontend configuration
    frontend: {
      buildCommand: 'cd frontend && npm install && npm run build',
      outputDirectory: 'frontend/build',
      devCommand: 'cd frontend && npm start',
      installCommand: 'npm install',
      framework: 'create-react-app'
    }
  },
  
  // Heroku deployment configuration
  heroku: {
    buildpacks: [
      { url: 'heroku/nodejs' }
    ],
    addons: [
      'mongolab:sandbox'
    ],
    procfile: {
      web: 'cd backend && npm start'
    },
    config: {
      NODE_ENV: 'production'
    }
  },
  
  // Docker configuration for containerized deployment
  docker: {
    backend: {
      baseImage: 'node:18-alpine',
      workDir: '/app/backend',
      expose: 5000,
      cmd: 'npm start'
    },
    frontend: {
      baseImage: 'node:18-alpine',
      workDir: '/app/frontend',
      buildStage: {
        baseImage: 'node:18-alpine',
        workDir: '/app/frontend',
        cmd: 'npm run build'
      },
      productionStage: {
        baseImage: 'nginx:alpine',
        copyFrom: '/app/frontend/build',
        copyTo: '/usr/share/nginx/html',
        expose: 80
      }
    }
  }
};