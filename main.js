const width = 300
const height = 300
const size = 30
let container = null

class Character {
    constructor(text = "") {
        const element = document.createElement('div')
        this.element = element
        element.style.position = 'absolute'
        element.style.height = `${size}px`
        element.style.width = `${size}px`
        // ごめんなさい，この display flex も普通に謎です
        // 一番最初に tetoris を作ろうとしたときにこんなのをつけた記憶がなくもないが
        // グリッドレイアウトな何かを作ろうとし出したら，分かってくるかもしれない
        // それっぽいブログみたいなホームページを今度作るときは，今までよりもクオリティを上げられそうで，
        // その時にこのあたりの機能を色々使うと思うので，その時にきちんと押さえればOKだと思われる
        element.style.display = 'flex'
        // この下二つがマジで謎なんだが，とにかく行，列の観点でセンタリングしたいらしい
        // なぜ Items と Content で振り分けるのかがマジで謎なんだが，
        // それは god only knows ...
        element.style.alignItems = 'center'
        element.style.justifyContent = 'center'
        element.style.fontSize = `${size * 0.9}px`
        // この color の設定も謎だが，これはフォントのカラーのことを言っている？
        // 流石にそんなことはないと信じたいが，よくわからない？
        // 今回はひよこを置いてるから黄色くなってるだけで，矢の色などはこの色に依存するのかな多分
        element.style.color = '#fff'
        element.textContent = text
    }
    setPosition(x, y) {
        this.x = x
        this.y = y
        this.element.style.left = `${x - size / 2}px`
        this.element.style.top = `${y - size / 2}px`
    }

    setDelta(dx, dy) {
        this.dx = dx
        this.dy = dy
        if (dx === 1) {
            this.element.textContent = '→'
        }
        else if (dx === -1) {
            this.element.textContent = '←'
        }
        else if (dy === 1) {
            this.element.textContent = '↓'
        }
        else if (dy === -1) {
            this.element.textContent = '↑'
        }
    }
}

let hero;
let heroX = width / 2;
let heroY = height - size;

let bulletList = []
const createBullet = (x, y, dx, dy) => {
    const bullet = new Character();
    bullet.setPosition(x, y)
    bullet.setDelta(dx, dy)
    container.appendChild(bullet.element)
    bulletList.push(bullet)
}

const init = () => {
    container = document.getElementById('container')
    hero = new Character('🐥')
    container.appendChild(hero.element)
    hero.setPosition(heroX, heroY)

    let originHeroX = 0;
    let originPageX = -1;
    document.ondblclick = (e) => {
        e.preventDefault();
    }
    document.onpointerdown = (e) => {
        // この preventDefault によって，ドラッグしてひよこの色が変わるのを防いでる
        e.preventDefault()
        originPageX = e.pageX
        originHeroX = e.pageX
        // 瞬間移動は不可能にすべきだろうか
        hero.setPosition(heroX, heroY)
        //console.log("print");
    }
    document.onpointermove = (e) => {
        e.preventDefault()
        if (originPageX !== -1) {
            heroX = originHeroX + e.pageX - originPageX;
            if (heroX > width) heroX = width;
            if (heroX < 0) heroX = 0;
            hero.setPosition(heroX, heroY)
            //console.log(heroX);
        }
    }
    document.onpointerup = (e) => {
        originPageX = -1
    }

}

window.onload = async () => {
    init()
    createBullet(heroX, heroY-size, 0, -1);
    while(true){
        // console.log が変なところに入ってたら，フリーズすることがある？かもしれない
        // 何が悪かったのかはちょっと謎K
        await new Promise(r => setTimeout(r, 16))
        for (const bullet of bulletList) {
            let x = bullet.x + bullet.dx
            let y = bullet.y + bullet.dy
            bullet.setPosition(x,y)
            console.log(bullet);
        }
    }
}