# daily-webgl-template

### /js/graphic/utils/ThreeGraphic.js  
Threejsのレンダラとカーソル管理（しょぼい）を持つ。  
シーンをコンストラクタに突っ込めば、シーンが表示される。

### /js/graphic/scene/BaseScene.js  
ベースシーン。新しくThree.jsのシーンを作るときはこれを継承する。  
　　
- Updata()  
アニメーションを記述。  
- onTouchXX()  
  タッチされた時の処理を記述。引数にはCursor型が入る。　　
