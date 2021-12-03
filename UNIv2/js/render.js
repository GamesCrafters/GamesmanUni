const GAME    = "tootnottopy";
const VARIANT = "6"; 

// const GAME    = "369mm";
// const VARIANT = "regular"; 

// const GAME    = "minitoadspy";
// const VARIANT = "easy"; // "misere" or "easy" 

const FULLSCREEN = true;
var   POSITION = "";

const valToColor = {"win":"#008000","lose":"#800000","tie":"#FFFF00"}

function BlockingGet(yourUrl){ // credit to https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
  const request = new XMLHttpRequest(); // a new request
  request.open("GET",yourUrl,false);
  request.send(); 
  return JSON.parse(request.responseText);
}

function BrokenAsyncGet(yourUrl){ // credit to https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
  const getTodos = (callback) => {

    const request = new XMLHttpRequest(); // a new request

    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200){
        //console.log(request.responseText);
        const data = JSON.parse(request.responseText)
        callback(undefined, data)
      } else if (request.readyState === 4){
        callback('could not fetch data', undefined)
      }
    });

    request.open("GET",yourUrl,false);
    request.send(); 
  };

  getTodos((err,data) => {
    console.log('callback fired');
    if(err){
      console.log("error");
      console.log(err);
    } else {
      console.log("good data");
      console.log(data)
    }
  });
}

function drawLineWithArrows(ctx,x0,y0,x1,y1,value,lWidth,aWidth,aLength,arrowStart,arrowEnd){
  // Thanks to: https://riptutorial.com/html5-canvas/example/18136/line-with-arrowheads
  // Usage: 
  // drawLineWithArrows(ctx,50,50,150,50,5,8,true,true);

  // x0,y0: the line's starting point
  // x1,y1: the line's ending point
  // value: game value {"win","tie","lose"}
  // lWidth: line width
  // aWidth: the distance the arrowhead perpendicularly extends away from the line
  // aLength: the distance the arrowhead extends backward from the endpoint
  // arrowStart: true/false directing to draw arrowhead at the line's starting point
  // arrowEnd: true/false directing to draw arrowhead at the line's ending point

  //console.log("drawing arrow")
  var dx=x1-x0;
  var dy=y1-y0;
  var angle=Math.atan2(dy,dx);
  var length=Math.sqrt(dx*dx+dy*dy)-lWidth;
  //
  ctx.lineWidth = lWidth;
  ctx.lineCap = "round";
  ctx.translate(x0,y0);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(length,0);
  if(arrowStart){
      ctx.moveTo(aLength,-aWidth);
      ctx.lineTo(0,0);
      ctx.lineTo(aLength,aWidth);
  }
  if(arrowEnd){
      ctx.moveTo(length-aLength,-aWidth);
      ctx.lineTo(length,0);
      ctx.lineTo(length-aLength,aWidth);
  }
  ctx.strokeStyle = valToColor[value];
  ctx.closePath();
  ctx.stroke();
  ctx.setTransform(1,0,0,1,0,0);
}

function drawCenteredCircle(ctx,x,y,r,value){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fillStyle = valToColor[value];
    ctx.fill();
    ctx.closePath();
}

function queueAllPieces(imgs, canvas, ctx, theme, bggeom, position) {
  // Then queue all the pieces for drawing by adding them to imgs array
  position.split("").forEach((e,i) => {
    filename = theme.pieces[e].image;
    scale = theme.pieces[e].scale;
    w = (canvas.width / bggeom[0]) * scale;
    h = (canvas.height / bggeom[1]) * scale;
    x = (canvas.width  * theme.centers[i][0] / bggeom[0]);
    y = (canvas.height * theme.centers[i][1] / bggeom[1]);
    imgs.push([ctx, filename, x, y, w, h])
  });
}

function drawAllMoves(imgs, canvas, ctx, theme, bggeom, moves) {
    if (moves == false) canvas.removeEventListener('click',clicker); // remove last click if primitive

    // Draw all the moves
    moves.forEach((e,i) => {
      moveA = e.move.split("_");
      //POSITION = e.position;
      if (moveA[0] === "M") {
        fri = +moveA[1];
        toi = +moveA[2];
        frx = (canvas.width  * theme.centers[fri][0] / bggeom[0]);
        fry = (canvas.height * theme.centers[fri][1] / bggeom[1]);
        tox = (canvas.width  * theme.centers[toi][0] / bggeom[0]);
        toy = (canvas.height * theme.centers[toi][1] / bggeom[1]);
        drawLineWithArrows(ctx,frx,fry,tox,toy,e.moveValue,canvas.width/60,canvas.width/60,canvas.width/40,false,true);
      } else {
        i = +moveA[2];
        x = (canvas.width  * theme.centers[i][0] / bggeom[0]);
        y = (canvas.height * theme.centers[i][1] / bggeom[1]);
        //console.log(e.moveValue, moveA[2])
        drawCenteredCircle(ctx,x,y,canvas.width/120,e.moveValue);
      }
    });

    // set the global POSITION (the move on the click) to be a random move
    POSITION = moves[Math.floor(Math.random() * moves.length)].position;
}

function clicker() {
  drawPosition(POSITION); // this is a cheat so that the click always works
}

var setup_JSON_text = [];
setup_JSON_text["minitoadspy"] = `{
  "response": {
    "gameId": "minitoadspy",
    "instructions": null,
    "name": "MinitoadPy",
    "variants": [
      {
        "description": "easy exploration",
        "startPosition": "R_A_1_3_RL-",
        "status": "stable",
        "variantId": "easy",
        "themes": {
          "defaultTheme": "wooden",
          "backgroundGeometry": [3, 2],
          "assets": {
            "wooden": {
              "backgroundImage": "svg/minitoadspy/board3x2.svg",
              "centers": [
                [0.5, 0.5],
                [1.5, 1.5], 
                [2.5, 0.5]
              ],
              "pieces": {
                "R": {
                  "image": "svg/minitoadspy/Rpiece.svg",
                  "scale": 0.5
                },
                "L": {
                  "image": "svg/minitoadspy/L.svg",
                  "scale": 0.5
                },
                "-": {
                  "image": "svg/minitoadspy/-.svg",
                  "scale": 0.5
                }
              }
            }
          }
        }
      },
      {
        "description": "misere exploration",
        "startPosition": "R_A_1_3_-LR",
        "status": "stable",
        "variantId": "misere",


        "themes": {
          "defaultTheme": "glass",
          "backgroundGeometry": [3, 1], 
          "assets": {
            "glass": {
              "backgroundImage": "svg/minitoadspy/board.svg",
              "centers": [
                [0.5, 0.5],
                [1.5, 0.5], 
                [2.5, 0.5]
              ],
              "pieces": {
                "R": {
                  "image": "svg/minitoadspy/Rpiece.svg",
                  "scale": 1
                },
                "L": {
                  "image": "svg/minitoadspy/L.svg",
                  "scale": 1
                },
                "-": {
                  "image": "svg/minitoadspy/-.svg",
                  "scale": 1
                }
              }
            }
          }
        }
      }
    ]
  },
  "status": "ok"
}`;

setup_JSON_text["369mm"] = `{
  "response": {
    "gameId": "369mm",
    "instructions": null,
    "name": "Three/Six/Nine Men's Morris",
    "variants": [
      {
        "description": "Standard 9 Men's Morris rules.",
        "startPosition": "R_A_8_7_9-----9s--s--s-s-s-s---sss--sss-sss--sss---s-s-s-s--s--s", 
        "status": "dev",
        "variantId": "regular",
        "themes": {
          "defaultTheme": "wikipedia",
          "backgroundGeometry": [ 300, 300 ],
          "assets": {
            "wikipedia": {
              "backgroundImage": "svg/369mm/board.svg",
              "centers": [
                [145, 140],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [175, 140],
                [40, 20],
                [99, 99],
                [99, 99],
                [160, 20],
                [99, 99],
                [99, 99],
                [280, 20],
                [99, 99],
                [80, 60],
                [99, 99],
                [160, 60],
                [99, 99],
                [240, 60],
                [99, 99],
                [99, 99],
                [99, 99],
                [120, 100],
                [160, 100],
                [200, 100],
                [99, 99],
                [99, 99],
                [40, 140],
                [80, 140],
                [120, 140],
                [99, 99],
                [200, 140],
                [240, 140],
                [280, 140],
                [99, 99],
                [99, 99],
                [120, 180],
                [160, 180],
                [200, 180],
                [99, 99],
                [99, 99],
                [99, 99],
                [80, 220],
                [99, 99],
                [160, 220],
                [99, 99],
                [240, 220],
                [99, 99],
                [40, 260],
                [99, 99],
                [99, 99],
                [160, 260],
                [99, 99],
                [99, 99],
                [280, 260]
              ],
              "pieces": {
                "s": {
                  "image": "svg/369mm/s.svg",
                  "scale": 1.0
                },
                "R": {
                  "image": "svg/369mm/R.svg",
                  "scale": 1.0
                },
                "0": {
                  "image": "svg/369mm/0.svg",
                  "scale": 100.0
                },
                "1": {
                  "image": "svg/369mm/1.svg",
                  "scale": 100.0
                },
                "2": {
                  "image": "svg/369mm/2.svg",
                  "scale": 100.0
                },
                "3": {
                  "image": "svg/369mm/3.svg",
                  "scale": 100.0
                },
                "4": {
                  "image": "svg/369mm/4.svg",
                  "scale": 100.0
                },
                "5": {
                  "image": "svg/369mm/5.svg",
                  "scale": 100.0
                },
                "6": {
                  "image": "svg/369mm/6.svg",
                  "scale": 100.0
                },
                "7": {
                  "image": "svg/369mm/7.svg",
                  "scale": 100.0
                },
                "8": {
                  "image": "svg/369mm/8.svg",
                  "scale": 100.0
                },
                "9": {
                  "image": "svg/369mm/9.svg",
                  "scale": 100.0
                },
                "X": {
                  "image": "svg/369mm/X.svg",
                  "scale": 130.0
                },
                "O": {
                  "image": "svg/369mm/O.svg",
                  "scale": 130.0
                },
                "-": {
                  "image": "svg/369mm/-.svg",
                  "scale": 1.0
                }
              }
            }
          }
        }
      }
    ]
  },
  "status": "ok"
}`;

setup_JSON_text["tootnottopy"] = `{
  "response": {
    "gameId": "tootnottopy",
    "instructions": null,
    "name": "Toot-N-Otto",
    "variants": [
      {
        "description": "6x4",
        "startPosition": "R_A_7_12_---TTTTTT---TO-OOOOOO-OTTO-vvvvvv-OTTO--------OTTO--------OTTO--------OTTO--------OT_------------------------x6666", 
        "status": "dev",
        "variantId": "6",
        "themes": {
          "defaultTheme": "dan",
          "backgroundGeometry": [ 120, 70 ],
          "assets": {
            "dan": {
              "backgroundImage": "svg/tootnotto/board.svg",
              "centers": [
                [99, 99],
                [99, 99],
                [99, 99],
                [35, 5],
                [45, 5],
                [55, 5],
                [65, 5],
                [75, 5],
                [85, 5],
                [99, 99],
                [99, 99],
                [99, 99],

                [5, 15],
                [15, 15],
                [99, 99],
                [35, 15],
                [45, 15],
                [55, 15],
                [65, 15],
                [75, 15],
                [85, 15],
                [99, 99],
                [105, 15],
                [115, 15],

                [5, 25],
                [15, 25],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [99, 99],
                [105, 25],
                [115, 25],

                [5, 35],
                [15, 35],
                [99, 99],
                [35, 35],
                [45, 35],
                [55, 35],
                [65, 35],
                [75, 35],
                [85, 35],
                [99, 99],
                [105, 35],
                [115, 35],

                [5, 45],
                [15, 45],
                [99, 99],
                [35, 45],
                [45, 45],
                [55, 45],
                [65, 45],
                [75, 45],
                [85, 45],
                [99, 99],
                [105, 45],
                [115, 45],

                [5, 55],
                [15, 55],
                [99, 99],
                [35, 55],
                [45, 55],
                [55, 55],
                [65, 55],
                [75, 55],
                [85, 55],
                [99, 99],
                [105, 55],
                [115, 55],

                [5, 65],
                [15, 65],
                [99, 99],
                [35, 65],
                [45, 65],
                [55, 65],
                [65, 65],
                [75, 65],
                [85, 65],
                [99, 99],
                [105, 65],
                [115, 65]
              ],
              "pieces": {
                "v": {
                  "image": "svg/tootnotto/v.svg",
                  "scale": 100.0
                },
                "T": {
                  "image": "svg/tootnotto/T.svg",
                  "scale": 10.0
                },
                "O": {
                  "image": "svg/tootnotto/O.svg",
                  "scale": 10.0
                },
                "-": {
                  "image": "svg/369mm/-.svg",
                  "scale": 1.0
                }
              }
            }
          }
        }
      }
    ]
  },
  "status": "ok"
}`;

function renderAll(imgs, lastCallback) {
  // Usage: 
  // renderAll(imgs, lastCallback);
  //
  // imgs: array of arrays, with each inner array being the 6 arguments the image loader needs
  // lastCallback: The niladic operation to do AFTER the images are all loaded
  //
  // This function solves the problem that images load asynchronously.
  // As a result, we queue up all the parameters for the images, then
  // "recurse" in renderAll until we're at the last one, and when that 
  // finally loaded, we proceed with the action afterwards, which is 
  // to draw moves over the pieces. If we don't do it this way, images
  // often load OVER each other improperly (but not deterministically!)

  ctx      = imgs[0][0];
  filename = imgs[0][1];
  x        = imgs[0][2];
  y        = imgs[0][3];
  w        = imgs[0][4];
  h        = imgs[0][5];

  const img = new Image();
  img.src = filename;
  img.onload = function () {
    ctx.drawImage(img,x-w/2,y-h/2,w,h); // x,y are centers not topleft corner
    if (imgs.length > 1) {
      renderAll(imgs.slice(1), lastCallback);
    } else {
      lastCallback();
    }
  }  
}

function drawPosition(UWAPIpos) {
  //console.log(UWAPIpos);
  var canvas = document.getElementById('c');
  if (canvas.getContext) {

    var imgs = []; // images have to be remembered
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas

    var obj = JSON.parse(setup_JSON_text[GAME]);

    var variantIndex = getVariantIndex(obj.response.variants, VARIANT);
    themes           = obj.response.variants[variantIndex].themes;
    defaultTheme     = themes.defaultTheme
    bggeom           = themes.backgroundGeometry;
    theme            = themes.assets[defaultTheme];

    position = UWAPIpos.split("_")[4];

    canvas.width = FULLSCREEN ? window.innerWidth : 300;
    canvas.height = (bggeom[1]/bggeom[0]) * canvas.width; // preserve aspect ratio

    // queue up the background drawing
    imgs.push([ctx, theme.backgroundImage, canvas.width/2, canvas.height/2, canvas.width, canvas.height])

    // ...then queue up the pieces...
    queueAllPieces(imgs, canvas, ctx, theme, bggeom, position);

    const json = BlockingGet("https://nyc.cs.berkeley.edu/universal/v1/games/"+GAME+"/variants/"+VARIANT+"/positions/"+UWAPIpos);
    // ...then the moves, the last to draw on the screen...
    var lastToDraw = () => {drawAllMoves(imgs, canvas, ctx, theme, bggeom, json.response.moves);};
    renderAll(imgs,lastToDraw);
  }  
}

function getVariantIndex(variantsA, variantId){
  // It's a little annoying that JSON variants are in an array (indexed 0,1,2)
  // but it's the ID that we care about. So we have to search through
  // all the variants to get to .
  for (let i = 0; i < variantsA.length; i++) {
    if (variantsA[i].variantId === variantId) {
      return i
    }
  }
}

function draw() {
  var obj = JSON.parse(setup_JSON_text[GAME]);
  var variantIndex = getVariantIndex(obj.response.variants, VARIANT);
  POSITION = UWAPIpos = obj.response.variants[variantIndex].startPosition;
  var canvas = document.getElementById('c');
  if (canvas.getContext) {
    canvas.addEventListener('click',clicker,false);
    drawPosition(UWAPIpos);
  }
}