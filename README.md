# Jitter - LForm Developer Test
author: walker-finlay  
date: June 2 2020

## Usage
Jitter uses javascript for the backend. Its entry point is `/app.js` and takes your mysql password from an environment variable. Start it with `PASS=<your local mysql password> node app.js`. 

## TODO
- get rid of `var` keyword
- more direct DOM manipulation, fewer html re-rendering methods
- swap divs for more specific tags (`<list>`, `<head>`, etc)
- swap CSS animation for CSS transition
- for ... of instead of for ... in for arrays
- only style classes (no id, no tag)
