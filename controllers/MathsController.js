import Controller from "./Controller.js";
import {factorial, findPrime, isPrime} from "../modules/mathUtilities.js";
import {handleStaticResourceRequest} from "../staticResourcesServer.js";

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

        let response = undefined;

        switch (request.params['op']) {
            // Invalid operator
            case undefined:
                response = {
                    error: "'op' parameter is missing!"
                };
                break;
            // Addition
            case "+":
            case " ":
                response = this.getAddition(request);
                break;
            // Subtraction
            case "-":
                response = this.getSubtraction(request);
                break;
            // Multiplication
            case "*":
                response = this.getMultiplication(request);
                break;
            // Division
            case "/":
                response = this.getDivision(request);
                break;
            // Modulo
            case "%":
                response = this.getModulo(request);
                break;
            // Factorial
            case "!":
                response = this.getFactorial(request);
                break;
            // Prime
            case "p":
                response = this.getIsPrime(request);
                break;
            // Nth Prime
            case "np":
                response = this.getNthPrime(request);
                break;
            default:
                this.HttpContext.response.notImplemented();
                return;
        }

        this.HttpContext.response.JSON(response);
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
        this.HttpContext.req.url = "API-Help-Pages/API-Maths-Help.html";
        handleStaticResourceRequest(this.HttpContext);
    }

    #checkBinomial(request, response, first = 'x', second = 'y') {
        let _first = request.params[first];

        // If first not defined
        if (_first === undefined) {
            response.error = `'${first}' is missing!`;
            return response;
        }

        // If first NAN
        _first = parseFloat(_first);
        response[first] = _first;

        if (isNaN(_first)) {
            response.error = `'${first}' is not a number.`;
            response[first] = request.params[first];
            return response;
        }

        let _second = request.params[second];

        // If second not defined
        if (_second === undefined) {
            response.error = `'${second}' is missing!`;
            return response;
        }

        // If second NAN
        _second = parseFloat(_second);
        response[second] = _second;

        if (isNaN(_second)) {
            response.error = `'${second}' is not a number.`;
            response[second] = request.params[second];
            return response;
        }

        // If too many parameters
        if (Object.keys(request.params).length > 3) {
            response.error = "The request has too many parameters.";

            for (const key in request.params)
                response[key] ||= request.params[key];
        }

        return response;
    }

    #checkMonomial(request, response, name = 'n') {

        let n = request.params[name];

        // If N not defined
        if (n === undefined) {
            response.error = `'${name}' is missing!`;
            return response;
        }

        // If N NAN
        n = parseInt(n);
        response[name] = n;

        if (isNaN(n)) {
            response.error = `'${name}' is not a number.`;
            response[name] = request.params[name];
            return response;
        }

        // If too many parameters
        if (Object.keys(request.params).length > 2) {
            response.error = "The request has too many parameters.";

            for (const key in request.params)
                response[key] ||= request.params[key];
        }

        return response;
    }

    getAddition(request) {
        let response = this.#checkBinomial(request, {'op': '+'});

        if (response.error === undefined)
            response.value = response.x + response.y;
        return response;
    }

    getSubtraction(request) {
        let response = this.#checkBinomial(request, {'op': '-'});

        if (response.error === undefined)
            response.value = response.x - response.y;
        return response;
    }

    getMultiplication(request) {
        let response = this.#checkBinomial(request, {'op': '*'});

        if (response.error === undefined)
            response.value = response.x * response.y;
        return response;
    }

    getDivision(request) {
        let response = this.#checkBinomial(request, {'op': '/'});

        if (response.error !== undefined)
            return response;

        if (response.y === 0)
        {
            response.error = "'Y' can not be zero.";
            return response;
        }

        if (response.error === undefined)
            response.value = response.x / response.y;
        return response;
    }

    getModulo(request) {
        let response = this.#checkBinomial(request, {'op': '%'});

        if (response.error === undefined)
            response.value = response.x % response.y;
        return response;
    }

    getFactorial(request) {
        let response = this.#checkMonomial(request, {'op': '!'});

        if (response.error !== undefined)
            return response;

        if (response.n < 0) {
            response.error = "\'n\' cannot be negative.";
            return response;
        }

        response.value = factorial(response.n);
        return response;
    }

    getIsPrime(request) {
        let response = this.#checkMonomial(request, {'op': 'p'});

        if (response.error !== undefined)
            return response;

        response.value = isPrime(response.n);
        return response;
    }

    getNthPrime(request) {
        let response = this.#checkMonomial(request, {'op': 'np'});

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