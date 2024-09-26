import Controller from "./Controller.js";
import {factorial, findPrime, isPrime} from "../modules/mathUtilities.js";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, null);
    }

    get(id) {

        const request = this.HttpContext.path;

        // Get documentation of this controller
        if (request.queryString === "?") {
            this.getDocumentation();
            return;
        }

        const operator = request.params['op'];

        // If operator invalid
        if (operator === undefined) {
            this.setResponse({
                error: "'op' parameter is missing!"
            });
            return;
        }

        // Handle addition
        if (operator === "+" || operator === " ") {
            this.setResponse(this.getAddition(request));
            return;
        }

        if (operator === "-") {
            this.setResponse(this.getSubtraction(request));
            return;
        }

        if (operator === "*") {
            this.setResponse(this.getMultiplication(request));
            return;
        }

        if (operator === "/") {
            this.setResponse(this.getDivision(request));
            return;
        }

        if (operator === "%") {
            this.setResponse(this.getModulo(request));
            return;
        }

        if (operator === "!") {
            this.setResponse(this.getFactor(request));
            return;
        }

        if (operator === "p") {
            this.setResponse(this.getPrime(request));
            return;
        }

        if (operator === "np") {
            this.setResponse(this.getNthPrime(request));
            return;
        }

        this.HttpContext.response.notImplemented();
    }

    post(data) {
        this.HttpContext.response.notImplemented();
    }

    put(data) {
        this.HttpContext.response.notImplemented();
    }

    remove(id) {
        this.HttpContext.response.notImplemented();
    }

    // RESPONSES
    getDocumentation() {
        this.HttpContext.response.notImplemented();
    }

    setResponse(response) {
        this.HttpContext.response.JSON(response);
    }

    #checkXY(request, response) {
        let x = request.params['x'];

        // If X not defined
        if (x === undefined) {
            response.error = '\'x\' is missing!';
            return response;
        }

        // If X NAN
        x = parseFloat(x);
        response.x = x;

        if (isNaN(x)) {
            response.error = '\'x\' is not a number.';
            response.x = request.params['x'];
            return response;
        }

        let y = request.params['y'];

        // If Y not defined
        if (y === undefined) {
            response.error = '\'y\' is missing!';
            return response;
        }

        // If Y NAN
        y = parseFloat(y);
        response.y = y;

        if (isNaN(y)) {
            response.error = '\'y\' is not a number.';
            response.y = request.params['y'];
            return response;
        }

        if (Object.keys(request.params).length > 3) {
            response.error = "The request has too many parameters.";

            for (const key in request.params)
                response[key] ||= request.params[key];

            return response;
        }

        return response;
    }

    #checkN(request, response) {
        let n = request.params['n'];

        // If N not defined
        if (n === undefined) {
            response.error = '\'n\' is missing!';
            return response;
        }

        // If N NAN
        n = parseInt(n);
        response.n = n;

        if (isNaN(n)) {
            response.error = '\'n\' is not a number.';
            response.y = request.params['n'];
            return response;
        }

        if (Object.keys(request.params).length > 2) {
            response.error = "The request has too many parameters.";

            for (const key in request.params)
                response[key] ||= request.params[key];

            return response;
        }

        return response;
    }

    getAddition(request) {
        let response = this.#checkXY(request, {'op': '+'});

        if (response.error === undefined)
            response.value = response.x + response.y;
        return response;
    }

    getSubtraction(request) {
        let response = this.#checkXY(request, {'op': '-'});

        if (response.error === undefined)
            response.value = response.x - response.y;
        return response;
    }

    getMultiplication(request) {
        let response = this.#checkXY(request, {'op': '*'});

        if (response.error === undefined)
            response.value = response.x * response.y;
        return response;
    }

    getDivision(request) {
        let response = this.#checkXY(request, {'op': '/'});

        if (response.error === undefined)
            response.value = response.x / response.y;
        return response;
    }

    getModulo(request) {
        let response = this.#checkXY(request, {'op': '%'});

        if (response.error === undefined)
            response.value = response.x % response.y;
        return response;
    }

    getFactor(request) {
        let response = this.#checkN(request, {'op': '!'});

        if (response.error !== undefined)
            return response;

        if (response.n < 0) {
            response.error = "\'n\' cannot be negative.";
            return response;
        }

        response.value = factorial(response.n);
        return response;
    }

    getPrime(request) {
        let response = this.#checkN(request, {'op': 'p'});

        if (response.error !== undefined)
            return response;

        response.value = isPrime(response.n);
        return response;
    }

    getNthPrime(request) {
        let response = this.#checkN(request, {'op': 'np'});

        if (response.error !== undefined)
            return response;

        if (response.n < 0) {
            response.error = "\'n\' cannot be negative.";
            return response;
        }

        response.value = findPrime(response.n);
        return response;
    }
}