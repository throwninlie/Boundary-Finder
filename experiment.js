        
function move(can_see,hex_on,hex_size,hexTiles,ctx){
	//redraw hexes
	

		var hex_on_center;
		var adj_hexes = find_hex_in_range(can_see,hex_on, hexTiles);
		for(var i =0; i < adj_hexes.length; i++){
			hex_on_center = hexTiles[adj_hexes[i].q.toString() + 'q'+adj_hexes[i].r.toString()+'r'].center;
			hexTiles[adj_hexes[i].q.toString() +'q'+ adj_hexes[i].r.toString()+'r'].visible = true;
	
			drawHexTile(ctx,hex_size,hex_on_center,'white',true);
		}
		
		
		/*
		var move_hexes = find_cube_ring(can_move,hex_on,hexTiles);
		
		for(var j =0 ; j < move_hexes.length; j++){
			//console.log(move_hexes[i]);
			hex_on_center = hexTiles[move_hexes[j].q.toString() +'q'+ move_hexes[j].r.toString()+'r'].center;
			if(!hexTiles[move_hexes[j].q.toString() +'q'+ move_hexes[j].r.toString()+'r'].visible){
				drawHexTile(ctx,hex_size,hex_on_center,'red');
				
			}else{
				//when lost
			}
			hexTiles[move_hexes[j].q.toString() + 'q'+move_hexes[j].r.toString()+'r'].movable=true;
			
		}*/
	}


function draw_boundary(ctx){
	//normally x
	var y_prime_points =[405.675,
585.225000000000,
46.5750000000000,
1303.42500000000,
238.950000000000,
162,
508.275000000000,
290.250000000000,
662.175000000000,
469.800000000000,
1264.95000000000,
1213.65000000000,
97.8750000000000,
982.800000000000,
380.025000000000,
572.400000000000,
739.125000000000,
1252.12500000000,
572.400000000000,
1303.42500000000,
418.500000000000,
931.500000000000,
893.025000000000,
726.300000000000,
931.500000000000,
893.025000000000,
251.775000000000,
187.650000000000,
1316.25000000000,
251.775000000000];
	//normally y 
 	var x_prime_points = [99.2175277397511,
64.8800288773876,
136.899974847757,
584.849666030487,
66.6508075021354,
144.133856511374,
81.5049583595103,
31.5880105887308,
221.185548340468,
109.472431780607,
506.413392832864,
379.577412533338,
160.637063679911,
161.339951547158,
77.1905674826706,
56.1665219790715,
347.121229202330,
475.573142730477,
56.1665219790715,
584.849666030487,
107.528233505720,
159.271439412781,
171.944210865834,
340.916037704856,
159.271439412781,
171.944210865834,
54.4160401646045,
121.813259106540,
603.912637765784,
54.4160401646045];
	
	ctx.globalCompositeOperation= 'source-over' ;
	ctx.fillStyle = 'black';
	for(var i = 0; i < x_prime_points.length; i++){
		ctx.fillRect(y_prime_points[i],x_prime_points[i],5,5);
	}
}