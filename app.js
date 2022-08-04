const content = document.getElementsByClassName("content").item(0),
        rows = [],
        elements_timers =[],
		page_width = window.innerWidth,
		page_height = window.innerHeight

let row, frog, frog_row = 9, frog_left_pos = 46.15, water = false

create_map()

// TODO: Collisions with cars, make the system to move the frog when floating
// TODO: And set the check system to know if the frog it;s on water or not
// * The last system could check other collitions or something, to make it all in one

function create_map() {
    let random_row
    for (let index = 0; index < 10; ++index) {
        row = document.createElement("div")
        if (index === 0 || index === 5) {
            row.setAttribute("class", "grass")
        }
        else if (index === 9) {
            row.setAttribute("class", "grass")
            frog = document.createElement("img")
            frog.setAttribute("src", "/imgs/frog (1).png")
            frog.setAttribute("class", "frog")
            frog.style.left = `${frog_left_pos}vw`
            document.addEventListener("keydown", move_frog)
            row.append(frog)
        }
        else {
            random_row = Math.floor(Math.random() * 2)
            switch (random_row) {
                case 0:
                    row.setAttribute("class", "road")
                    create_enemy(row, index)
                    break
                case 1:
                    row.setAttribute("class", "river")
                    create_floating(row, index)
                    break
                default: console.log(`Error setting the row\nrandom_row: ${random_row}`); break
               }
        }
        content.append(row)
        rows.push(row)
    }
}

function move_frog(e) {
    if (frog_row !== 0) {
        switch (e.key) {
            case "ArrowUp":
                frog.style.transform = "rotate(0deg)"
                rows[frog_row].removeChild(frog)
                rows[frog_row - 1].appendChild(frog)
                --frog_row
                break
            case "ArrowDown":
                if (frog_row === 9) return;
                frog.style.transform = "rotate(180deg)"
                rows[frog_row].removeChild(frog)
                rows[frog_row + 1].appendChild(frog)
                ++frog_row
                break
            case "ArrowLeft":
                if (frog_left_pos <= 0) return;
                frog.style.transform = "rotate(-90deg)"
                frog.style.left = `${frog_left_pos -= 6}vw`
                break
            case "ArrowRight":
                if (+frog.style.left.slice(0,-2) >= 90) return;
                frog.style.transform = "rotate(90deg)"
                frog.style.left = `${frog_left_pos += 6}vw`
                break
            default: console.log(`Error moving the frog\ne.key: ${e.key}`); break
        }
        if (frog_row === 0) {frog_row = 9; clear_all(); create_map()};
    }
}

function create_enemy(row, row_num) {
    let time, enemy = document.createElement("img"),
        type_enemy = Math.floor(Math.random() * 4),
        random_pos = Math.floor(Math.random() * 100),
        random_dir = Math.floor(Math.random() * 2)

    enemy.setAttribute("class", "enemy")
    enemy.style.left = `${random_pos}vw`

    switch (type_enemy) {
        case 0:
            enemy.setAttribute("src", "/imgs/bus.png")
            enemy.setAttribute("class", "enemy_bus")
            time = 20; break
        case 1:
            enemy.setAttribute("src", "/imgs/school-bus.png")
            enemy.setAttribute("class", "enemy_bus")
            time = 30; break
        case 2: enemy.setAttribute("src", "/imgs/sedan.png"); time = 15; break
        case 3: enemy.setAttribute("src", "/imgs/sport-car.png"); time = 10; break
        default: console.log("Error while creating enemy")
    }

    direction = random_dir === 0? "left":"right"
    if (direction === "left") enemy.style.transform = "scaleX(-1)"
    enemy_timer = setInterval(move_enemy, time, enemy, direction, row_num)
    elements_timers.push(enemy_timer)
    row.append(enemy)
}

function move_enemy(element, direction, row_num) {
    const pos = +element.style.left.slice(0, -2),
            enemy = element.getBoundingClientRect()
            validations = [row_num === frog_row,
                frog_left_pos + 5 > enemy.left/page_width * 100,
                frog_left_pos + 1< enemy.right/page_width * 100].every(element => element === true)
    if (validations) endgame()
    if (direction === "right") {
        pos >= 100?
            element.style.left = "-5vw":
            element.style.left = `${pos + 0.5}vw`
        return
    }
    pos <= -10?
        element.style.left = "105vw":
        element.style.left = `${pos - 0.5}vw`
}

function create_floating(row, row_num) {
    let time, float = document.createElement("img"),
        type_float = Math.floor(Math.random() * 5),
        random_pos = Math.floor(Math.random() * 100),
        random_dir = Math.floor(Math.random() * 2)

    float.setAttribute("class", "float")
    float.style.left = `${random_pos}vw`

    switch (type_float) {
        case 0: float.setAttribute("src", "/imgs/float.png"); time = 27.5; break
        case 1:
            float.setAttribute("src", "/imgs/water.png")
            float.setAttribute("class", "float_large")
            time = 30; break
        case 2: float.setAttribute("src", "/imgs/wood-board.png"); time = 25; break
        case 3:
            float.setAttribute("src", "/imgs/wood.png")
            float.setAttribute("class", "float_wood")
            time = 22.5; break
        case 4: float.setAttribute("src", "/imgs/trunk.png"); time = 20; break

        default: console.log("Error creating floating elements");
    }
    direction = random_dir === 0? "left":"right"
    if (direction === "left") float.style.transform = "scaleX(-1)"
    float_timer = setInterval(move_floating, time, float, direction, row_num);
    elements_timers.push(float_timer)
    row.append(float)
}

function move_floating(element, direction, row_num) {
    const pos = +element.style.left.slice(0, -2)
        float = element.getBoundingClientRect()
                validations = [row_num === frog_row,
                    frog_left_pos + 5 > float.left/page_width * 100,
                    frog_left_pos + 1 < float.right/page_width * 100].every(element => element === true)
    if (direction === "right") {
        pos >= 100?
            element.style.left = "-5vw":
            element.style.left = `${pos + 0.5}vw`
        if (validations) frog.style.left = `${frog_left_pos += 0.5}vw`
        return
    }
    pos <= -10?
        element.style.left = "105vw":
        element.style.left = `${pos - 0.5}vw`
    if (validations) frog.style.left = `${frog_left_pos -= 0.5}vw`
}

function clear_all() {
    clear_elements()
    clear_map()
}

function clear_map() {
    let children = content.lastElementChild;
    do {
        content.removeChild(children)
        children = content.lastElementChild;
    } while (children); rows.splice(0, rows.length)
}

function clear_elements() {
    elements_timers.forEach(enemy => {
        clearInterval(enemy)
    }); elements_timers.splice(0, elements_timers.length)
}

function endgame() {
    let panel = document.createElement("aside")
    clear_all()
    panel.innerText = "You Die"
    panel.style.display = "grid"
    content.append(panel)
}
