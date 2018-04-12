var canvas = document.getElementById('tetris');
var context = canvas.getContext('2d');

//canvas의 크기 조절
context.scale(20,20);


function arenaSweep() {
	var rowCount = 1;
	outer: for(var y = arena.length - 1; y > 0; --y) {
		for(var x = 0; x < arena[y].length; ++x){
			if(arena[y][x] === 0) {
				continue outer;
			}
		}
		
		var row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;
		
		//점수 추가
		player.score += rowCount *100;
		
	}
}


function collide(arena, player) {
	var [m, o] = [player.shape, player.pos];
	for (var y = 0; y < m.length; ++y) {
		for (var x = 0; x < m[y].length; ++x) {
			if(m[y][x] !== 0 &&
				(arena[y + o.y] &&
				arena[y + o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false;
}

function createShape(w, h) {
	var shape = [];
	while(h--) {
		shape.push(new Array(w).fill(0));
	}
	return shape;
}

function createPiece(type) {
	if(type === 'T') {
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0],
		];
	} else if(type === 'O') {
		return [
			[2,2],
			[2,2],
		];
	} else if(type === 'L') {
		return [
			[0,3,0],
			[0,3,0],
			[0,3,3],
		];
	} else if(type === 'J') {
		return [
			[0,4,0],
			[0,4,0],
			[4,4,0],
		];
	} else if(type === 'I') {
		return [
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
		];
	} else if(type === 'S') {
		return [
			[0,6,6],
			[6,6,0],
			[0,0,0],
		];
	} else if(type === 'Z') {
		return [
			[7,7,0],
			[0,7,7],
			[0,0,0],
		];
	} 
}

function draw() {
	
	//색상
	context.fillStyle = "#000";
	// 가로축 x만큼 떨어져시작,세로축 y만큼 떨어져시작,넓이,높이 
	context.fillRect(0,0,canvas.width,canvas.height);
	
	//블록쌓기
	drawShape(arena, {x: 0, y: 0});
	
	drawShape(player.shape, player.pos);
}

function drawShape(shape, offset) {
	shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x,
								y + offset.y,
								1,1);
			}
		});
	});
}

function merge(arena, player) {
	player.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}


//블록 아래로 드롭시키기
function playerDrop () {
	player.pos.y++;
	var j = 0;
	if (collide(arena,player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
		splice();
		drawShape2(newBlockArr[j]);
		
		j++;
	}
	
	//아래 방향키 누를때마다 카운터 초기화
	dropCounter = 0;
}

//사용자의 블록이동, 블록들이 겹치지않도록
function playerMove(dir) {
	player.pos.x += dir;
	if(collide(arena, player)) {
		player.pos.x -= dir;
	}
}



	var newBlockArr = new Array();
	var pieces = 'ILJOTSZ';
function newBlock() {

	for(var i=0; i < 9999; i++) {
		newBlockArr[i] = init();
	}
}

function init(){
	return createPiece(pieces[pieces.length * Math.random() | 0]);
}



var j = 0;
//블록 랜덤 생성
function playerReset() {
	//player.shape = createPiece(pieces[pieces.length * Math.random() | 0])
	player.shape = newBlockArr[j++];
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) -
					(player.shape[0].length / 2 | 0);
	//블록이 가득차면 재시작
	if(collide(arena, player)) {
		//재시작할때 공간 지우기
		arena.forEach(row => row.fill(0));
		//재시작할때 점수 초기화
		player.score =0;
		updateScore();
	}
	
	//return nextShape;
}

//블록모양 변경
function playerRotate(dir) {
	var pos = player.pos.x;
	var offset = 1;
	rotate(player.shape, dir);
	//블록모양 변경시 벽에 끼이지않는 코딩
	while (collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if(offset > player.shape[0].length) {
			rotate(player.shape, -dir);
			player.pos.x = pos;
			return;
		}
	}
}



function rotate(shape, dir) {
	for(let y = 0; y < shape.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				shape[x][y],
				shape[y][x]
			] = [
				shape[y][x],
				shape[x][y],
			];
		}
	}
	if(dir > 0) {
		shape.forEach(row => row.reverse());
	} else {
		shape.reverse();
	}
}

var dropCounter = 0;
var dropInterval = 1000;

var lastTime = 0;
function update(time = 0) {
	
	//블록 떨어지는 시간설정
	var deltaTime = time - lastTime;
	lastTime = time;
	
	dropCounter += deltaTime;
	if(dropCounter > dropInterval) {
		playerDrop();
	}
	
	draw();
	requestAnimationFrame(update);
}

function updateScore() {
	document.getElementById('score').innerText = player.score;
}

var colors = [
	null,
	'red',
	'blue',
	'violet',
	'green',
	'purple',
	'orange',
	'pink'
];

var arena = createShape(12, 20);
var arena2 = createShape(5,5);

var player = {
		pos: {x: 0, y: 0},
		shape: null,
		score: 0
}

var info = {
		pos: {x: 0, y: 0},
		shape: null
}

document.addEventListener('keydown', event => {
	
	//왼쪽으로 이동
	if (event.keyCode === 37) {
		playerMove(-1);
	//오른쪽으로 이동
	} else if(event.keyCode === 39) {
		playerMove(1);
	//아래로 이동
	} else if(event.keyCode === 40) {
		playerDrop();
	//블록모양 변경
	} else if (event.keyCode === 38) {
		playerRotate(-1);
	} 
	
});

newBlock();
playerReset();
updateScore();
update();