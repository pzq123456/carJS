export function lerp(A, B, t){
    return A + (B - A) * t;
}

export function getIntersection(A,B,C,D){
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if(bottom != 0){
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    } // parallel lines
    return null;
}

export function polysIntersect(poly1, poly2){
    for(let i = 0; i < poly1.length; i++){
        const A = poly1[i];
        const B = poly1[(i + 1) % poly1.length];
        for(let j = 0; j < poly2.length; j++){
            const C = poly2[j];
            const D = poly2[(j + 1) % poly2.length];
            const intersection = getIntersection(A,B,C,D);
            if(intersection){
                return intersection;
            }
        }
    }
    return null;
}

export function getRGBA(value){
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return `rgba(${R},${G},${B},${alpha})`;
}

export function save(name, data){
    // localStorage.setItem('bestCar', JSON.stringify(bestCarData));
    localStorage.setItem(name, JSON.stringify(data));
}

export function load(name){
    return JSON.parse(localStorage.getItem(name));
}

export function downLoad(name, data){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: 'application/json'}));
    a.download = name;
    a.click();
}

export function remove(name){
    localStorage.removeItem(name);
}

export function throttle(fn, delay){
    let last = 0;
    return function(){
        let now = Date.now();
        if(now - last > delay){
            fn.apply(this, arguments);
            last = now;
        }
    }
}

// 防抖函数
export function debounce(fn, delay){
    let timer = null;
    return function(){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    }
}

export function randomLine(range){
    return Math.floor(Math.random()*range);
}
