const content = document.querySelector("main"),
    rows = []

let row, random_row, frog_pos = 9, frog

create()

function create() {
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
            frog.style.left = "46.15vw"
            document.addEventListener("keydown", move)
            row.append(frog)
        }
        else {
            random_row = Math.floor(Math.random() * 2)
            switch (random_row) {
                case 0: row.setAttribute("class", "road"); break;
                case 1: row.setAttribute("class", "river"); break;
                default: break;
               }
        }
        content.append(row)
        rows.push(row)
    }
}

function move(e) {
    if (frog_pos != 0 && e.key === "ArrowUp") {
        rows[frog_pos].removeChild(frog)
        rows[frog_pos - 1].appendChild(frog)
        --frog_pos
    }
    if (frog_pos === 0) {frog_pos = 9; clear_all(); create()};
}

function clear_all() {
    let children = content.lastElementChild;
    do {
        content.removeChild(children)
        children = content.lastElementChild;
    } while (children);
    rows.splice(0, rows.length)
}
