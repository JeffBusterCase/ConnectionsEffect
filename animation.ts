// PFCACA2D version 0.65

// Util
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// PFCACA2D
class Point {
    constructor(public x: number, public y: number, public color: string, public size = 1) { }
}

class Frame {
    constructor(public frame: Array<Point>) { }
    append(point: Point) {
        this.frame.push(point);
    }
}

class Color {
    constructor(public color: string) { }
    static fromRGB(r, g, b) {
        return new Color('rgb(' + r + ',' + g + ',' + b + ')')
    }
}

class Canvas {
    private handleMouse;
    public isRendering: boolean;
    private last: Frame;
    private mouse: { x: number, y: number };
    private raf;

    constructor(public id: string, public w = 0, public h = 0){}
    create() {
        var canvas = document.createElement("canvas");
        canvas.id = this.id;
        canvas.setAttribute("height", this.h.toString());
        canvas.setAttribute("width", this.w.toString());
        canvas.style.border = "solid 2px black";
        document.body.appendChild(canvas);
        return document.getElementById(canvas.id);
    }
    self() {
        return document.querySelector("#" + this.id) as HTMLCanvasElement;
    }
    draw(frame: Frame): Frame {
        var canvasx = this.self().getContext('2d');

        for (var pixel of frame.frame) {
            canvasx.beginPath();
            canvasx.fillStyle = pixel.color;
            canvasx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
            canvasx.closePath();
        }
        this.last = frame;
        return frame;
    }
    render(func, fps) {
        var delta;
        var must_pass = 1000 / fps;
        var last_time = Date.now();
        let _this = this;

        // MOUSE OPERATIONS
        this.mouse = { x: 0, y: 0 };

        // The function 'removeEventListener requires the function.
        // so cannot pass it inline to addEventListener
        this.handleMouse = (evt) => {
            let rect = _this.self().getBoundingClientRect();
            _this.mouse = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
            _this.mouse.x = _this.mouse.x > _this.w ? _this.w : _this.mouse.x;
            _this.mouse.y = _this.mouse.y > _this.h ? _this.h : _this.mouse.y;
            _this.mouse.x = _this.mouse.x < 0 ? 0 : _this.mouse.x;
            _this.mouse.y = _this.mouse.y < 0 ? 0 : _this.mouse.y;
        };

        window.addEventListener('mousemove', this.handleMouse, false);


        async function rerender() {
            _this.clearAll();
            delta = Date.now() - last_time;
            last_time = Date.now();
            func(delta / 1000);// delta is passed in 1.0 scale
            if (delta < must_pass) {
                await sleep((must_pass - delta));
            }
            _this.raf = window.requestAnimationFrame(rerender);
        }
        _this.isRendering = true;
        _this.raf = window.requestAnimationFrame(rerender);
    }
    stopRender() {
        if (this.isRendering) {
            try { window.cancelAnimationFrame(this.raf); } catch (Exception) {
                return false;
            }
            this.isRendering = false;
            window.removeEventListener('mousemove', this.handleMouse);
            return true;
        }
        return false;
    }
    clear(frame: Frame): Boolean {
        var canvasx = this.self().getContext("2d");
        for (var pixel of frame.frame) {
            canvasx.clearRect(pixel.x, pixel.y, pixel.size, pixel.size);
        }
        return true;
    }
    clearLast(): Boolean {
        if (this.last == undefined) {
            return;
        }
        var canvasx = this.self().getContext("2d");
        for (var pixel of this.last.frame) {
            canvasx.clearRect(pixel.x, pixel.y, pixel.size, pixel.size);
        }
        return true;
    }
    clearAll(): Boolean {
        this.self().getContext("2d").clearRect(0, 0, this.self().width, this.self().height);
        return true;
    }
}

function rand(x: number) {
    return Math.floor(Math.random() * x);
}

function generateVector() {
    // random X from < or > than window.innerWidth
    let x, y, xd, yd;
    let possibility = rand(4);
    if (possibility == 0) {
        // left
        x = -1;
        y = rand(window.innerHeight);
        xd = Math.abs(Math.random())+PLUS_VEL;
        yd = (Math.random()*2-1) * PLUS_VEL*2;
    } else if (possibility == 1) {
        // right
        x = window.innerWidth + 1;
        y = rand(window.innerHeight);
        xd = -1 * (Math.abs(Math.random())+PLUS_VEL);
        yd = (Math.random()*2-1) * PLUS_VEL*2;
    } else if (possibility == 2) {
        // top
        x = rand(window.innerWidth);
        y = -1;
        xd = (Math.random()*2-1) * PLUS_VEL*2;
        yd = Math.abs(Math.random()) + PLUS_VEL;
    } else {
        // bottom
        x = rand(window.innerWidth);
        y = window.innerHeight + 1;
        xd = (Math.random()*2-1) * PLUS_VEL*2;
        yd = -1 * (Math.abs(Math.random())+PLUS_VEL);
    }

    return {
        'x': x,
        'y': y,
        'xd': xd,
        'yd': yd
    };
}

function exist4d(arr, value_arr) {
    let i, ok;
    for (var val_arr of arr) {
        ok = 0;
        for (i in val_arr) {
            if (value_arr[i] != val_arr[i]) {
                break;
            }
            ok++;
        }
        if (ok == 4) {
            return true;
        }
    }
    return false; 
}

// main
function main() {  
    const MAX_BY_MIN = MAX_LINE_LENGTH / MIN_LINE_LENGTH;
    const POINT_COLOR = Color.fromRGB(PR, PG, PB).color;

    let canvas = new Canvas('main', window.innerWidth, window.innerHeight);
    canvas.create()

    let cvs = canvas.self();
    cvs.style.backgroundColor = Color.fromRGB(R,G,B).color;
    cvs.style.border = '0px';
    cvs.style.resize = 'both';

    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    
    window.addEventListener('resize', () => {
        // class
        canvas.w = window.innerWidth;
        canvas.h = window.innerHeight;
        // element
        cvs.style.width = canvas.w.toString();
        cvs.style.height = canvas.h.toString();
    });

    let vectors = [];
    for (var i = 0; i < POINTS; i++) {
        vectors.push(generateVector());
    }

    let frame = new Frame([]);
    let color, v;
    let ctx = canvas.self().getContext('2d');
    ctx.lineWidth = LINE_WIDTH;

    let lines;

    canvas.render((delta) => {
        frame.frame = [];
        lines = [];


        for (let vector of vectors) {
            vector.x += vector.xd;
            vector.y += vector.yd;

            var passed_canvas =
                (vector.x + 150 < 0 && vector.xd < 0) ||
                (vector.x - 150 > canvas.w && vector.xd > 0) ||
                (vector.y + 150 < 0 && vector.yd < 0) ||
                (vector.y - 150 > canvas.h && vector.yd > 0);

            if (passed_canvas) {
                var index = vectors.indexOf(vector, 0);
                if (index > -1) {
                    vectors.splice(index, 1);
                }
                vectors.push(generateVector());
                continue;
            }

            frame.frame.push(new Point(vector.x, vector.y, POINT_COLOR, POINT_SIZE));

            for (let other_vector of vectors) {
                if (other_vector.x === vector.x && other_vector.y === vector.y) {
                    continue;
                }
                if(AVOID_DOUBLE_LINES){
                    if(exist4d(lines, [other_vector.x,other_vector.y,vector.x, vector.y])){
                        continue;
                    } else {
                      lines.push([vector.x, vector.y,other_vector.x,other_vector.y]);
                    }
                }
                // distance
                var d_x = other_vector.x - vector.x;
                var d_y = other_vector.y - vector.y;
                var d = Math.sqrt(d_x ** 2 + d_y ** 2);

                // normal = 1 para d <= 100, some para 150
                if (d < MIN_LINE_LENGTH) {
                    color = Color.fromRGB(TO_R, TO_G, TO_B);
                } else if (d <= MAX_LINE_LENGTH) {
                    var a = d * MAX_BY_MIN;
                    color = new Color('rgba('+TO_R+','+TO_G+','+TO_B+', '+ a + ')');
                } else {
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(vector.x+POINT_SIZEBY2, vector.y + POINT_SIZEBY2);
                ctx.lineTo(other_vector.x + POINT_SIZEBY2, other_vector.y + POINT_SIZEBY2);
                ctx.closePath();
                ctx.strokeStyle = color.color;
                ctx.stroke();
            }
        }


        canvas.draw(frame);
    }, FPS);
}

const FPS = 60;
const PLUS_VEL = 1.5;
const LINE_WIDTH = .125;
const POINTS = 100;
const POINT_SIZE = 2;
const POINT_SIZEBY2 = POINT_SIZE / 2;

const MAX_LINE_LENGTH = 125;
const MIN_LINE_LENGTH = 25;

// Can be slower with more than 15 points
const AVOID_DOUBLE_LINES = false;

// BACKGROUND
const R = (64).toString();
const G = (127).toString();
const B = (255).toString();

// Color different from background
const TO_R = 255;
const TO_G = 255;
const TO_B = 255;

// POINT COLOR
const PR = TO_R;
const PG = TO_G;
const PB = TO_B;

document.body.onload = main;
