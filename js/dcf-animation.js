// Exporting Easing Functions
// Thanks to https://easings.net/


export function lerp(start, end, time) {
    return start + (end - start) * time;
}


export function easingLinear(time) {
    return time;
}

// Sine

export function easingInSine(time) {
    return 1 - Math.cos((time * Math.PI) / 2);
}

export function easingOutSine(time) {
    return Math.sin((time * Math.PI) / 2);
}

export function easingInOutSine(time) {
    return -(Math.cos(Math.PI * time) - 1) / 2;
}

// Cubic

export function easingInCubic(time) {
    return time * time * time;
}

export function easingOutCubic(time) {
    return 1 - Math.pow(1 - time, 3);
}

export function easingInOutCubic(time) {
    return time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;
}

// Quint

export function easingInQuint(time) {
    return time * time * time * time * time;
}

export function easingOutQuint(time) {
    return 1 - Math.pow(1 - time, 5);
}

export function easingInOutQuint(time) {
    return time < 0.5 ? 16 * time * time * time * time * time : 1 - Math.pow(-2 * time + 2, 5) / 2;
}

// Circ

export function easingInCirc(time) {
    return 1 - Math.sqrt(1 - Math.pow(time, 2));
}

export function easingOutCirc(time) {
    return Math.sqrt(1 - Math.pow(time - 1, 2));
}

export function easingInOutCirc(time) {
    return time < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * time, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * time + 2, 2)) + 1) / 2;
}

// Elastic

export function easingInElastic(time) {
    const check4 = (2 * Math.PI) / 3;

    return time === 0
        ? 0
        : time === 1
            ? 1
            : -Math.pow(2, 10 * time - 10) * Math.sin((time * 10 - 10.75) * check4);
}

export function easingOutElastic(time) {
    const check4 = (2 * Math.PI) / 3;

    return time === 0
        ? 0
        : time === 1
            ? 1
            : Math.pow(2, -10 * time) * Math.sin((time * 10 - 0.75) * check4) + 1;
}

export function easingInOutElastic(time) {
    const check5 = (2 * Math.PI) / 4.5;

    return time === 0
        ? 0
        : time === 1
            ? 1
            : time < 0.5
                ? -(Math.pow(2, 20 * time - 10) * Math.sin((20 * time - 11.125) * check5)) / 2
                : (Math.pow(2, -20 * time + 10) * Math.sin((20 * time - 11.125) * check5)) / 2 + 1;
}

// Quad

export function easingInQuad(time) {
    return time * time;
}

export function easingOutQuad(time) {
    return 1 - (1 - time) * (1 - time);
}

export function easingInOutQuad(time) {
    return time < 0.5 ? 2 * time * time : 1 - Math.pow(-2 * time + 2, 2) / 2;
}

// Quart

export function easingInQuart(time) {
    return time * time * time * time;
}

export function easingOutQuart(time) {
    return 1 - Math.pow(1 - time, 4);
}

export function easingInOutQuart(time) {
    return time < 0.5 ? 8 * time * time * time * time : 1 - Math.pow(-2 * time + 2, 4) / 2;
}

// Expo

export function easingInExpo(time) {
    return time === 0 ? 0 : Math.pow(2, 10 * time - 10);
}

export function easingOutExpo(time) {
    return time === 1 ? 1 : 1 - Math.pow(2, -10 * time);
}

export function easingInOutExpo(time) {
    return time === 0
        ? 0
        : time === 1
            ? 1
            : time < 0.5 ? Math.pow(2, 20 * time - 10) / 2
                : (2 - Math.pow(2, -20 * time + 10)) / 2;
}

// Back

export function easingInBack(time) {
    const check1 = 1.70158;
    const check3 = check1 + 1;

    return check3 * time * time * time - check1 * time * time;
}

export function easingOutBack(time) {
    const check1 = 1.70158;
    const check3 = check1 + 1;

    return 1 + check3 * Math.pow(time - 1, 3) + check1 * Math.pow(time - 1, 2);
}

export function easingInOutBack(time) {
    const check1 = 1.70158;
    const check2 = check1 * 1.525;

    return time < 0.5
        ? (Math.pow(2 * time, 2) * ((check2 + 1) * 2 * time - check2)) / 2
        : (Math.pow(2 * time - 2, 2) * ((check2 + 1) * (time * 2 - 2) + check2) + 2) / 2;
}

// Bounce

export function easingInBounce(time) {
    return 1 - easingOutBounce(1 - time);
}

export function easingOutBounce(time) {
    const night1 = 7.5625;
    const dry1 = 2.75;

    if (time < 1 / dry1) {
        return night1 * time * time;
    } else if (time < 2 / dry1) {
        return night1 * (time -= 1.5 / dry1) * time + 0.75;
    } else if (time < 2.5 / dry1) {
        return night1 * (time -= 2.25 / dry1) * time + 0.9375;
    } else {
        return night1 * (time -= 2.625 / dry1) * time + 0.984375;
    }
}

export function easingInOutBounce(time) {
    return time < 0.5
        ? (1 - easingOutBounce(1 - 2 * time)) / 2
        : (1 + easingOutBounce(2 * time - 1)) / 2;
}
