function to(promise) {
    return promise
    .then(data => ({
        data,
        err: null,
    }))
    .catch(err => ({
        err,
        data: null,
    }));
}

module.exports = to;