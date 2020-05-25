/**
 * File spec.js created on 25-05-2020.
 * Last modified on 2020-05-25T21:42:13 CEST
 *
 * @fileoverview Integration test definitions file.
 * @license GPL-3.0-or-later
 * @author Andreas Krühlmann <echo "YW5kcmVhc0BrcnVobG1hbm4uZGV2Cg==" | base64 -d>
 * @since 0.0.1
 * @format
 */

describe("Sapper template app", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("has the correct <p>", () => {
        cy.contains("p", "Hello, World!");
    });
});
