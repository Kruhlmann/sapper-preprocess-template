/**
 * File index.ts created on 25-05-2020.
 * Last modified on 2020-05-26T00:21:13 CEST
 *
 * @fileoverview
 * @license GPL-3.0-or-later
 * @author Andreas Krühlmann <echo "YW5kcmVhc0BrcnVobG1hbm4uZGV2Cg==" | base64 -d>
 * @since
 * @format
 */

let selected_btn = "red";

/**
 * Increments the click counter.
 *
 * @param clr - Color to select.
 * @returns void.
 */
function select_clr(clr: string): void {
    selected_btn = clr;
}
