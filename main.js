var Datamatrix = require('./datamatrix.js');
//var fs = require("fs");

var express        =        require("express");
var bodyParser     =        require("body-parser");
var app            =        express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const crypto = require('crypto')

app.listen(process.env.PORT || 3000,function(){
  console.log("Started on PORT 3000");
})

app.post('/createMarker',function(request,response)
{
    var status = request.body.status; //0 normal, 1 risky, 2 infected, 3 recovered
    var type = request.body.type; //0 self-declared, 1 verified
    var content = request.body.id;//content of the code
    var imgW =request.body.imageWidth;


    var isoDate = new Date().toISOString();

    var template = 'images/normal_marker_bckg.svg';
    
    if(status == 0)
        template = 'images/normal_marker_bckg.svg';
    else if (status == 1)
        template = 'images/risky_marker_bckg.svg';
    else if (status == 2 && type == 0)
        template = 'images/infected_self_verified_marker_bckg.svg';
    else if (status == 2 && type == 1)
        template = 'images/infected_verified_marker_bckg.svg';
    else if (status == 3 && type == 0)
        template = 'images/recovered_self_verified_marker_bckg.svg';
    else if (status == 3 && type == 1)
        template = 'images/recovered_verified_marker_bckg.svg';



  var dm = new Datamatrix()
  var index = dm.getIndex(content,false);
    var matrix = dm.getDigit(content,false,index);


    var Canvas = require('canvas')
    const { createCanvas, loadImage } = require('canvas')

    const templateImg = loadImage(template)

    var imgWidth = imgW;
    var imgHeight = imgW*1.18;
    
    const canvas = createCanvas(imgW, imgHeight)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle =  'rgb(255,255,255)'
    ctx.fillRect(0,0,imgW, imgHeight)

    var dmWidth = imgW*0.68;
    var dmHeight = dmWidth;

    //NOTE: IN DATA MATRIX THERE IS QUIET ZONE, REMOVE TWO COLS & ROWS
    var cols = matrix.cols-2
    var cellW = dmWidth / cols//Math.floor(dmWidth / cols);

 
    //Align start point of drawing
    var dmX = (imgWidth*1.02-cellW*cols)/2
    var dmY = (imgHeight*0.76-cellW*cols)/2


    loadImage(template).then((image) => 
    {
           ctx.drawImage(image, 0, 0, imgWidth, imgHeight)

            for(col = 0; col <  cols; col++)
            {
                for(row = 0; row < cols; row++)
                {

                    var startRow = matrix.cols;
                        var startCols = 1;

                        var startIndex = startRow+(row*matrix.cols)+col+startCols;
                        var endIndex = startIndex+1
                    if(parseInt(matrix.data.substring(startIndex,endIndex)) == 0)
                    {
                        ctx.fillStyle = 'rgb(255,255,255)'
                    }
                    else
                        ctx.fillStyle = 'rgb(0,0,0)';
                    
                    ctx.fillRect(dmX+col*cellW, dmY+row*cellW, cellW, cellW);

                }
            }
        

       response.setHeader('Content-Type', 'image/png');
        canvas.pngStream().pipe(response);

        })
    
});

/*
app.post('/MakeMarker',function(request,response)
{
    var status = request.body.status; //0 normal, 1 risky, 2 infected, 3 recovered
    var type = request.body.type; //0 self-declared, 1 verified
    var content = request.body.content;//content of the code
    var imgW =request.body.imageWidth;


    var isoDate = new Date().toISOString();

    var template = 'images/normal_marker_bckg.svg';
    
    if(status == 0)
        template = 'images/normal_marker_bckg.svg';
    else if (status == 1)
        template = 'images/risky_marker_bckg.svg';
    else if (status == 2 && type == 0)
        template = 'images/infected_self_verified_marker_bckg.svg';
    else if (status == 2 && type == 1)
        template = 'images/infected_verified_marker_bckg.svg';
    else if (status == 3 && type == 0)
        template = 'images/recovered_self_verified_marker_bckg.svg';
    else if (status == 3 && type == 1)
        template = 'images/recovered_verified_marker_bckg.svg';



  var dm = new Datamatrix()
  var index = dm.getIndex(content,false);
    var matrix = dm.getDigit(content,false,index);


    var Canvas = require('canvas')
    const { createCanvas, loadImage } = require('canvas')

    const templateImg = loadImage(template)

    var imgWidth = imgW;
    var imgHeight = imgW*1.18;
    
    const canvas = createCanvas(imgW, imgHeight)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle =  'rgb(255,255,255)'
    ctx.fillRect(0,0,imgW, imgHeight)

    var dmWidth = imgW*0.68;
    var dmHeight = dmWidth;

    //NOTE: IN DATA MATRIX THERE IS QUIET ZONE, REMOVE TWO COLS & ROWS
    var cols = matrix.cols-2
    var cellW = dmWidth / cols//Math.floor(dmWidth / cols);

 
    //Align start point of drawing
    var dmX = (imgWidth*1.02-cellW*cols)/2
    var dmY = (imgHeight*0.76-cellW*cols)/2


    loadImage(template).then((image) => 
    {
           ctx.drawImage(image, 0, 0, imgWidth, imgHeight)

            for(col = 0; col <  cols; col++)
            {
                for(row = 0; row < cols; row++)
                {

                    var startRow = matrix.cols;
                        var startCols = 1;

                        var startIndex = startRow+(row*matrix.cols)+col+startCols;
                        var endIndex = startIndex+1
                    if(parseInt(matrix.data.substring(startIndex,endIndex)) == 0)
                    {
                        ctx.fillStyle = 'rgb(255,255,255)'
                    }
                    else
                        ctx.fillStyle = 'rgb(0,0,0)';
                    
                    ctx.fillRect(dmX+col*cellW, dmY+row*cellW, cellW, cellW);

                }
            }
        

       response.setHeader('Content-Type', 'image/png');
        canvas.pngStream().pipe(response);

        })
});
*/

function getCellColor(r,g,b)
{
    if( r == 1 && g == 1 &&  b == 1)
        return 'rgb(0,0,0)'
    else if( r == 0 && g == 0 &&  b == 0)
        return 'rgb(255,255,255)'
    else
    {
        var color = 'rgb('
        color += ((1-r)*255).toString()+','
        color += ((1-g)*255).toString()+','
        color += ((1-b)*255).toString()+')'
        return color;
    }
}