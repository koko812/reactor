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
        element.style.display = 'flex'
        element.style.alignItems = 'center'
        element.style.justifyContent = 'center'
        element.style.fontSize = `${size * 0.9}px`
        element.style.color = '#fff'
        element.textContent = text
    }
    setPosition(x, y) {
        this.x = x
        this.y = y
        this.element.style.left = `${x - size / 2}px`
        this.element.style.top = `${y - size / 2}px`
    }
}

let hero;
let heroX = width / 2;
let heroY = height - size;

const init = () => {
    const container = document.getElementById('container')
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
            console.log(heroX);
        }
    }
    document.onpointerup = (e) => {
        originPageX = -1
    }

}

window.onload = () => {
    init()
}