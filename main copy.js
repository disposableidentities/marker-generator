var Datamatrix = require('./datamatrix.js');

/*
var express        =        require("express");
var bodyParser     =        require("body-parser");
var app            =        express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//var fs = require("fs");
const crypto = require('crypto')

app.listen(process.env.PORT || 3000,function(){
  console.log("Started on PORT 3000");
})

app.post('/MakeMarker',function(request,response)
{
    var status = request.body.status; //0 normal, 1 risky, 2 infected, 3 recovered
    var type = request.body.type; //0 self-declared, 1 verified
    var content = request.body.content;//content of the code
    var imgW =request.body.imageWidth;
 */   

var status = 0
    var type = 0
    var content = "Hei"
var imgW = 200;

    var isoDate = new Date().toISOString();


    
    

    var template = 'images/normal_marker_bckg.svg';
    
    if(status == 0)
        template = 'images/normal_marker_bckg.svg';
    else if (status == 1)
        template = 'images/risky_marker_bckg.svg';
    else if (status == 2 && type == 0)
        template = 'images/infected_self_verified_marker_bckg.svg';
    else if (status == 2 && type == 2)
        template = 'images/infected_verified_marker_bckg.svg';
    else if (status == 2 && type == 0)
        template = 'images/recovered_self_verified_marker_bckg.svg';
    else if (status == 2 && type == 1)
        template = 'images/recovered_verified_marker_bckg.svg';

    //DATA READY LETS MAKE MARKER
    /*
    

    if(status === 2)
        template ='images/infected_marker_bckg.svg'
    if(status === 1)
        template ='images/unknown_marker_bckg.svg'

    

    var dm = new Datamatrix()

    var index_of_text1 = dm.getIndex(disposableID,false);
    var index_of_text2 = dm.getIndex(partitionerId,false);
    var index_of_text3 = dm.getIndex(metaData,false);

    var index = Math.max(Math.max(index_of_text1,index_of_text2),index_of_text3)

    var matrix_r = dm.getDigit(disposableID,false,index);
    var matrix_g = dm.getDigit(partitionerId,false,index);
    var matrix_b = dm.getDigit(metaData,false,index);

*/

  var dm = new Datamatrix()
  var index = dm.getIndex(content,false);
    var matrix = dm.getDigit(content,false,index);


    var Canvas = require('canvas')
    const { createCanvas, loadImage } = require('canvas')

    const templateImg = loadImage(template)

    const canvas = createCanvas(imgW, imgW*1.55)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle =  'rgb(255,255,255)'
    ctx.fillRect(0,0,imgW, imgW*1.7)

    var dmWidth = imgW*0.77;
    var dmHeight = dmWidth;

    //NOTE: IN DATA MATRIX THERE IS QUIET ZONE, REMOVE TWO COLS & ROWS
    var cols = matrix.cols-2
    var cellW = Math.floor(dmWidth / cols);

    var imgWidth = imgW;
    var imgHeight = imgWidth*1.33333;

    var dmX = imgW*0.2;
    var dmY = dmX;


    loadImage(template).then((image) => 
    {
           ctx.drawImage(image, 0, 0, imgWidth, imgHeight)

            for(col = 0; col <  cols; col++)
            {
                for(row = 0; row < cols; row++)
                {

                    /*ctx.fillStyle =  'rgb(255,255,255)'

                    if(col == 0)
                        ctx.fillStyle =  'rgb(0,0,0)'
                    else if(row == 0)
                    {
                        if(col == 2) //CYAN
                            ctx.fillStyle =  'rgb(0,255,255)'
                        else if(col == 4) //GREEN
                            ctx.fillStyle =  'rgb(0,255,0)'
                        else if(col == 6) //YELLOW 
                            ctx.fillStyle =  'rgb(255,255,0)'
                        else if(col % 2 == 0)
                            ctx.fillStyle =  'rgb(0,0,0)'
                    } 
                    else if(row == cols-1 || col == 0)
                        ctx.fillStyle =  'rgb(0,0,0)'
                    else if(col == cols-1)
                    {
                        if(row == cols-3) //RED
                            ctx.fillStyle =  'rgb(255,0,0)'
                        else if(row == cols-5) //BLUE
                            ctx.fillStyle =  'rgb(0,0,255)'
                        else if(row == cols-7) //PURPLE 
                            ctx.fillStyle =  'rgb(255,0,255)'
                        else if(row % 2 != 0)
                            ctx.fillStyle =  'rgb(0,0,0)'
                    }
                    else
                    {
                        var startRow = matrix_r.cols;
                        var startCols = 1;

                        var startIndex = startRow+(row*matrix_r.cols)+col+startCols;
                        var endIndex = startIndex+1

                        ctx.fillStyle = getCellColor(
                            parseInt(matrix_r.data.substring(startIndex,endIndex)),
                            parseInt(matrix_g.data.substring(startIndex,endIndex)),
                            parseInt(matrix_b.data.substring(startIndex,endIndex)))
                    }
                    */
                    
                    if(parseInt(matrix.data.substring(startIndex,endIndex)) == 0)
                    {
                        ctx.fillStyle = 'rgb(255,255,255)'
                    }
                    else
                        ctx.fillStyle = 'rgb(0,0,0)';
                    
                    ctx.fillRect(dmX+col*cellW, dmY+row*cellW, cellW, cellW);

                }
            }
/*
            //Draw balls

            ctx.lineWidth = ballD*0.1;
            ctx.strokeStyle = '#000000';

            ctx.beginPath();
            ctx.arc(firstBallX, firstBallY, ballD, 0, Math.PI*2, true); 
            ctx.fillStyle =  'rgb(0,0,0)'
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(firstBallX+(ballD*2)+ballSpace, firstBallY, ballD, 0, Math.PI*2, true); 
            if(type < 1)
               ctx.fillStyle =  'rgb(255,255,255)'
            else
                ctx.fillStyle =  'rgb(0,0,0)'
            ctx.closePath();
            ctx.fill();
            ctx.stroke();



            ctx.beginPath();
            ctx.arc(firstBallX+(ballD*2*2)+ballSpace*2, firstBallY, ballD, 0, Math.PI*2, true); 
            if(type < 2)
                ctx.fillStyle =  'rgb(255,255,255)'
            else
                ctx.fillStyle =  'rgb(0,0,0)'
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        */
            //Make final marker with text
/*
            var fontS = canvas.height*0.3;
            ctx.font = '' + fontS +'px Impact'
            ctx.fillStyle =  'rgb(0,0,0)'
            var textW = ctx.measureText(virus).width
            while(textW > canvas.width*0.9)
            {
                fontS--
                ctx.font = '' + fontS +'px Impact'
                textW = ctx.measureText(virus).width
            }

            ctx.fillText(virus, (canvas.width-textW)/2, canvas.height*0.96)
*/

        //var buf = canvas.toBuffer()
    //    fs.writeFileSync("test.png", buf);
        
      //  response.setHeader('Content-Type', 'image/png');
    //    canvas.pngStream().pipe(response);
        
      //      response.send("{'status':'ok'}");
        })
   // });




/*var status = 2 //0 firewall, 1 healthy, 2 infected
var type = 1 //0 self-declared, 1 verified, 2 double-verified
var isoDate = new Date().toISOString();
var virus = "SARS-CoV-2"*/




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