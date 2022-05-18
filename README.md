**Later I will write the details.**

[![Netlify Status](https://api.netlify.com/api/v1/badges/4e9ef566-2b94-44b6-af12-7f84524cc2d7/deploy-status)](https://app.netlify.com/sites/dollplayer2501/deploys)

[Demo site (unlimited text works, the 4th.)](https://dollplayer2501.netlify.app/)



# Getting Started

    git clone git@github.com:dollplayer2501/Eleventy-netlify-V2.git any-path-name
    cd any-path-name
    nvm use
    npm install

    # Local (Data is stored in ./any-path-name/_develop)
    npm run develop:build-watch
    # http://localhost:8080

    # Production (Data is stored in ./any-path-name/_production)
    npm run product:build
    # If you want to check production's data
    npm run product:serve
    # http://localhost:3000
