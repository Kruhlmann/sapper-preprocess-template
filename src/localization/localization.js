import da_DK from "./da_DK.json";
import en_US from "./en_US.json";

const localizations = {
    da_DK,
    en_US,
};

export default function _(t, l) {
    return localizations[l][t];
}
