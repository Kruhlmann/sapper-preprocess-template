/**
 * File client.js created on 25-05-2020.
 * Last modified on 2020-05-25T21:34:17 CEST
 *
 * @fileoverview Initializes the sapper app client side.
 * @license GPL-3.0-or-later
 * @author Andreas Krühlmann <echo "YW5kcmVhc0BrcnVobG1hbm4uZGV2Cg==" | base64 -d>
 * @since 0.0.1
 * @format
 */

import * as sapper from "@sapper/app";

sapper.start({
    target: document.querySelector("#sapper"),
});
