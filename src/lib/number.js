/** @format */

export function pad_number(n, len) {
    let fract = "";
    let str_n = `${n}`;

    if (n.includes(".")) {
        const split = n.split(".");
        str_n = split[0];
        fract = `.${split[1]}`;
    }

    while (str_n.length < len) {
        str_n = `0${str_n}`;
    }

    return `${str_n}${fract}`;
}

export function safe_pct(a, b) {
    if (b === 0) {
        console.warn("Attempted to divide by zero");
        return 0;
    }
    return (a / b) * 100;
}

export function humanify(i) {
    return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
