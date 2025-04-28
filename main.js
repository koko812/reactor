const width = 300
const height = 300
const size = 30

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

    remove() {
        this.willRemove = true
        this.element.remove()
    }
}

let hero;
let heroX = width / 2;
let heroY = height - size;

let bulletSpeed = 5
let bulletList = []
const createBullet = (x, y, dx, dy) => {
    const bullet = new Character();
    bullet.setPosition(x, y)
    bullet.setDelta(dx, dy)
    container.append(bullet.element)
    bulletList.push(bullet)
}

let reactorList = []
const createReactor = () => {
    const reactor = new Character('⚡️');
    const x = Math.random() * width
    const y = Math.random() * 0.7 * height
    console.log('reactor');
    reactor.setPosition(x, y)
    container.append(reactor.element)
    reactorList.push(reactor)
}

const checkCollision = (a, b, ratio = 0.9) => {
    ax = a.x
    ay = a.y
    bx = b.x
    by = b.y
    if ((ax - bx) ** 2 + (ay - by) ** 2 < (size * ratio) ** 2) {
        return true
    } else {
        return false
    }
}

let container;
let countChar;
let dieText;

const init = () => {
    container = document.getElementById('container')
    hero = new Character('🐥')
    container.appendChild(hero.element)
    hero.setPosition(heroX, heroY)

    countChar = new Character('10')
    container.append(countChar.element)
    countChar.setPosition(heroX, heroY - size)

    dieText = new Character('You\ndied.')
    dieText.element.style.position = 'absolute'
    dieText.element.style.color = '#f00'
    dieText.element.style.display = 'none'
    dieText.element.style.fontSize = '80px'
    dieText.setPosition(width, height)
    container.appendChild(dieText.element)

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
            countChar.setPosition(heroX, heroY - size)
            //console.log(heroX)
        }
    }
    document.onpointerup = (e) => {
        originPageX = -1
    }

}

let gameover = false
let cnt = 0;
let countDown = 3000 + Date.now();
window.onload = async () => {
    init()
    while (true) {
        cnt++;
        // createBullet の入れ場所に迷った
        // 下側の大きな else に入れていたせいで，無限に生成されてしまっていて，
        // 発車した瞬間にタイムカウントが始まってしまっていた
        if (countDown > 0) {
            let count = countDown - Date.now()
            countChar.element.textContent = `${Math.ceil(count / 1000)}`
            if (count < 0) {
                createBullet(heroX, heroY - size, 0, -1);
                countDown = 0
            }
        } else {
            if (bulletList.length === 0) {
                countDown = 3000 + Date.now()
            }
            countChar.element.textContent = ''
        }

        // console.log が変なところに入ってたら，フリーズすることがある？かもしれない
        // 何が悪かったのかはちょっと謎
        await new Promise(r => setTimeout(r, 16))
        for (const bullet of bulletList) {
            let x = bullet.x + bulletSpeed * bullet.dx
            let y = bullet.y + bulletSpeed * bullet.dy

            if (x < 0 || x > width) {
                bullet.setDelta(bullet.dx * -1, bullet.dy)
                x = bullet.x + bulletSpeed * bullet.dx
            }
            if (y < 0) {
                bullet.setDelta(bullet.dx, bullet.dy * -1)
                y = bullet.y + bulletSpeed * bullet.dy

            }
            if (y > height) {
                bullet.remove()
            }
            if (bullet.willRemove) {
                continue
            }
            for (const reactor of reactorList) {
                if (reactor.willRemove) {
                    continue
                } else {
                    if (checkCollision(bullet, reactor)) {
                        bullet.remove()
                        if (bullet.dx != 0) {
                            createBullet(bullet.x, bullet.y, 0, 1)
                            createBullet(bullet.x, bullet.y, 0, -1)
                        }
                        if (bullet.dy != 0) {
                            createBullet(bullet.x, bullet.y, 1, 0)
                            createBullet(bullet.x, bullet.y, -1, 0)
                        }
                        reactor.remove()
                    } else {
                        //createReactor()
                    }
                }
            }

            bullet.setPosition(x, y)
            //console.log(bullet);
            if (checkCollision(hero, bullet)) {
                gameover = true
            }
        }
        // この書き方はテクくてかっこいいね
        if (Math.random() < 0.02 + cnt / 100000) {
            createReactor();
            //console.log(Date.now());
        }

        bulletList = bulletList.filter(v => !v.willRemove)
        reactorList = reactorList.filter(v => !v.willRemove)

        if (gameover) {
            // ここの setPosition, 初期化の時と位置がなぜか変わってズレるのがよくわからんかった
            // 文字サイズが，responsive になってないので，そこをどうにかしたいところ
            hero.element.textContent = '☠️'
            dieText.setPosition(width/4, height/8)
            dieText.element.style.display = ''
            return
        }
    }
}