// PFCACA2D version 0.65
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Util
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
// PFCACA2D
var Point = /** @class */ (function () {
    function Point(x, y, color, size) {
        if (size === void 0) { size = 1; }
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
    }
    return Point;
}());
var Frame = /** @class */ (function () {
    function Frame(frame) {
        this.frame = frame;
    }
    Frame.prototype.append = function (point) {
        this.frame.push(point);
    };
    return Frame;
}());
var Color = /** @class */ (function () {
    function Color(color) {
        this.color = color;
    }
    Color.fromRGB = function (r, g, b) {
        return new Color('rgb(' + r + ',' + g + ',' + b + ')');
    };
    return Color;
}());
var Canvas = /** @class */ (function () {
    function Canvas(id, w, h) {
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.id = id;
        this.w = w;
        this.h = h;
    }
    Canvas.prototype.create = function () {
        var canvas = document.createElement("canvas");
        canvas.id = this.id;
        canvas.setAttribute("height", this.h.toString());
        canvas.setAttribute("width", this.w.toString());
        canvas.style.border = "solid 2px black";
        document.body.appendChild(canvas);
        return document.getElementById(canvas.id);
    };
    Canvas.prototype.self = function () {
        return document.querySelector("#" + this.id);
    };
    Canvas.prototype.draw = function (frame) {
        var canvasx = this.self().getContext('2d');
        for (var _i = 0, _a = frame.frame; _i < _a.length; _i++) {
            var pixel = _a[_i];
            canvasx.beginPath();
            canvasx.fillStyle = pixel.color;
            canvasx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
            canvasx.closePath();
        }
        this.last = frame;
        return frame;
    };
    Canvas.prototype.render = function (func, fps) {
        var delta;
        var must_pass = 1000 / fps;
        var last_time = Date.now();
        var _this = this;
        // MOUSE OPERATIONS
        this.mouse = { x: 0, y: 0 };
        // The function 'removeEventListener requires the function.
        // so cannot pass it inline to addEventListener
        this.handleMouse = function (evt) {
            var rect = _this.self().getBoundingClientRect();
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
        function rerender() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _this.clearAll();
                            delta = Date.now() - last_time;
                            last_time = Date.now();
                            func(delta / 1000); // delta is passed in 1.0 scale
                            if (!(delta < must_pass)) return [3 /*break*/, 2];
                            return [4 /*yield*/, sleep((must_pass - delta))];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _this.raf = window.requestAnimationFrame(rerender);
                            return [2 /*return*/];
                    }
                });
            });
        }
        _this.isRendering = true;
        _this.raf = window.requestAnimationFrame(rerender);
    };
    Canvas.prototype.stopRender = function () {
        if (this.isRendering) {
            try {
                window.cancelAnimationFrame(this.raf);
            }
            catch (Exception) {
                return false;
            }
            this.isRendering = false;
            window.removeEventListener('mousemove', this.handleMouse);
            return true;
        }
        return false;
    };
    Canvas.prototype.clear = function (frame) {
        var canvasx = this.self().getContext("2d");
        for (var _i = 0, _a = frame.frame; _i < _a.length; _i++) {
            var pixel = _a[_i];
            canvasx.clearRect(pixel.x, pixel.y, pixel.size, pixel.size);
        }
        return true;
    };
    Canvas.prototype.clearLast = function () {
        if (this.last == undefined) {
            return;
        }
        var canvasx = this.self().getContext("2d");
        for (var _i = 0, _a = this.last.frame; _i < _a.length; _i++) {
            var pixel = _a[_i];
            canvasx.clearRect(pixel.x, pixel.y, pixel.size, pixel.size);
        }
        return true;
    };
    Canvas.prototype.clearAll = function () {
        this.self().getContext("2d").clearRect(0, 0, this.self().width, this.self().height);
        return true;
    };
    return Canvas;
}());
function rand(x) {
    return Math.floor(Math.random() * x);
}
function generateVector() {
    // random X from < or > than window.innerWidth
    var x, y, xd, yd;
    var possibility = rand(4);
    if (possibility == 0) {
        // left
        x = -1;
        y = rand(window.innerHeight);
        xd = Math.abs(Math.random()) + PLUS_VEL;
        yd = (Math.random() * 2 - 1) * PLUS_VEL * 2;
    }
    else if (possibility == 1) {
        // right
        x = window.innerWidth + 1;
        y = rand(window.innerHeight);
        xd = -1 * (Math.abs(Math.random()) + PLUS_VEL);
        yd = (Math.random() * 2 - 1) * PLUS_VEL * 2;
    }
    else if (possibility == 2) {
        // top
        x = rand(window.innerWidth);
        y = -1;
        xd = (Math.random() * 2 - 1) * PLUS_VEL * 2;
        yd = Math.abs(Math.random()) + PLUS_VEL;
    }
    else {
        // bottom
        x = rand(window.innerWidth);
        y = window.innerHeight + 1;
        xd = (Math.random() * 2 - 1) * PLUS_VEL * 2;
        yd = -1 * (Math.abs(Math.random()) + PLUS_VEL);
    }
    return {
        'x': x,
        'y': y,
        'xd': xd,
        'yd': yd
    };
}
function exist4d(arr, value_arr) {
    var i, ok;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var val_arr = arr_1[_i];
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
    var MAX_BY_MIN = MAX_LINE_LENGTH / MIN_LINE_LENGTH;
    var POINT_COLOR = Color.fromRGB(PR, PG, PB).color;
    var canvas = new Canvas('main', window.innerWidth, window.innerHeight);
    canvas.create();
    var cvs = canvas.self();
    cvs.style.backgroundColor = Color.fromRGB(R, G, B).color;
    cvs.style.border = '0px';
    cvs.style.resize = 'both';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    window.addEventListener('resize', function () {
        // class
        canvas.w = window.innerWidth;
        canvas.h = window.innerHeight;
        // element
        cvs.style.width = canvas.w.toString();
        cvs.style.height = canvas.h.toString();
    });
    var vectors = [];
    for (var i = 0; i < POINTS; i++) {
        vectors.push(generateVector());
    }
    var frame = new Frame([]);
    var color, v;
    var ctx = canvas.self().getContext('2d');
    ctx.lineWidth = LINE_WIDTH;
    var lines;
    canvas.render(function (delta) {
        frame.frame = [];
        lines = [];
        for (var _i = 0, vectors_1 = vectors; _i < vectors_1.length; _i++) {
            var vector = vectors_1[_i];
            vector.x += vector.xd;
            vector.y += vector.yd;
            var passed_canvas = (vector.x + 150 < 0 && vector.xd < 0) ||
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
            for (var _a = 0, vectors_2 = vectors; _a < vectors_2.length; _a++) {
                var other_vector = vectors_2[_a];
                if (other_vector.x === vector.x && other_vector.y === vector.y) {
                    continue;
                }
                if (AVOID_DOUBLE_LINES) {
                    if (exist4d(lines, [other_vector.x, other_vector.y, vector.x, vector.y])) {
                        continue;
                    }
                    else {
                        lines.push([vector.x, vector.y, other_vector.x, other_vector.y]);
                    }
                }
                // distance
                var d_x = other_vector.x - vector.x;
                var d_y = other_vector.y - vector.y;
                var d = Math.sqrt(Math.pow(d_x, 2) + Math.pow(d_y, 2));
                // normal = 1 para d <= 100, some para 150
                if (d < MIN_LINE_LENGTH) {
                    color = Color.fromRGB(TO_R, TO_G, TO_B);
                }
                else if (d <= MAX_LINE_LENGTH) {
                    var a = d * MAX_BY_MIN;
                    color = new Color('rgba(' + TO_R + ',' + TO_G + ',' + TO_B + ', ' + a + ')');
                }
                else {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(vector.x + POINT_SIZEBY2, vector.y + POINT_SIZEBY2);
                ctx.lineTo(other_vector.x + POINT_SIZEBY2, other_vector.y + POINT_SIZEBY2);
                ctx.closePath();
                ctx.strokeStyle = color.color;
                ctx.stroke();
            }
        }
        canvas.draw(frame);
    }, FPS);
}
var FPS = 60;
var PLUS_VEL = 1.5;
var LINE_WIDTH = .125;
var POINTS = 100;
var POINT_SIZE = 2;
var POINT_SIZEBY2 = POINT_SIZE / 2;
var MAX_LINE_LENGTH = 125;
var MIN_LINE_LENGTH = 25;
// Can be slower with more than 15 points
var AVOID_DOUBLE_LINES = false;
// BACKGROUND
var R = (64).toString();
var G = (127).toString();
var B = (255).toString();
// Color different from background
var TO_R = 255;
var TO_G = 255;
var TO_B = 255;
// POINT COLOR
var PR = TO_R;
var PG = TO_G;
var PB = TO_B;
document.body.onload = main;
