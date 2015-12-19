
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
	var count = 0;
	for (var i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Cube(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
}

function Axial(q,r){
	this.q = q;
	this.r = r;
}

function HexTile(centerPoint, visible, movable,inferred){
	this.center = centerPoint;
	this.visible = visible;
	this.movable = movable;
	this.inferred = inferred;
}

function drawX(ctx,x,y){
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(x-20,y-20);
	ctx.lineTo(x+20,y+20);
	ctx.moveTo(x+20,y-20);
	ctx.lineTo(x-20,y+20);
	ctx.stroke();
		
}

function drawHexTile(ctx,size,center,fillColor,erase){

	var corners = hex_corner(center,size);
	if(erase){
		ctx.globalCompositeOperation= 'destination-out' ;
		ctx.lineWidth=2.3;
		//ctx.fillStyle = 'rgba(0,0,0,0)';
	}else{
		ctx.globalCompositeOperation= 'source-over' ;
		ctx.lineWidth=0.5;
	}
	ctx.beginPath();
	for ( var i =0; i < corners.length; i++){
		if(i == 0){
			ctx.moveTo(corners[i].x,corners[i].y);
		}
		else{
			ctx.lineTo(corners[i].x,corners[i].y);
		}	
	}
	ctx.lineTo(corners[0].x,corners[0].y);
	ctx.stroke();
	if(typeof(fillColor) != 'undefined'){
		if(typeof(erase) == 'undefined'){
			ctx.fillStyle = fillColor;
		}
		
    	ctx.fill();

	}
	
	
}

function hex_corner(center, size){
	var points = [];
	for (var i = 0; i < 6; i++) { 
    	var angle_deg = 60 * i ;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	points.push(new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad)));
	}	
	return points;	 
}

function even_q_to_cube(row,col){
	var x = col;
	var z = row - (col + (col &1)) / 2;
	var y = -x - z;
	return new Cube(x,y,z);
}

function cube_to_axial(cube){
	var q = cube.x;
	var r = cube.z;
	return new Axial(q,r);
}

function axial_to_cube(axial){
	var x = axial.q;
	var z = axial.r;
	var y = -x-z;
	return new Cube(x,y,z);
}
function cube_round(h){
    var rx = Math.round(h.x);
    var ry = Math.round(h.y);
    var rz = Math.round(h.z);

    var x_diff = Math.abs(rx - h.x);
    var y_diff = Math.abs(ry - h.y);
    var z_diff = Math.abs(rz - h.z);

	var rx,ry,rz;
    if  (x_diff > y_diff && x_diff > z_diff){
         rx = -ry-rz;
	}else if (y_diff > z_diff){
         ry = -rx-rz;
	} else{
        rz = -rx-ry;
	}
    return new Cube(rx, ry, rz);
	
}
function cube_direction(direction){
	var directions = [new Cube(+1, -1,  0), new Cube(+1,  0, -1), new Cube( 0, +1, -1),new Cube(-1, +1,  0), new Cube(-1,  0, +1), new Cube( 0, -1, +1)];
	
	return directions[direction];
}
function cube_add(hex,other_hex){
	var x = hex.x+other_hex.x;
	var y = hex.y +other_hex.y;
	var z = hex.z + other_hex.z;
	return new Cube(x,y,z);
}
function cube_neighbor(hex,direction){
	
	return cube_add(hex,cube_direction(direction));
	
}

function cube_scale(cube_dir,radius){
	var cube = new Cube(0,0,0);
	
	for(var i =0; i < radius; i++){
		cube = cube_add(cube,cube_dir);
	}
	
	return cube;
}

function find_hex_in_range(N,tile_center, hexTiles){
	var results = [];
	tile_center = axial_to_cube(tile_center);
	for (var dx = -N; dx <= N; dx++){
		for(var dy = Math.max(-N, -dx-N); dy <= Math.min(N, -dx+N); dy++){
			var dz = -dx-dy;
			var axial = cube_to_axial(cube_add(tile_center,new Cube(dx,dy,dz)));
			if(hexTiles[axial.q.toString() + 'q'+ axial.r.toString()+'r'] != undefined){
				results.push(axial);
			}
			
		}
	}
	return results;
}


function find_cube_ring(radius, tile_center, hexTiles){
	
    var results = [];
	
	tile_center = axial_to_cube(tile_center)
    var cube = cube_add(tile_center,cube_scale(cube_direction(4), radius));
	var axial;
    for(var i = 0; i < 6; i++){
        for(var rad = 0;rad < radius; rad++){
            axial = cube_to_axial(cube);
			if(hexTiles[axial.q.toString() + 'q'+axial.r.toString()+'r'] != undefined){
				results.push(axial);
			}
			
            cube = cube_neighbor(cube, i);
			
			
		}
	}
    return results;
}
	
function axial_round(h){
	return cube_to_axial(cube_round(axial_to_cube(h)));
}
function pixel_to_axial(hex_size,x,y){
	var q= (x * 2/3) / hex_size;
	var r = (-x /3 + Math.sqrt(3)/3 * y) / hex_size;
	return axial_round(new Axial(q,r));
}
function draw_hex_tiles(canvas,ctx,hex_size, rows, cols,color){
		
        var hex_width = hex_size*2;
        var hex_height = Math.sqrt(3)/2 * hex_width;
        var start = new Point(hex_size,hex_size+hex_height/2);
		
        //drawX(ctx,canvas_width/2, canvas_height/2);
		var hexTiles = new Object();
				
		
		
        for(var i = 0; i < cols; i++){
            for(var j = 0; j <rows; j++){
                var offset = 0;
                if(i % 2 == 1){
                     offset = hex_height /2;
                }
               
                var new_center = new Point(start.x + i*hex_width*3/4,start.y+j*hex_height-offset);
				var cube_coord  = even_q_to_cube(j,i);
				var axial_coord = cube_to_axial(cube_coord);
				//console.log(axial_coord.q.toString()+axial_coord.r.toString());
				//center point, visible boolean, valid move boolean
				hexTiles[axial_coord.q.toString()+ 'q' + axial_coord.r.toString() +'r'] = new HexTile(new_center,false,false,false);
                drawHexTile(ctx,hex_size,new_center,color);
            }
        }
		return hexTiles;
}