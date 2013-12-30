function Map(canvas) {
  
    this.Hexes = Array();
    
    this.Zoom = 1.0;
    this.X = 0;
    this.Y = 0;
    this.HexSize = 100;
    this.HexSide = this.HexSize / Math.sqrt(3);
    this.HexSpace = (this.HexSize - this.HexSide) / 2;
    
    this.GetAdjustedHexSize =  function() {
        return this.HexSize * this.Zoom;
    }
    this.GetAdjustedHexSide = function() {
        return this.HexSide * this.Zoom;
    }
    this.GetAdjustedHexSpace = function() {
        return this.HexSpace* this.Zoom;
    }
    
    
    this.Canvas = canvas;
    this.Render = function(canvas) {
        var context = this.Canvas.getContext('2d');
        context.clearRect (0 , 0 , this.Canvas.width , this.Canvas.height );

        for(var i = 0; i < this.Hexes.length; i++) {
            for(var j = 0; j < this.Hexes[i].length; j++) {
                var hex = this.Hexes[i][j];
                hex.Render(context);
            }
        }
    };
    
    this.Hover = function(x,y) {
        for(var i = 0; i < this.Hexes.length; i++) {
            for(var j = 0; j < this.Hexes[i].length; j++) {
                var hex = this.Hexes[i][j];
                hex.Hover = hex.ContainsPixel(x,y);
            }
        }
        this.Render();
    }
    
    this.AdjustLocation = function(change_x, change_y) {
        this.X += change_x;
        this.Y += change_y;
        this.Render();
    }
    
    for(var i = 0; i < 15; i++) {
        this.Hexes[i] = Array();
        for(var j = 0; j < 17; j++) {
            var hex =  new MapHex(this);
            hex.Column =i;
            hex.Row = j;
            this.Hexes[i][j] = hex;
        }
    }
};

function MapHex(map) {
    this.Map = map;
    this.Column = 0;
    this.Row = 0;
    
    this.Level = 0;
    
    this.Hover = false;
    this.Selected = false;


    this.GetX = function() {
        return this.Map.X  + (this.Column * ((this.Map.GetAdjustedHexSide() + this.Map.GetAdjustedHexSpace())));
    }
    
    this.GetY = function() {
        var y = this.Map.Y + ((this.Map.GetAdjustedHexSize() * this.Row));
        if((this.Column+1)%2===0) {
            y += this.Map.GetAdjustedHexSize()/2;
        }
        return y;
    }
    
    this.ContainsPixel = function(pixel_x,pixel_y) {
        var x = this.GetX();
        var y = this.GetY();
        var size = this.Map.GetAdjustedHexSize();
        var space = this.Map.GetAdjustedHexSpace();
        var side = this.Map.GetAdjustedHexSide();
        if(pixel_y >= y && pixel_y <= (y + size) &&
            pixel_x >= x && pixel_x <= (x + size)) {
                
            if(pixel_x >= (x + space)) {
                if(pixel_x <= (x + space + side)) {
                    return true;
                } else {
                    if(pixel_y < (y + (size/2))) {
                        var x_ratio = (size /2) / (pixel_x - x);
                        var y_ratio = (space) / (pixel_y - y);
                        if(x_ratio>=y_ratio) {
                            return true;
                        }
                        
                    } else if(pixel_y > (y + (size/2))) {
                    
                    } else {
                        return true;
                    }
                }     
            } else {
                if(pixel_y < (y + (size/2))) {
                    var x_ratio = (pixel_x - x) / (size /2);

                } else if(pixel_y > (y + (size/2))) {
                
                } else {
                    return true;
                }
            }
        }
        return false;
    }
    
    this.Render = function(canvas) {
        var size = this.Map.GetAdjustedHexSize();

        var x = this.GetX();
        var y = this.GetY();

        var side = this.Map.GetAdjustedHexSide();
        var space = this.Map.GetAdjustedHexSpace();

        canvas.beginPath();
        
        canvas.moveTo(x, y + (size /2));
        
        canvas.lineTo(x + space, y);
        canvas.lineTo(x + side + space, y);

        canvas.lineTo(x + size, y + (size/2));

        canvas.lineTo(x + side + space, y + size);
        canvas.lineTo(x + space, y + size);

        canvas.closePath();
        if(this.Hover) {
            canvas.fillStyle = '#ccc';
            canvas.fill();
        }
        if(this.Selected) {
            canvas.fillStyle = '#0f0';
            canvas.fill();
        }
        
        canvas.stroke();
        
        canvas.fillStyle = '#000';
        var font_height = 20 * this.Map.Zoom;
        
        canvas.font=font_height + "px Monotype";
        var location_code ="";
        if(this.Column <9) {
            location_code += "0";
        }
        location_code += (this.Column+1);
        if(this.Row <9) {
            location_code += "0";
        }
        location_code += (this.Row+1);
        
        canvas.fillText(location_code,x + (this.Map.Zoom * 30),y + (this.Map.Zoom * 20));

    };
    
};