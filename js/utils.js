
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

function drawX(ctx,x,y){
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(x-20,y-20);
	ctx.lineTo(x+20,y+20);
	ctx.moveTo(x+20,y-20);
	ctx.lineTo(x-20,y+20);
	ctx.stroke();
		
}

function drawHexTile(ctx,center){
	var size = 25;
	var corners = hex_corner(center,size);
	ctx.beginPath();
	for ( var i =0; i < corners.length; i++){
		if(i == 0){
			ctx.moveTo(corners[i].x,corners[i].y);
		}
		else{
			ctx.lineTo(corners[i].x,corners[i].y);
		}	
	}
	ctx.stroke();
	
}

function hex_corner(center, size){
	var points = [];
	for (var i = 0; i < 5; i++) { 
    	var angle_deg = 60 * i ;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	points.push(new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad)));
	}	
	return points;	 
}