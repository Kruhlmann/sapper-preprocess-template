/**
 * File spec.js created on 25-05-2020.
 * Last modified on 2020-05-26T00:22:33 CEST
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

    it("has the correct initial color-indicator", () => {
        cy.contains(".color-indicator", "red");
    });

    it("responds to click events", () => {
        cy.get("button.blue").click();
        cy.contains(".color-indicator", "blue");
        cy.get("button.red").click();
        cy.contains(".color-indicator", "red");
    });
});
