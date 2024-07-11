class PostingError extends Error {
    constructor(message) {
        super(message)
        this.name = 'PostingError'
    }
}

module.exports = { PostingError }