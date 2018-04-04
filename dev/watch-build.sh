#!/bin/bash
nodemon -w js ./node_modules/.bin/browserifyinc -- -v -e ./js/index.js -o ./static/build.js
