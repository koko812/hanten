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

    panel.style.transform = 'perspective(150px) rotateY(90deg)'
    await new Promise(r => setTimeout(r, 100))
    panel.style.backgroundColor = (color) ? "#00f" : "#f00"
    panel.style.transform = 'perspective(150px) rotateY(-90deg)'
    panel.parentElement.appendChild(panel)
    await new Promise(r => setTimeout(r, 50))
    panel.style.backgroundColor = (color) ? "#00f" : "#f00"
    panel.style.transform = 'perspective(150px) rotateY(0deg)'
    await new Promise(r => setTimeout(r, 100))

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

    gameover = board.flat().every((v) => v.color === 1);
}