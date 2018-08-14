//判断点是否在圆内
export function isPointInCircle(point, center, radius) {
    let d = getDistance(point, center);

    return d <= radius;
}
//获取两点之间的距离
export function getDistance(pt1, pt2) {
    let a = Math.pow((pt1.x - pt2.x), 2);
    let b = Math.pow((pt1.y - pt2.y), 2);
    let d = Math.sqrt(a + b);

    return d;
}

//获取点到线的距离


// export function getLineDistance(pt1,pt2,k) {
//     let k2 = Math.pow(k,2);
//     let a = Math.sqrt(k2 + 1);
//     let b = k*(pt1.x-pt2.x)-(pt1.y-pt2.y);
//     b = Math.abs(b);
//     let d = b / a;
//     return d;
// }
//
export function getTransform(pt1, pt2) {
    let d = getDistance(pt1, pt2);

    let c = (pt2.x - pt1.x) / d;
    let a = Math.acos(c);           // 旋转角度
    if (pt1.y > pt2.y) a = 2 * Math.PI - a;

    let c1 = {
        x: pt1.x + d / 2,
        y: pt1.y
    };
    let c2 = {
        x: (pt2.x + pt1.x) / 2,
        y: (pt2.y + pt1.y) / 2
    };
    let x = c2.x - c1.x;
    let y = c2.y - c1.y;

    return {d, a, x, y};
}
//判断两点是否重合
export function isEquals(pt1, pt2) {
    return (pt1.x === pt2.x && pt1.y === pt2.y);
}
//计算两点的中点
export function getMiddlePoint(pt1, pt2) {
    return {
        x: (pt2.x + pt1.x) / 2,
        y: (pt2.y + pt1.y) / 2
    };
}
//获取真正的密码，比如:手势密码是（0,3,6）而真正的密码是（1,4,7）
export function getRealPassword(str) {
    return str.replace(/\d/g, function ($0) {
        return Number($0) + 1;
    });
}