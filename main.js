// 改めてみてみると，超巨大 init があってなかなかのクソコードだな
// 別に t-kihira を責めてるわけじゃないよ，それを丸々受け入れるしかない，
// 自分の雑魚さが憎いって話なんだよ

// キッモいフレーバーテキストを入れた readme を入れたい
// 全ては須く反転する，世界の流転の如く（激キモ）
// 世界って言い方がちょっとダサいよね，もうちょっと尖った言い回しないかしら
// 学振頑張ってかこか，そこで語彙力を上げていくという，完全なるミス

board = []

const init = () => {
    container = document.createElement('div')
    container.style.position = 'relative'
    document.body.appendChild(container)

    for (let i = 0; i < 3; i++) {
        board[i] = []
        for (let j = 0; j < 3; j++) {
            panel = document.createElement('div')
            panel.style.position = 'absolute'
            panel.style.height = '96px'
            panel.style.width = '96px'
            panel.style.top = `${i * 100 + 2}px`
            panel.style.left = `${j * 100 + 2}px`
            panel.style.backgroundColor = '#f00'
            panel.style.borderRadius = '10px'
            panel.style.transition = 'all 100ms linear'
            container.appendChild(panel)
            board[i][j] = { panel, color: 0 }
            panel.onpointerdown = (e) => {
                e.preventDefault();
                ondown(j, i)

            }
        }
    }
}

window.onload = () => {
    init()
}

let isAnimation = false
const flip = async (x, y) => {
    if (x < 0 || x > 2 || y < 0 || y > 2) {
        return
    }
    isAnimation = true

    const panel = board[y][x].panel
    let color = board[y][x].color
    color = 1 - color
    // ↓ こいつの位置を，この関数の一番下に持ってくると，ゲームオーバー判定が1ターン遅れる
    // どういう原理なんだろうか
    board[y][x].color = color
    // flip はこの board の色を参照してるので，どういうことだ？？
    // 先にみかけの色を変えるか，内部的な色を変えるかで何か違いはああるのか？
    // ああなんとなくわかったような，flip 関数は await の部分で止まってしまっていて，
    // 次呼び出されたときに await 以降の処理が走るとかそういう話かな，
    // で，await の後ろに内部の色変更を入れたら，それが反映されずに ondown が回ってしまう的な？
    // (妄想)
    // まあでもじゃあ，isAnimation も発火しないわけなので，どうなんだろうかってはなしなんだが
    // ごめんなさい今は全く興味湧かないんだけど，また興味が出たら調べといて
    // そして git を作る間もなく完成してしまうというね，まあいいことではある

    // この辺りの rotate やらの書き方はちょっとずつ覚えつつある
    panel.style.transform = 'perspective(150px) rotateY(90deg)'
    // ここがやっぱり慣れない
    // Promise で r つまり setTimeout が終わるまで await するみたいな感じのはず
    // これを書いておくことによって，時系列に処理が走るようになる
    // で，思ったのは，async をつけて関数定義すると，途中で止まれる関数になるというのはガチで
    // なんでそうなるんだろうなという感じはした
    // async で音声対話システムを作りたい所存
    await new Promise(r => setTimeout(r, 100))
    panel.style.backgroundColor = (color) ? "#00f" : "#f00"
    panel.style.transform = 'perspective(150px) rotateY(-90deg)'
    panel.parentElement.appendChild(panel)
    await new Promise(r => setTimeout(r, 50))
    panel.style.backgroundColor = (color) ? "#00f" : "#f00"
    panel.style.transform = 'perspective(150px) rotateY(0deg)'
    await new Promise(r => setTimeout(r, 100))
    // そして ^ の一連の処理の意味がちょっと掴めてない
    // まず 90deg 回して，その後，一瞬色を変えながら -90deg までまわすんだよね？
    // で，その後 0deg に戻すということで
    // 普通に　180deg 回せばいいんじゃないって思ったんだけど，それだと裏の裏が面倒になる気がするな今思うと
    // まあじゃあなんとなく納得はしたけど，やっぱり微妙に引っかかる部分はある
    // parentElement に append するのは -90deg までいく動きを見せたくないからだよな多分
    // そういうことを言ってるんだと思う，で，transition を消すのがめんどいから，作り直してると
    // （じゃあ元あったやつはどこに行ったのかって話になってくるんだが）
    // それはテトリスのミノのフォーカスの移動の時に感じた謎と共通してる部分があるかもしれないな

    isAnimation = false
}

let gameover = false
const ondown = (x, y) => {
    if (isAnimation) return;
    if (gameover) return;

    flip(x, y)
    flip(x + 1, y)
    flip(x - 1, y)
    flip(x, y + 1)
    flip(x, y - 1)

    // このイキリ腐ったコードが大好き
    gameover = board.flat().every((v) => v.color === 1);
}