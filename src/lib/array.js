/** @format */

export function array_to_object(array, key) {
    return array.reduce((obj, item) => {
        obj[item[key]] = item;
        return obj;
    }, {});
}

export function shrink(array, integer) {
    if (array.length <= integer) {
        return array;
    }
    const factor = array.length / integer;
    return Array.apply(null, { length: integer }).map(function(_, i) {
        return array[Math.floor(i * factor)];
    });
}

export function max_len_el(arr) {
    return arr.reduce(function(result, val) {
        return Math.max(result, !isNaN(val) ? parseInt(val) : val.length);
    }, 0);
}

export function nearest(arr, tar) {
    if (arr.length < 0) {
        return false;
    }
    const indecies = arr.map((k) => Math.abs(k - tar));
    const min = Math.min.apply(Math, indecies);
    return arr[indecies.indexOf(min)];
}

export function unique(arr) {
    return arr.filter((v, i) => arr.indexOf(v) === i);
}
