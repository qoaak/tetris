var canvas2 = document.getElementById('nextBlock');
var context2 = canvas2.getContext('2d');

//색상
context2.fillStyle = "#000";
// 가로축 x만큼 떨어져시작,세로축 y만큼 떨어져시작,넓이,높이 
context2.fillRect(0,0,canvas2.width,canvas2.height);

context2.scale(20,20);

function drawShape2(shape) {
	newBlockArr[j].forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				context2.fillStyle = colors[value];
				context2.fillRect(x+1,y+1,1,1);
			}
		});
	});
}

function splice() {
	
	for(var i =0; i <10; i++) {
		for(var j =0; j <10; j++) {
			
			context2.fillRect(i,j,1,1);
			context2.fillRect(0,0,1,1);
			context2.fillStyle = "#000";
		}
	}
	
}

drawShape2(newBlockArr[1]);

