//
// 棋譜共通処理
//

var ie6 = (navigator.userAgent.indexOf('MSIE 6.0') >= 0);
var ie7 = (navigator.userAgent.indexOf('MSIE 7.0') >= 0);
var ie8 = (navigator.userAgent.indexOf('MSIE 8.0') >= 0);

var nsArray = new Array();
var nsIndex = -1;// -1 っすか。
var nsInter;
var nsDraw;
var nsSoundEnabled = false;
var nsSoundRequest = false;
var nsSoundName = null;
var nsAudio = null;
var nsAudioIndex = 0;
var nsType;
var nsSpeedCounter = 0;
var nsSpeedCoeff   = 2;
var nsInitialField = "1b191716101617191b0014000000000012001d1d1d1d1d1d1d1d1d"
					 + "0000000000000000000000000000000000000000000000000000000"
					 + "e0e0e0e0e0e0e0e0e0003000000000005000c0a08070207080a0c00";
					 
// 漢数字(0,1...18)
digitCN = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九",
  "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八"];

// 全角数字(0,1...9)
digitJP = ["", "１", "２", "３", "４", "５", "６", "７", "８", "９"];

komaJP = ["","", "玉", "飛","龍", "角", "馬","金", "銀", "全", "桂",
              "圭", "香", "杏", "歩", "と"];

// 棋譜読み込み



function Start(name, type){
	// ブラウザチェック
	//if ( ie6 ){
	//	alert('Internet Explorer 6 以下には対応していません');
	//	return;
	//}

	// 棋譜
//	var d = name.match(/^[0-9]{8}$/);
//	var t = type.match(/^[is]$/);
//	var q = './score.cgi';
//	if ( (d != null) && (t != null) ){
//		q += '?d=' + d + '&t=' + t;
//	}
//	var q = '..data/';
	var q = name;
//	alert(q);
	var s = httpRead(q);
//	alert(s);
	nsArray = nsMakeScore(s);
	nsType  = 's';	

//	if ( nsArray.Title != null ){
	if ( nsArray.棋戦 != null ){
		nsSetInfo('sctitle', nsArray.棋戦);
		//nsSetInfo('scstage', nsArray.Stage);
//		var list = nsArray.Stage.split(' ');
//		nsSetInfo('scstage', list[0]);
//		if ( list.length >= 2 ){
//			nsSetInfo('scstage2', list[1]);
//		}
//		if ( nsArray.Notify != null ){
//			nsSetInfo('scnotify', nsArray.Notify);
//		}
//		if ( nsArray.Notify != null ){
//			nsSetInfo('scnotify2', nsArray.Notify2);
//		}
	}
	else{
		nsSetInfo('sctitle', 'の棋譜はありません');
		nsSetInfo('scstage', '');
	}
	nsSetInfo('scyear',  nsArray.開始日時);
	//nsSetInfo('scmonth', nsArray.OnAir.substr(4, 2));
	//nsSetInfo('scday',   nsArray.OnAir.substr(6, 2));
//	var p1 = nsSplitName(nsArray.Player1);
//	var p2 = nsSplitName(nsArray.Player2);
//	nsSetInfo('p1name',  '▲' + p1.familyname + p1.firstname + ' ' + p1.title);
	nsSetInfo('p1name',  '▲' + nsArray.先手);
	//nsSetInfo('p1title', p1.title);
	//nsSetInfo('p1title2', p1.title2);
//	nsSetInfo('p2name', '△'+ p2.familyname + p2.firstname + ' ' + p2.title);
	nsSetInfo('p2name', '△'+ nsArray.後手);
	//nsSetInfo('p2title', p2.title);
	//nsSetInfo('p2title2', p2.title2);
	
}


// 打音セット
function nsSetSound(name){
	if ( Audio ){
		nsAudio = new Array();
		for ( var i = 0; i < 8; i++ ){
			var audio = new Audio(name);
			audio.preload  = 'auto';
			audio.autoplay = false;
			audio.load();
			nsAudio.push(audio);
		}
	}
	else{
		nsSoundName = name;
	}
}

function nsSoundToggle(elem){
	nsSoundEnabled = elem.checked;
}

// 情報をセット
function nsSetInfo(id, value){
	var e = document.getElementById(id);
	if ( e != null ){
		e.innerText = value;
		e.textContent = value;
	}
}

// スピードセット
function nsSetSpeed(speed){
	nsSpeedCoeff = speed;
}

// 棋譜を配列に整形
function nsMakeScore(str){
	var res = new Array();
	res["buf"] = new Array();

	var list = str.split('\n');
	var idx = -1;
	var nsField = nsInitialField; var nsHand1=""; var nsHand2 = ""; var nsC = "";
	res.buf[idx] = new Array();
	res.buf[idx].p = nsInitialField; res.buf[idx].h1=""; res.buf[idx].h2 = ""; res.buf[idx].c = "";//idx=-1 のときから res 各要素は存在する。
	for ( var i = 0; i < list.length; i++ ){
		var s = list[i];
		if ( s.length > 0 ){
		//行先頭の空白を取り除く
			if (s.match(/^ */)){
				//s = s.replace(/^ */,"");//trimLeft でもいけるかな
				s = s.trimLeft(s);
			}
			
			if ( s.match(/^[1-9]|^[1-9][0-9]/)){//指し手行を抽出。１００行もこれでいける？
				
				//前処理
				s = s.replace("同　", "同");
				var pair1 = s.split(' ');//全角も拾うようだ
				idx = parseInt(pair1[0], 10) - 1;

//				if(idx > 0){
					nsField = res.buf[idx-1].p; nsHand1 = res.buf[idx-1].h1; nsHand2 = res.buf[idx-1].h2; nsC = "";
//				}

				//前処理　１文字化
				pair1[1] = pair1[1].replace("成香", "杏");
				pair1[1] = pair1[1].replace("成桂", "圭");
				pair1[1] = pair1[1].replace("成銀", "全");
				pair1[1] = pair1[1].replace("王", "玉");
				pair1[1] = pair1[1].replace("竜", "龍");
				pair1[1] = pair1[1].replace("歩成", "と");
				pair1[1] = pair1[1].replace("香成", "杏");
				pair1[1] = pair1[1].replace("桂成", "圭");
				pair1[1] = pair1[1].replace("銀成", "全");
				pair1[1] = pair1[1].replace("角成", "馬");
				pair1[1] = pair1[1].replace("飛成", "龍");
				pair1[1] = pair1[1].replace("不成", "");
				
				//alert(pair1[1]);
				if(pair1[1].indexOf("(") != -1){//移動した場合の()内の駒を消す
				    var i1 = parseInt(pair1[1].substr(pair1[1].indexOf("(") + 1, 1));
    				var i0 = parseInt(pair1[1].substr(pair1[1].indexOf("(") + 2, 1));
    				nsField = nsField.substr(0,(9*(i0-1) + i1-1)*2) + "00" +nsField.substr(((i0-1)*9 + i1-1)*2 +2);
    				//alert(nsField);
   				}


   				if(jp2num(pair1[1].charAt(0)) != 0){//数字の時
   					var i1 = jp2num(pair1[1].charAt(0));
   					var i0 = cn2num(pair1[1].charAt(1));
   					
   					var k1 = nsField.charAt((9*(i0-1) + i1-1)*2);
   					var k0 = nsField.charAt((9*(i0-1) + i1-1)*2 +1);
   					if((k1 + k0) != '00'){
   						if(k1 == 1){
   							if(k0 == '3'|| k0 == '5'|| k0 == '8'|| k0 == 'a'|| k0 == 'c'|| k0 == 'e'){
   								nsHand1 += '0' +(parseInt((k1 + k0),16)-1 - 0x0f).toString(16);
   							}else{
   								nsHand1 += '0' +(parseInt((k1 + k0),16) - 0x0f).toString(16);
   							}
   						}else{
   							if(k0 == '4'|| k0 == '6'|| k0 == '9'|| k0 == 'b'|| k0 == 'd'|| k0 == 'f'){   							
   								nsHand2 += (parseInt((k1 + k0),16)-1 + 0x0F).toString(16);
   							}else{
   								nsHand2 += (parseInt((k1 + k0),16) + 0x0F).toString(16);
   							}
   						}
   					}
   					
   					var j = koma2num(pair1[1].charAt(2)).toString(16);
   					if((parseInt(idx) % 2) == 1){
   						j = (parseInt(j, 16) + 15).toString(16);//後手番？
   					}
   					
   					if (j.length == 1){
   						j = "0" + j
   					}
   					
   					if(pair1[1].indexOf('打') !== -1){
   						if(j.charAt(0) == 0){//先手番
   							nsHand1 = nsHand1.replace(j, '');
   						}else{//後手番
  							nsHand2 = nsHand2.replace(j, '');
   						}
   					}
   					
   					nsField = nsField.substr(0,(9*(i0-1) + i1-1)*2) + j +nsField.substr(((i0-1)*9 + i1-1)*2 +2);
   					nsField = nsField.substr(0, nsField.length - 2) + i1.toString(10) + i0.toString(10);
   				}

				if(pair1[1].charAt(0)=='同'){
   					var i1 = parseInt(nsField.charAt(nsField.length -2));
   					var i0 = parseInt(nsField.charAt(nsField.length -1));

  					var k1 = nsField.charAt((9*(i0-1) + i1-1)*2);
   					var k0 = nsField.charAt((9*(i0-1) + i1-1)*2 +1);
   					if((k1 + k0) != '00'){
   						if(k1 == 1){
   							if(k0 == '3'|| k0 == '5'|| k0 == '8'|| k0 == 'a'|| k0 == 'c'|| k0 == 'e'){
   								nsHand1 += '0' +(parseInt((k1 + k0),16)-1 - 0x0f).toString(16);
   							}else{
   								nsHand1 += '0' +(parseInt((k1 + k0),16) - 0x0f).toString(16);
   							}
   						}else{
   							if(k0 == '4'|| k0 == '6'|| k0 == '9'|| k0 == 'b'|| k0 == 'd'|| k0 == 'f'){   							
   								nsHand2 += (parseInt((k1 + k0),16)-1 + 0x0F).toString(16);
   							}else{
   								nsHand2 += (parseInt((k1 + k0),16) + 0x0F).toString(16);
   							}
   						}
   					}

   					var j = koma2num(pair1[1].charAt(1)).toString(16);
   					if((parseInt(idx) % 2) == 1){
   						j = (parseInt(j, 16) + 15).toString(16);
   					}
   					
   					if (j.length == 1){
   						j = "0" + j
   					}
   					nsField = nsField.substr(0,(9*(i0-1) + i1-1)*2) + j +nsField.substr(((i0-1)*9 + i1-1)*2 +2);
   					nsField = nsField.substr(0, nsField.length -2) + i1.toString(10) + i0.toString(10);					
				}
				
				res.buf[idx] = new Array();				
				res.buf[idx].p = nsField;
				res.buf[idx].h1 = nsHand1;
				res.buf[idx].h2 = nsHand2;
				res.buf[idx].c = nsC;

			}else if(s.charAt(0) == '*'){
				//if( idx == -1){
				//	res.buf[idx] = new Array();
				//	res.buf[idx].p = nsInitialField; res.buf[idx].h1=""; res.buf[idx].h2 = "";
				//}
				s = s.slice(1);
				res.buf[idx].c += s;
				//alert(res.buf[idx].c);
			}else if((s.charAt(0) != '*') && (s.indexOf('：') != -1)){
				var pairinfo = s.split('：');
				var nameinfo = pairinfo[0];
				var valueinfo = pairinfo[1];//.replace("\r","");
				res[nameinfo] = valueinfo;
				//alert(nameinfo + "：" + valueinfo);
			}else{
				//行スキップ
			}
		}
		if(idx >= -1){
			//alert("idx=" + idx + " " + res.buf[idx].p + " " + res.buf[idx].c);
		}
	}//for loop?
	return res;
}

// index 番目の手番へ
function nsSetIndex(draw, index){
	nsDraw = draw;
	if (index != nsIndex){
		nsIndex = index;

		// 描画
		if ( nsIndex >= 0 ){
			if ( nsType == 'i' ){
				// 囲碁の場合はそのまま
				draw(nsArray.buf[nsIndex]);
				nsSound();
			}
			else{
				// 将棋の場合は遅延描画
				draw((nsIndex > 0)? nsArray.buf[nsIndex - 1]: null);
				nsAnalyzeMarkPos(nsArray.buf[nsIndex].p,
								 (nsIndex > 1)? nsArray.buf[nsIndex- 1].p: nsInitialField);
				setTimeout("nsDelayDraw()", 500);
			}
		}
		else{
			//draw(null);
			draw(nsArray.buf[-1]);
			cmMoveMark(0, 0);
		}

		// ステップ数表示
		var s = '';
		if ( (nsType == 'i') && (nsIndex >= nsArray.buf.length - 1) ){
			s = nsIgoResult();
		}
		else if ( nsIndex >= 0 ){
			s = (nsIndex + 1) + '手目';
		}
		nsSetInfo('move', s);//修正
	}
}



// 結果を文字列に変換
function nsShogiResult(){
	var res = (nsIndex + 1) + '手　';
	
	
	
	
	switch ( nsArray.Result ){
	case '1':
		var p1 = nsSplitName(nsArray.Player1);
		res += '先手　' + nsArray.先手 +  'の勝ち';
		break;
	case '2':
		var p2 = nsSplitName(nsArray.Player2);
		res += '後手　' + nsArray.後手 +  'の勝ち';
		break;
	default:
		res = '　';
	}

	return res;
}

// 姓名・タイトルを取得
function nsSplitName(text){
	var res = new Array();
	var p = text.split(' ');

	res.familyname = p[0];
	res.firstname  = '';
	res.title      = '';
	res.title2     = '';
	switch ( p.length ){
	case 2:
		res.title = p[1];
		break;
	case 3:
		res.firstname = p[1];
		res.title = p[2];
		break;
	case 4:
		res.firstname = p[1];
		res.title = p[2];
		res.title2 = p[3];
		break;
	}

	return res;
}

// 再生
function nsPlay(draw){
	var src = '';
	if ( nsInter == null ){
		nsDraw = draw;
		// 最初は即座に描画
		nsInterval();
		// タイマーセット
		nsInter = setInterval("nsInterval()", 1200);
		src = "../img/move_item05a.png";
	}
	else{
		clearInterval(nsInter);
		nsInter = null;
		src = "../img/move_item05.png";
	}
	var e = document.getElementById('playbutton');
	e.src = src;
}

// 自動再生処理
function nsInterval(){
	if ( ++nsSpeedCounter >= nsSpeedCoeff ){
		nsStep(nsDraw, 1);
		if ( nsIndex >= nsArray.buf.length - 1 ){
			clearInterval(nsInter);
			var e = document.getElementById('playbutton');
			e.src = "../img/move_item05.png";
		}
		nsSpeedCounter = 0;
	}
}

// 一時停止
function nsPause(){
	clearInterval(nsInter);
}

// n手進める
function nsStep(draw, n){
	if ( nsSoundEnabled ){
		nsSoundRequest = true;
	}
	nsSetIndex(draw, Math.min(nsIndex + n, nsArray.buf.length - 1));
}

// n手戻す
function nsBack(draw, n){
	nsSetIndex(draw, Math.max(nsIndex - n, -1));
}

// 先頭へ
function nsHead(draw){
	nsSetIndex(draw, -1);
}

// 末尾へ
function nsTail(draw){
	nsSetIndex(draw, nsArray.buf.length - 1);
}

// マーカー位置計算
function nsAnalyzeMarkPos(curr, prev){
	var x0 = 0;
	var y0 = 0;
	if ( (curr != null) && (prev != null) ){
		var x1 = parseInt(curr.substr(81 * 2,     1));
		var y1 = parseInt(curr.substr(81 * 2 + 1, 1));
		var pos1 = (x1 - 1) + (y1 - 1) * 9;
		for ( var i = 0; i < 81; i++ ){
			if ( (curr.substr(i * 2, 2) != prev.substr(i * 2, 2)) && (i != pos1) ){
				x0 = (i % 9) + 1;
				y0 = Math.floor(i / 9) + 1;
				break;
			}
		}
	}
	cmMoveMark(x0, y0);
}

// マーカー移動描画
function nsDelayDraw(){
	// マーカー移動
	if ( nsIndex >= 0 ){
		nsDraw(nsArray.buf[nsIndex]);
		nsSound();
	}

	// 将棋の最終結果遅延表示
	if ( (nsType != 'i') && (nsIndex >= nsArray.buf.length - 1) ){
		// 最終手の移動完了と同時に表示
		nsSetInfo('move', nsShogiResult());
		// 最終手の移動完了よりさらに遅らせる場合
		//var s = "nsSetInfo('bante', '" + nsShogiResult() + "')";
		//setTimeout(s, 500);
	}
}

// 音
function nsSound(){
	if ( nsSoundRequest ){
		if ( nsAudio != null ){
			nsAudio[nsAudioIndex].play();
			nsAudioIndex = (nsAudioIndex + 1) % nsAudio.length;
		}
		else if ( nsSoundName != null ){
			var e = document.getElementById('sound2');
			if ( e != null ){
				e.innerHTML = '<embed id="sound2embed" src="'
							  + nsSoundName
							  + '" autostart="true" hidden="true">';
			}
		}
		nsSoundRequest = false;
	}
}

function nsSearch(){
	alert('未実装です\n'+'この局面は\n'+ nsArray.buf[nsIndex].p +'\nです。\n全文検索がんばりましょう!');
}

// 全角数字(１...９)を数字(1...9)に変換する
// 1...9も許容する(そのまま返す)
function jp2num(str)
{
	for (var i = 1; i <= 9; i++) {
		if ((str == digitJP[i]) || (i == str)) {
			return i;
		}
	}
	return 0;
}

// 漢数字(一...十八)を数字(1...18)に変換する
// 1...9も許容する(そのまま返す)
function cn2num(str)
{
	for (var i = 1; i <= 18; i++) {
		if ((str == digitCN[i]) || (i == str)) {
			return i;
		}
	}
	return 0;
}

function koma2num(str)
{
	for (var i = 2; i <= 15; i++) {
		if (str == komaJP[i]) {
			return i;
		}
	}
	return 0;
}

