function tbt_Vec(x, y) {
    this.x = x;
    this.y = y;
}
tbt_Vec.prototype.add = function (vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
};
tbt_Vec.prototype.sub = function (vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
};
tbt_Vec.prototype.mul = function (vec) {
    this.x *= vec.x || vec;
    this.y *= vec.y || vec;
    return this;
};
tbt_Vec.prototype.div = function (vec) {
    this.x /= vec.x || vec;
    this.y /= vec.y || vec;
    return this;
};
tbt_Vec.prototype.translate = tbt_Vec.prototype.add;
tbt_Vec.prototype.scale = tbt_Vec.prototype.mul;
tbt_Vec.prototype.rotate = function (angle) {
    this.dir += angle;
    return this;
};
tbt_Vec.prototype.setDir = function (dir) {
    this.dir = dir;
    return this;
};
Object.defineProperty(tbt_Vec.prototype, "mag", {
    get: function () {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    },
    set: function (mag) {
        this.muln(mag / this.mag);
    },
});
Object.defineProperty(tbt_Vec.prototype, "dir", {
    get: function () {
        return Math.atan2(this.y, this.x);
    },
    set: function (dir) {
        var mag = this.mag;
        this.x = mag * Math.cos(dir);
        this.y = mag * Math.sin(dir);
    },
});
Object.defineProperty(tbt_Vec.prototype, "norm", {
    get: function () {
        var mag = this.mag;
        return new tbt_Vec(this.x / mag, this.y / mag);
    },
});
Object.defineProperty(tbt_Vec.prototype, "copy", {
    get: function () {
        return new tbt_Vec(this.x, this.y);
    },
});
var tbt_VecGroup = Array.prototype.constructor;
tbt_VecGroup.polygonFromAABB = function (v1, v2) {
    return [new tbt_Vec(v1.x, v1.y), new tbt_Vec(v2.x, v1.y), new tbt_Vec(v2.x, v2.y), new tbt_Node(v1.x, v2.y)];
};
tbt_VecGroup.polygonFromCircle = function (radius, center = new tbt_Vec(0, 0), resolution = 10) {
    var arr = [];
    for (var i = 0; i < resolution; i++) {
        var dir = (Math.PI * 2 * i) / resolution;
        arr[i] = new tbt_Vec(radius * Math.cos(dir) + center.x, radius * Math.sin(dir) + center.y);
    }
    return arr;
};
tbt_VecGroup.prototype = Object.create(Array.prototype);
tbt_VecGroup.prototype.add = function (vec) {
    for (var v of this) v.add(vec);
    return this;
};
tbt_VecGroup.prototype.sub = function (vec) {
    for (var v of this) v.sub(vec);
    return this;
};
tbt_VecGroup.prototype.mul = function (vec) {
    for (var v of this) v.mul(vec);
    return this;
};
tbt_VecGroup.prototype.div = function (vec) {
    for (var v of this) v.div(vec);
    return this;
};
tbt_VecGroup.prototype.translate = tbt_VecGroup.prototype.add;
tbt_VecGroup.prototype.scale = tbt_VecGroup.prototype.mul;
tbt_VecGroup.prototype.rotate = function (angle) {
    for (var v of this) v.dir += angle;
    return this;
};
tbt_VecGroup.raysFromPolygon = function () {
    return this.map((vec, i, arr) => new tbt_VecGroup(vec, arr[i + 1] || arr[0]));
};
tbt_VecGroup.prototype.polygonPointCollide = function (vec) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i].x,
            yi = polygon[i].y,
            xj = polygon[j].x,
            yj = polygon[j].y,
            intersect = yi > vec.y != yj > vec.y && vec.x < ((xj - xi) * (vec.y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
};
tbt_VecGroup.prototype.raysCollide = function (group) {
    var det,
        gamma,
        lambda,
        v1 = this[0],
        v2 = this[1],
        v3 = group[0],
        v4 = group[1];
    det = (v2.x - v1.x) * (v4.y - v3.y) - (v4.x - v3.x) * (v2.y - v1.y);
    if (det === 0) return false;
    lambda = ((v4.y - v3.y) * (v4.x - v1.x) + (v3.x - v4.x) * (v4.y - v1.y)) / det;
    gamma = ((v1.y - v2.y) * (v4.x - v1.x) + (v2.x - v1.x) * (v4.y - v1.y)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
};
tbt_VecGroup.raysIntersect = function (group) {
    var v1 = this[0],
        v2 = this[1],
        v3 = group[0],
        v4 = group[1],
        a_m = (v2.y - v1.y) / (v2.x - v1.x) + 1e-100,
        a_b = v1.y - a_m * v1.x,
        b_m = (v4.y - v3.y) / (v4.x - v3.x) + 1e-100,
        b_b = v3.y - b_m * v3.x;
    if (a_m == b_m) return a_b == b_b;
    var x = (b_b - a_b) / (a_m - b_m);
    if (Math.min(Math.min(v1.x, v2.x), Math.min(v3.x, v4.x)) < x && x < Math.max(Math.max(v1.x, v2.x), Math.max(v3.x, v4.x))) return new tbt_Vec(x, a_m * x + a_b);
    return false;
};
tbt_VecGroup.polygonsCollide = function (group) {
    for (var i of this.raysFromPolygon()) for (var j of group.raysFromPolygon()) if (i.raysCollide(j)) return true;
    return false;
};

module.exports = {
    Vec: tbt_Vec,
    GVec: tbt_VecGroup
}