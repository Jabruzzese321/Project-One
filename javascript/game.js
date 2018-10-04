var firstSecond = 2;
//grid object
var world = [
	{x : 
		{y : 
			{open : true,//for move refrance
			entity : {
				name: "Bones",
				art : 0,//art will be set into array and the number will allow us to call which we need. 0 is art for air
				mortal : false,// this is here for telling if you can attack something
				HP : 0,
				Str : 0,
				Int : 0,
				Wep : "Fist",
				Inv : [
					{name : "Fist",
					Atk : 1,
					Rng : 1,
					Equipt : true
					}
				]
			}
			}
		}
	}
]
//0 is air, 1 is player, 2 is wall, 3 is bad guy

function move(x,y,d){//x and y are relation to grid,,,, d is the arrow key direction.
	var altX = x;
	var altY = y;
	switch(d) {
		case 1:
			altY++;
			 break;
		case 2:
			altX++;
			 break;
		case 3:
			altY--;
			 break;
		case 4:
			altX--;
			 break;
	}

	//now we use altX/Y to check if spot is open

	if (world[0].x[altX].y[altY].open){
		(world[0].x[altX].y[altY]) = (world[0].x[x].y[y]);//player is cloned to new space
		(world[0].x[x].y[y].open) = true;
		(world[0].x[x].y[y].entity.art) = 0;
		(world[0].x[x].y[y].entity.mortal) = false;
		nextTurn();
	}
	else{//play bump sound to let user know something's wrong
		var audioElement = document.createElement("bump");
		audioElement.setAttribute("src", "assets/bump.mp3");
		
	}
}

function attackAim(x,y,r) { //we need to check all spots in range of players weapon
	//math to solve diagonal distance is to find the longer of x or y then to sub by 2 till you get to 1 or 0 counting how many times you do so the longer of x or y is then added to the number of times you had o subtract.
	for(var i = 0; i < 8; i++){
		var line = true;
		firstSecond = 2;
		var code = "";//will be used if not a line to create effeciant searching using the string as a signifer to find which direction the code will send the serch line next
		switch(i) {
			case 0://up
				line = true;
				code = "ux"
				y++;
			break;
			case 1://up right
				line = false;
				code = "ur"
				x++;
				y++;
			break;
			case 2://right
				line = true;
				code = "rx"
				x++;
			break;
			case 3://down right
				line = false;
				code = "dr"
				x++;
				y--;
			break;
			case 4://down
				line = true;
				code = "dx"
				y--;
			break;
			case 5://down left
				line = false;
				code = "dl"
				x--;
				y--;
			break;
			case 6://left
				line = true;
				code = "lx"
				x--;
			break;
			case 7://up left
				line = false;
				code = "ul"
				x--;
				y++;
			break;
		}
		attackAimLook(line,code,r,x,y);
	}
}

function attackAimLook(line,code,r,x,y){
	var read1 = code[0];
	var read2 = code[1];
	var step2 = line;

	if(r>0){//ends search if out of range
		return;
	}

	if(world[0].x[x].y[y].entity.mortal){//throw info to player attack list
		var xy = x+","+y; 
		var name = world[0].x[x].y[y].entity.name
		var b = $("<button>");
		b.position=xy;
		b.name=name;
		$("#attackList").append(b);
		return;
	}

	if(firstSecond%2==0){//if first and every other diagonal
		if(line==false){//and proven diagonal
			firstSecond++;//make the next time read the diagonal as a second
			r--;//reduce the range of search
			line = true;
			switch(read1) {
			case u://up
				y++;
			break;
			case r://right
				x++;
			break;
			case d://down
				y--;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y++;
				break;
				case r://right
				x++;
				break;
				case d://down
				y--;
				break;
				case l://left
				x--;
				break;
				}
				attackAimLook(line,read2,r,x,y);//we send read2 in place of code because of the new direction this line will take.
				line = false;//the x and y has been moved for next diagonal look
				attackAimLook(line,code,r,x,y);
		}line = step2;//return line to first state
	}

	else if(line==false){// if second diagonal sub by 2 then send next wave
		firstSecond++;
		r--;
		line = true;
		switch(read1) {
			case u://up
				y++;
			break;
			case r://right
				x++;
			break;
			case d://down
				y--;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y++;
				break;
				case r://right
				x++;
				break;
				case d://down
				y--;
				break;
				case l://left
				x--;
				break;
				}
				attackAimLook(line,read2,r,x,y);
				line = false;//the x and y has been moved for next diagonal look
				attackAimLook(line,code,r,x,y);
	}line = step2;//return line to first state

	if(line){// if an up right left down direction
		r--;
		switch(read1) {
			case u://up
				y++;
				attackAimLook(line,code,r,x,y);
			break;
			case r://right
				x++;
				attackAimLook(line,code,r,x,y);
			break;
			case d://down
				y--;
				attackAimLook(line,code,r,x,y);
			break;
			case l://left
				x--;
				attackAimLook(line,code,r,x,y);
			break;
		}
	}

}