import _ from "../localization/localization";

let locale = "da_DK";

/**
 * Swaps the locale between Danish and American English.
 */
function switch_locale(): void {
    if (locale === "da_DK") {
        locale = "en_US";
    } else {
        locale = "da_DK";
    }
}
