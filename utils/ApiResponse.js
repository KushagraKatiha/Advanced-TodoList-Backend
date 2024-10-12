class ApiResponse {
    constructor(
        stautsCode,
        data,
        message = 'Success'
    ){
        this.statusCode = stautsCode;
        this.data = data;
        this.message = message;
        this.success = true;
    }
}

export default ApiResponse;