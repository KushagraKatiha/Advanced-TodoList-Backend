const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).cath((err) => next(err))
    }
}

export {asyncHandler}