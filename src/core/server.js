/**
 * File server.js created on 25-05-2020.
 * Last modified on 2020-05-25T21:34:26 CEST
 *
 * @fileoverview
 * @license GPL-3.0-or-later
 * @author Andreas Krühlmann <echo "YW5kcmVhc0BrcnVobG1hbm4uZGV2Cg==" | base64 -d>
 * @since 0.0.1
 * @format
 */

import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV, BASEPATH } = process.env;
const dev = NODE_ENV === "development";

polka()
    .use(
        `/${BASEPATH || ""}`,
        compression({ threshold: 0 }),
        sirv("static", dev),
        sapper.middleware(),
    )
    .listen(PORT, (err) => {
        console.error("Error", err);
    });
