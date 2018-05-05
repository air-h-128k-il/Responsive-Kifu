//
// 棋譜読み込み処理
//

function httpCreateRequest()
{
	var r;
	try{
		r = new XMLHttpRequest();
	}catch(e){
		try{
			r = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			r = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	return r;
}

// 初期化
function httpRead(url){
	var r = httpCreateRequest();
	r.open('GET', url, false);
	r.send(null);
	return r.responseText;
}

