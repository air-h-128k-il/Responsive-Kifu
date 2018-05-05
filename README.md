## Responsive-Kifu
### 経緯 
ブログ上で将棋の棋譜を再生したいと思い、適当なソフトを探していました。
[Kifu for Flash](http://kakinoki.o.oo7.jp/kifuf.html)が有名ですが、Flash を用いているため iPhone や Android では表示すらされず、導入見送り。
[JS For Kifu](https://github.com/na2hiro/Kifu-for-JS) も試してみましたが、ライブラリ依存の部分が理解できず、レイアウトの調整がうまくいきませんでした。
物色していたところ、[NHK杯の棋譜再生サイト](http://cgi2.nhk.or.jp/goshogi/kifu/sgs.cgi)の JavaScript がシンプルながら出来がよく、これを改変することにしました。

### 特徴
元の JavaScript が 100% ピュア javascript であったため、Responsive-Kifu もその特徴を受け継いでいます。
機能は乏しいですが、その代わり改変が比較的容易だと思います。

再生できる形式が nkif 形式（NHKサイトで利用されているフォーマット。勝手に命名）のみであったため、kif 形式が読み込めるように改変しました。

不完全ですが、レスポンシブ対応にしました。画面の拡大・縮小に合わせ、駒・駒盤などの大きさも変わると思います。
より最適化を目指す場合は css ファイルで調整してください。

### その他
紹介記事は[ブログ](http://phazor.org/air/?p=907)に書いてあります。
実際の使用例は、[アゲアゲさんの名局をブログで再現してみる](https://phazor.info/air/?p=976)などをご覧ください。

 Enjoy your shogi life!
