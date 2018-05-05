//
// 将棋棋譜描画処理
//


var baseX = 0;
var baseY = 0;
var ratio = 1.0
var pieceW = 36.1;
var pieceW2 = 36.1;
var pieceH = 39.3;
var pieceH2 = 39.3;
var handH1 = 35.3;
var handH2 = 35.3;
var handH12 = 35.3;
var handH22 = 35.3;
var handCount = 38;
var markX = -1;
var markY = -1;
var markW = 36.0;
var markH = 39.0;
var markW2 = 36.0;
var markH2 = 39.0;
var sgPicNames = new Array(
		'emp',
		'ou0', 'gy0', 'hi0', 'ry0', 'ka0', 'um0',
		'ki0', 'gi0', 'gn0', 'ke0', 'kn0', 'ky0', 'kyn0', 'fu0', 'to0',
		'ou1', 'gy1', 'hi1', 'ry1', 'ka1', 'um1',
		'ki1', 'gi1', 'gn1', 'ke1', 'kn1', 'ky1', 'kyn1', 'fu1', 'to1',
		'mark'
);
var sgPic = new Array();

// 初期化
function sgInit(){
	var parent = document.getElementById('board');
	sgResetCoord(parent);


	for ( var i = 0; i < sgPicNames.length; i++ ){
		var name = sgPicNames[i];
		sgPic[name] = new Image();
//		if ( ie6 ){
//			sgPic[name].src = 'img/pieces2/' + name + '.gif';
//		}
//		else{
			sgPic[name].src = '../img/pieces/' + name + '.png';
//		}
	}

	// マーカー追加
	var e = document.createElement('img');
	e.id  = 'mark';
	e.src = sgPic.mark.src;
	e.alt = '';
	e.width  = 35;
	e.height = 38;
	if(window.innerWidth<620){
		e.width=35*(window.innerWidth/620);e.height=38*(window.innerWidth/620);
	}
	e.style.position = 'absolute';
	sgShowMark(e);
	parent.appendChild(e);

	// 盤面の表示位置
	ratio=1.0;
	if(window.innerWidth<620){
		ratio=window.innerWidth/620;
		pieceW2=pieceW*ratio;pieceH2=pieceH*ratio;
		handH12=handH1*ratio;handH22=handH2*ratio;
	}
	for ( var i = 0; i < 81; i++ ){
		var e = document.createElement('img');
		e.id  = 'g' + i;
		e.src = sgPic.emp.src;
		e.alt = '';
		e.width  = 36;
		e.height = 43;
		if(window.innerWidth<620){
			e.width=36*ratio;e.height=43*ratio;
		}
		e.style.position = 'absolute';
	  e.style.left = baseX + ((8 - i % 9) * pieceW2) + 'px';
//	  if(window.innerWidth < 900){
//	  	e.style.left = (baseX + ((8 - i % 9) * pieceW)) * (window.innerWidth/900) + 'px';
//	  }

	  e.style.top  = baseY + (Math.floor(i / 9) * pieceH2) + 'px';
		parent.appendChild(e);
	}
	// 持駒の表示位置
	for ( var i = handCount - 1; i >= 0; i-- ){
		var e = document.createElement('img');
		e.id  = 'ga' + i;
		e.src = sgPic.emp.src;
		e.alt = '';
		e.width  = 36*ratio;
		e.height = 43*ratio;
		e.style.position = 'absolute';
		e.style.left = baseX + 345*ratio + ((i % 3) * pieceW2) + 'px';
		e.style.top  = baseY + 255*ratio + (Math.floor(i / 3) * handH12) + 'px';   
		parent.appendChild(e);
	}
	// 持駒の表示位置
	for ( var i = handCount - 1; i >= 0; i-- ){
		var e = document.createElement('img');
		e.id  = 'gb' + i;
		e.src = sgPic.emp.src;
		e.alt = '';
		e.width  = 36*ratio;
		e.height = 43*ratio;
		e.style.position = 'absolute';
    	e.style.left = baseX - 60*ratio - ((i % 3) * pieceW2) + 'px';
		e.style.top  = baseY + 60*ratio - (Math.floor(i / 3) * handH22) + 'px';
		parent.appendChild(e);
	}

	sgClear();
}



// リサイズ時処理
function sgResize(){
	var parent = document.getElementById('board');
	sgResetCoord(parent);

	sgShowMark(null);

	// 盤面の表示位置、駒大きさ、マーク大きさ
	ratio = 1.0;
	if(window.innerWidth < 620){
		ratio=window.innerWidth/620;
		pieceW2=pieceW*ratio;
		pieceH2=pieceH*ratio;
		handH12=handH1*ratio;handH22=handH2*ratio;
		markW2=markW*ratio;markH2=markH*ratio;
		sgShowMark(null);
	}
	
	for ( var i = 0; i < 81; i++ ){
		var e = document.getElementById('g' + i);
  		e.style.left = baseX + ((8 - i % 9) * pieceW2) + 'px';
  		e.width=36*ratio;e.height=43*ratio;
		e.style.top  = baseY + (Math.floor(i / 9) * pieceH2) + 'px';
	}

	
	// 持駒の表示位置
	for ( var i = 0; i < handCount; i++ ){
		var e = document.getElementById('ga' + i);
		e.width=36*ratio;e.height=43*ratio;
		e.style.left = baseX + 345*ratio + ((i % 3) * pieceW2) + 'px';
		e.style.top  = baseY + 255*ratio + (Math.floor(i / 3) * handH12) + 'px';
	}
	// 持駒の表示位置
	for ( var i = 0; i < handCount; i++ ){
		var e = document.getElementById('gb' + i);
		e.width=36*ratio;e.height=43*ratio;
		e.style.left = baseX - 60*ratio - ((i % 3) * pieceW2) + 'px';
		e.style.top  = baseY + 60*ratio - (Math.floor(i / 3) * handH22) + 'px';
	}
}

// 座標再設定
function sgResetCoord(parent){
 baseX = 138;//修正
 baseY = 25.5;//修正
 if(window.innerWidth < 620){
	baseX = 138 * (window.innerWidth/620);
	baseY = 25.5 * (window.innerWidth/620);
 }	
}

// クリア
function sgClear(){
	for ( var i = 0; i < 81; i++ ){
		var n = 'emp';
		switch ( i ){
			case 0: n = 'ky1'; break;
			case 1: n = 'ke1'; break;
			case 2: n = 'gi1'; break;
			case 3: n = 'ki1'; break;
			case 4: n = 'ou1'; break;
			case 5: n = 'ki1'; break;
			case 6: n = 'gi1'; break;
			case 7: n = 'ke1'; break;
			case 8: n = 'ky1'; break;
			case 10: n = 'ka1'; break;
			case 16: n = 'hi1'; break;
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26: n = 'fu1'; break;
			case 54:
			case 55:
			case 56:
			case 57:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62: n = 'fu0'; break;
			case 64: n = 'hi0'; break;
			case 70: n = 'ka0'; break;
			case 72: n = 'ky0'; break;
			case 73: n = 'ke0'; break;
			case 74: n = 'gi0'; break;
			case 75: n = 'ki0'; break;
			case 76: n = 'gy0'; break;
			case 77: n = 'ki0'; break;
			case 78: n = 'gi0'; break;
			case 79: n = 'ke0'; break;
			case 80: n = 'ky0'; break;
		}
		var e = document.getElementById('g' + i);//g0 とかが位置かな
		e.src = sgPic[n].src;
	}
	for ( var i = 0; i < handCount; i++ ){
		var e;
		e = document.getElementById('ga' + i);
		e.src = sgPic.emp.src;
		e = document.getElementById('gb' + i);
		e.src = sgPic.emp.src;
	}
}

// 描画
function sgDraw(item){
	if ( item == null ){
		sgClear();
	}
	else{
		// 盤面表示
		var s = item.p;//
		//alert(item.p);
		for ( var i = 0; i < 81; i++ ){
			var e = document.getElementById('g' + i);
			var t = parseInt(s.substr(i * 2, 2), 16);//substr(a,b) aの位置からb文字切り出す。parseInt(a,16) a を１６進数で解釈し、１０進数で返す。
			//alert(t);
			if ( t <= 31 ){
				e.src = sgPic[sgPicNames[t]].src;
			}
		}

		// マーク
		markX = parseInt(item.p.substr(81 * 2,     1));
		markY = parseInt(item.p.substr(81 * 2 + 1, 1));
		sgShowMark(null);

		// 持駒表示
		sgDrawHand(item.h1, 'ga');
		sgDrawHand(item.h2, 'gb');
		
		// コメント表示　item.c が null でなければ内容を表示
		var u = document.getElementById('comment');
		//alert(item.c);
		if (item.c){
			//alert(item.c);
			u.innerText = item.c;
			u.style.display = '';
		}else{
			u.innerText = "";
			//u.style.display = 'none';
		}
		
	}
}

// 持駒描画
function sgDrawHand(hand, id){
	var n = hand.length / 2;

	// 持駒の数によって表示間隔を調整
	if(window.innerWidth<620){
		ratio=window.innerWidth/620;
	}
	var h = (n <= 9)? 35.3*ratio: ((90*ratio) / Math.floor((n + 2) / 3));
	if ( id == 'ga' ){
		if ( handH1 != h ){
			handH1 = h;
			sgResize();
		}
	}
	else{
		if ( handH2 != h ){
			handH2 = h;
			sgResize();
		}
	}

	// 持駒を配列に入れて強さの順にソート
	var pa = new Array();
	for ( var i = 0; i < n; i++ ){
		pa[i] = parseInt(hand.substr(i * 2, 2), 16);
	}
	pa.sort(function(a, b){ return a - b; });

	// 持駒表示
	for ( var i = 0; i < handCount; i++ ){
		var e = document.getElementById(id + i);
		if ( i < n ){
			var t = pa[i];
			if ( t <= 31 ){
				e.src = sgPic[sgPicNames[t]].src;
			}
		}
		else{
			e.src = sgPic.emp.src;
		}
	}
}

function cmMoveMark(x, y){
	markX = x;
	markY = y;
	sgShowMark(null);
}

function sgShowMark(elem){
	var e = (elem != null)? elem: document.getElementById('mark');
	
	if(window.innerWidth < 620){
		ratio=window.innerWidth/620;
		markW2=markW*ratio;markH2=markH*ratio;
	}
	e.width=36*ratio;e.height=43*ratio;
	if ( (markX > 0) && (markY > 0) ){
		e.style.left = (baseX + (9 - markX) * markW2 + 1).toString() + 'px';
		e.style.top  = (baseY + (markY - 1) * markH2 + 4).toString() + 'px';
		e.style.display = '';
	}
	else{
		e.style.display = 'none';
	}
}

