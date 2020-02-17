/** @format */

import { cubicInOut, cubicIn } from "svelte/easing";

export function scalehor(node, params) {
    const unit = params.unit || "px";
    const pruned_width = getComputedStyle(node).width.replace(unit, "");
    const final_width = parseFloat(pruned_width);
    console.log(pruned_width);

    return {
        delay: params.delay || 0,
        duration: params.duration || 4000,
        easing: cubicInOut,
        css: (t) => `width: ${final_width * t}${unit};`,
    };
}
