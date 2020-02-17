export async function get() {
    return fetch("")
        .then((r) => {
            return r.json();
        })
        .then((r) => {
            if (!r.ok) {
                throw new NetworkError(r.status);
            }
        })
        .catch((e) => {
            console.error(e);
            throw e;
        });
}
