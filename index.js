/*jshint -W069 */
/**
 * This application serves main Loadero's endpoints that can be used to
manipulate test data and other services
 * @class Test
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var Test = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function Test(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'http://api.loadero.com/v2';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name Test#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    Test.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {}
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });
    };

    /**
     * Set Token
     * @method
     * @name Test#setToken
     * @param {string} value - token's value
     * @param {string} headerOrQueryName - the header or query name to send the token at
     * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
     */
    Test.prototype.setToken = function(value, headerOrQueryName, isQuery) {
        this.token.value = value;
        this.token.headerOrQueryName = headerOrQueryName;
        this.token.isQuery = isQuery;
    };
    /**
     * Set Auth headers
     * @method
     * @name Test#setAuthHeaders
     * @param {object} headerParams - headers object
     */
    Test.prototype.setAuthHeaders = function(headerParams) {
        var headers = headerParams ? headerParams : {};
        if (!this.token.isQuery) {
            if (this.token.headerOrQueryName) {
                headers[this.token.headerOrQueryName] = this.token.value;
            } else if (this.token.value) {
                headers['Authorization'] = 'Bearer ' + this.token.value;
            }
        }
        return headers;
    };

    /**
     * This endpoint retrieves project info. Project must be previously created
     * @method
     * @name Test#readProject
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readProject = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves file info.
     * @method
     * @name Test#readFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.fileId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readFile = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/files/{fileID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{fileID}', parameters['fileId']);

        if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test run info. Project must be previously
    created
     * @method
     * @name Test#readAllProjectRuns
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterTestName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterFinishedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterFinishedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionStartedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionStartedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionFinishedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionFinishedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterIncrementStrategy - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStatus - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterTestMode - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterActive - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllProjectRuns = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['filterTestName'] !== undefined) {
            queryParameters['filter_test_name'] = parameters['filterTestName'];
        }

        if (parameters['filterStartedFrom'] !== undefined) {
            queryParameters['filter_started_from'] = parameters['filterStartedFrom'];
        }

        if (parameters['filterStartedTo'] !== undefined) {
            queryParameters['filter_started_to'] = parameters['filterStartedTo'];
        }

        if (parameters['filterFinishedFrom'] !== undefined) {
            queryParameters['filter_finished_from'] = parameters['filterFinishedFrom'];
        }

        if (parameters['filterFinishedTo'] !== undefined) {
            queryParameters['filter_finished_to'] = parameters['filterFinishedTo'];
        }

        if (parameters['filterExecutionStartedFrom'] !== undefined) {
            queryParameters['filter_execution_started_from'] = parameters['filterExecutionStartedFrom'];
        }

        if (parameters['filterExecutionStartedTo'] !== undefined) {
            queryParameters['filter_execution_started_to'] = parameters['filterExecutionStartedTo'];
        }

        if (parameters['filterExecutionFinishedFrom'] !== undefined) {
            queryParameters['filter_execution_finished_from'] = parameters['filterExecutionFinishedFrom'];
        }

        if (parameters['filterExecutionFinishedTo'] !== undefined) {
            queryParameters['filter_execution_finished_to'] = parameters['filterExecutionFinishedTo'];
        }

        if (parameters['filterIncrementStrategy'] !== undefined) {
            queryParameters['filter_increment_strategy'] = parameters['filterIncrementStrategy'];
        }

        if (parameters['filterStatus'] !== undefined) {
            queryParameters['filter_status'] = parameters['filterStatus'];
        }

        if (parameters['filterTestMode'] !== undefined) {
            queryParameters['filter_test_mode'] = parameters['filterTestMode'];
        }

        if (parameters['filterStartIntervalFrom'] !== undefined) {
            queryParameters['filter_start_interval_from'] = parameters['filterStartIntervalFrom'];
        }

        if (parameters['filterStartIntervalTo'] !== undefined) {
            queryParameters['filter_start_interval_to'] = parameters['filterStartIntervalTo'];
        }

        if (parameters['filterParticipantTimeoutFrom'] !== undefined) {
            queryParameters['filter_participant_timeout_from'] = parameters['filterParticipantTimeoutFrom'];
        }

        if (parameters['filterParticipantTimeoutTo'] !== undefined) {
            queryParameters['filter_participant_timeout_to'] = parameters['filterParticipantTimeoutTo'];
        }

        if (parameters['filterActive'] !== undefined) {
            queryParameters['filter_active'] = parameters['filterActive'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves project test run info. Project and run must
    be previously created
     * @method
     * @name Test#readProjectRun
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readProjectRun = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all project run participant info.
     * @method
     * @name Test#readAllProjectRunParticipants
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllProjectRunParticipants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterNumFrom'] !== undefined) {
            queryParameters['filter_num_from'] = parameters['filterNumFrom'];
        }

        if (parameters['filterNumTo'] !== undefined) {
            queryParameters['filter_num_to'] = parameters['filterNumTo'];
        }

        if (parameters['filterGroupName'] !== undefined) {
            queryParameters['filter_group_name'] = parameters['filterGroupName'];
        }

        if (parameters['filterGroupNumFrom'] !== undefined) {
            queryParameters['filter_group_num_from'] = parameters['filterGroupNumFrom'];
        }

        if (parameters['filterGroupNumTo'] !== undefined) {
            queryParameters['filter_group_num_to'] = parameters['filterGroupNumTo'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves project run participant info. Run, run
    participant must be previously created
     * @method
     * @name Test#readProjectRunParticipant
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.runParticipantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readProjectRunParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/participants/{runParticipantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{runParticipantID}', parameters['runParticipantId']);

        if (parameters['runParticipantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runParticipantId'));
            return deferred.promise;
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all project run results. Project, run must be
    previously created and run has to be finished in order to get results
     * @method
     * @name Test#readAllProjectResults
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterEndFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterEndTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStatus - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterSeleniumResult - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterDone - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllProjectResults = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/results/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterNumFrom'] !== undefined) {
            queryParameters['filter_num_from'] = parameters['filterNumFrom'];
        }

        if (parameters['filterNumTo'] !== undefined) {
            queryParameters['filter_num_to'] = parameters['filterNumTo'];
        }

        if (parameters['filterGroupName'] !== undefined) {
            queryParameters['filter_group_name'] = parameters['filterGroupName'];
        }

        if (parameters['filterGroupNumFrom'] !== undefined) {
            queryParameters['filter_group_num_from'] = parameters['filterGroupNumFrom'];
        }

        if (parameters['filterGroupNumTo'] !== undefined) {
            queryParameters['filter_group_num_to'] = parameters['filterGroupNumTo'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        if (parameters['filterStartFrom'] !== undefined) {
            queryParameters['filter_start_from'] = parameters['filterStartFrom'];
        }

        if (parameters['filterStartTo'] !== undefined) {
            queryParameters['filter_start_to'] = parameters['filterStartTo'];
        }

        if (parameters['filterEndFrom'] !== undefined) {
            queryParameters['filter_end_from'] = parameters['filterEndFrom'];
        }

        if (parameters['filterEndTo'] !== undefined) {
            queryParameters['filter_end_to'] = parameters['filterEndTo'];
        }

        if (parameters['filterStatus'] !== undefined) {
            queryParameters['filter_status'] = parameters['filterStatus'];
        }

        if (parameters['filterSeleniumResult'] !== undefined) {
            queryParameters['filter_selenium_result'] = parameters['filterSeleniumResult'];
        }

        if (parameters['filterDone'] !== undefined) {
            queryParameters['filter_done'] = parameters['filterDone'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all project result statisctics. Project and run
    must be previously created
     * @method
     * @name Test#readProjectResultStatistics
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readProjectResultStatistics = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/results/statistics/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves single project run result info. Project, run and
    result must be previously created
     * @method
     * @name Test#readProjectResult
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.resultId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readProjectResult = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/runs/{runID}/results/{resultID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{resultID}', parameters['resultId']);

        if (parameters['resultId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: resultId'));
            return deferred.promise;
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test info. Project must be previously created
     * @method
     * @name Test#readAllTests
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterTestMode - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterIncrementStrategy - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllTests = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterTestMode'] !== undefined) {
            queryParameters['filter_test_mode'] = parameters['filterTestMode'];
        }

        if (parameters['filterIncrementStrategy'] !== undefined) {
            queryParameters['filter_increment_strategy'] = parameters['filterIncrementStrategy'];
        }

        if (parameters['filterStartIntervalFrom'] !== undefined) {
            queryParameters['filter_start_interval_from'] = parameters['filterStartIntervalFrom'];
        }

        if (parameters['filterStartIntervalTo'] !== undefined) {
            queryParameters['filter_start_interval_to'] = parameters['filterStartIntervalTo'];
        }

        if (parameters['filterParticipantTimeoutFrom'] !== undefined) {
            queryParameters['filter_participant_timeout_from'] = parameters['filterParticipantTimeoutFrom'];
        }

        if (parameters['filterParticipantTimeoutTo'] !== undefined) {
            queryParameters['filter_participant_timeout_to'] = parameters['filterParticipantTimeoutTo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new test with given data.
     * @method
     * @name Test#createTest
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.id - readonly: true
         * @param {string} parameters.created - readonly: true
         * @param {string} parameters.updated - readonly: true
         * @param {integer} parameters.projectId - readonly: true
         * @param {string} parameters.name - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.scriptFileId - readonly: true
         * @param {integer} parameters.startInterval - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantTimeout - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.mode - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.incrementStrategy - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {boolean} parameters.deleted - readonly: true
         * @param {integer} parameters.groupCount - readonly: true
         * @param {integer} parameters.participantCount - readonly: true
         * @param {string} parameters.script - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createTest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['id'] !== undefined) {
            queryParameters['id'] = parameters['id'];
        }

        if (parameters['created'] !== undefined) {
            queryParameters['created'] = parameters['created'];
        }

        if (parameters['updated'] !== undefined) {
            queryParameters['updated'] = parameters['updated'];
        }

        if (parameters['projectId'] !== undefined) {
            queryParameters['project_id'] = parameters['projectId'];
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['name'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: name'));
            return deferred.promise;
        }

        if (parameters['scriptFileId'] !== undefined) {
            queryParameters['script_file_id'] = parameters['scriptFileId'];
        }

        if (parameters['startInterval'] !== undefined) {
            queryParameters['start_interval'] = parameters['startInterval'];
        }

        if (parameters['startInterval'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: startInterval'));
            return deferred.promise;
        }

        if (parameters['participantTimeout'] !== undefined) {
            queryParameters['participant_timeout'] = parameters['participantTimeout'];
        }

        if (parameters['participantTimeout'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantTimeout'));
            return deferred.promise;
        }

        if (parameters['mode'] !== undefined) {
            queryParameters['mode'] = parameters['mode'];
        }

        if (parameters['mode'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: mode'));
            return deferred.promise;
        }

        if (parameters['incrementStrategy'] !== undefined) {
            queryParameters['increment_strategy'] = parameters['incrementStrategy'];
        }

        if (parameters['incrementStrategy'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incrementStrategy'));
            return deferred.promise;
        }

        if (parameters['deleted'] !== undefined) {
            queryParameters['deleted'] = parameters['deleted'];
        }

        if (parameters['groupCount'] !== undefined) {
            queryParameters['group_count'] = parameters['groupCount'];
        }

        if (parameters['participantCount'] !== undefined) {
            queryParameters['participant_count'] = parameters['participantCount'];
        }

        if (parameters['script'] !== undefined) {
            queryParameters['script'] = parameters['script'];
        }

        if (parameters['script'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: script'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves test info. Project and test must be previously
    created
     * @method
     * @name Test#readTest
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readTest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates test with given properties. Project and test must
    be previously created
     * @method
     * @name Test#updateTest
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.id - readonly: true
         * @param {string} parameters.created - readonly: true
         * @param {string} parameters.updated - readonly: true
         * @param {integer} parameters.projectId - readonly: true
         * @param {string} parameters.name - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.scriptFileId - readonly: true
         * @param {integer} parameters.startInterval - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantTimeout - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.mode - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.incrementStrategy - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {boolean} parameters.deleted - readonly: true
         * @param {integer} parameters.groupCount - readonly: true
         * @param {integer} parameters.participantCount - readonly: true
         * @param {string} parameters.script - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updateTest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['id'] !== undefined) {
            queryParameters['id'] = parameters['id'];
        }

        if (parameters['created'] !== undefined) {
            queryParameters['created'] = parameters['created'];
        }

        if (parameters['updated'] !== undefined) {
            queryParameters['updated'] = parameters['updated'];
        }

        if (parameters['projectId'] !== undefined) {
            queryParameters['project_id'] = parameters['projectId'];
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['name'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: name'));
            return deferred.promise;
        }

        if (parameters['scriptFileId'] !== undefined) {
            queryParameters['script_file_id'] = parameters['scriptFileId'];
        }

        if (parameters['startInterval'] !== undefined) {
            queryParameters['start_interval'] = parameters['startInterval'];
        }

        if (parameters['startInterval'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: startInterval'));
            return deferred.promise;
        }

        if (parameters['participantTimeout'] !== undefined) {
            queryParameters['participant_timeout'] = parameters['participantTimeout'];
        }

        if (parameters['participantTimeout'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantTimeout'));
            return deferred.promise;
        }

        if (parameters['mode'] !== undefined) {
            queryParameters['mode'] = parameters['mode'];
        }

        if (parameters['mode'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: mode'));
            return deferred.promise;
        }

        if (parameters['incrementStrategy'] !== undefined) {
            queryParameters['increment_strategy'] = parameters['incrementStrategy'];
        }

        if (parameters['incrementStrategy'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: incrementStrategy'));
            return deferred.promise;
        }

        if (parameters['deleted'] !== undefined) {
            queryParameters['deleted'] = parameters['deleted'];
        }

        if (parameters['groupCount'] !== undefined) {
            queryParameters['group_count'] = parameters['groupCount'];
        }

        if (parameters['participantCount'] !== undefined) {
            queryParameters['participant_count'] = parameters['participantCount'];
        }

        if (parameters['script'] !== undefined) {
            queryParameters['script'] = parameters['script'];
        }

        if (parameters['script'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: script'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes test. Project and test must be previously created
     * @method
     * @name Test#deleteTest
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deleteTest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all assert info. Test must be previously created
     * @method
     * @name Test#readAllAsserts
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterPath - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterOperator - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExpected - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllAsserts = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        if (parameters['filterPath'] !== undefined) {
            queryParameters['filter_path'] = parameters['filterPath'];
        }

        if (parameters['filterOperator'] !== undefined) {
            queryParameters['filter_operator'] = parameters['filterOperator'];
        }

        if (parameters['filterExpected'] !== undefined) {
            queryParameters['filter_expected'] = parameters['filterExpected'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new assert with given data.
     * @method
     * @name Test#createAssert
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.assert - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createAssert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['assert'] !== undefined) {
            body = parameters['assert'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves assert info. Test and assert must be previously
    created
     * @method
     * @name Test#readAssert
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAssert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates assert with given properties. Test and assert must
    be previously created
     * @method
     * @name Test#updateAssert
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.assert - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updateAssert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['assert'] !== undefined) {
            body = parameters['assert'];
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes assert. Test and assert must be previously created
     * @method
     * @name Test#deleteAssert
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deleteAssert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint duplicates given assert. Test and assert must be previously
    created.
     * @method
     * @name Test#duplicateAssert
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.duplicateAssert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/copy/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all assert precodndition info. Assert must be
    previously created
     * @method
     * @name Test#readAllPreconditions
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterProperty - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterOperator - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExpected - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllPreconditions = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/preconditions/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        if (parameters['filterProperty'] !== undefined) {
            queryParameters['filter_property'] = parameters['filterProperty'];
        }

        if (parameters['filterOperator'] !== undefined) {
            queryParameters['filter_operator'] = parameters['filterOperator'];
        }

        if (parameters['filterExpected'] !== undefined) {
            queryParameters['filter_expected'] = parameters['filterExpected'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new assert precondition with given data.
     * @method
     * @name Test#createPrecondition
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.precondition - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createPrecondition = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/preconditions/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['precondition'] !== undefined) {
            body = parameters['precondition'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves assert precondition info. Assert and precondition
    must be previously created
     * @method
     * @name Test#readPrecondition
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.preconditionId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readPrecondition = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/preconditions/{preconditionID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{preconditionID}', parameters['preconditionId']);

        if (parameters['preconditionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: preconditionId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates assert precondition with given properties. Assert
    and precondition must be previously created
     * @method
     * @name Test#updatePrecondition
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.precondition - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.preconditionId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updatePrecondition = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/preconditions/{preconditionID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['precondition'] !== undefined) {
            body = parameters['precondition'];
        }

        path = path.replace('{preconditionID}', parameters['preconditionId']);

        if (parameters['preconditionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: preconditionId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes assert precondition. Assert and precondition must
    be previously created
     * @method
     * @name Test#deletePrecondition
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.preconditionId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.assertId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deletePrecondition = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/asserts/{assertID}/preconditions/{preconditionID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{preconditionID}', parameters['preconditionId']);

        if (parameters['preconditionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: preconditionId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{assertID}', parameters['assertId']);

        if (parameters['assertId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: assertId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint duplicates given test. If no copy name is provided an
    "Copy of" prefix will be applied to the test name. Project and test must
    be previously created.
     * @method
     * @name Test#duplicateTest
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.body - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.duplicateTest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/copy/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all group info. Test must be previously created
     * @method
     * @name Test#readAllGroups
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllGroups = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterCountFrom'] !== undefined) {
            queryParameters['filter_count_from'] = parameters['filterCountFrom'];
        }

        if (parameters['filterCountTo'] !== undefined) {
            queryParameters['filter_count_to'] = parameters['filterCountTo'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new group with given data.
     * @method
     * @name Test#createGroup
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.group - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves group info. Test and group must be previously
    created
     * @method
     * @name Test#readGroup
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates group with given properties. Test and group must
    be previously created
     * @method
     * @name Test#updateGroup
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.group - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updateGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['group'] !== undefined) {
            body = parameters['group'];
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes group. Test and group must be previously created
     * @method
     * @name Test#deleteGroup
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deleteGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint duplicates given group. If no copy name is provided an
    "Copy of" prefix will be applied to the group name. Test and group must
    be previously created.
     * @method
     * @name Test#duplicateGroup
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.body - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.duplicateGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/copy/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all group participant info.
     * @method
     * @name Test#readAllGroupParticipants
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterComputeUnit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterHasGroup - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllGroupParticipants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterCountFrom'] !== undefined) {
            queryParameters['filter_count_from'] = parameters['filterCountFrom'];
        }

        if (parameters['filterCountTo'] !== undefined) {
            queryParameters['filter_count_to'] = parameters['filterCountTo'];
        }

        if (parameters['filterComputeUnit'] !== undefined) {
            queryParameters['filter_compute_unit'] = parameters['filterComputeUnit'];
        }

        if (parameters['filterHasGroup'] !== undefined) {
            queryParameters['filter_has_group'] = parameters['filterHasGroup'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new group participant with given properties.
     * @method
     * @name Test#createGroupParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.participant - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createGroupParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['participant'] !== undefined) {
            body = parameters['participant'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves group participant info.
     * @method
     * @name Test#readGroupParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readGroupParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates group participant with given properties.
     * @method
     * @name Test#updateGroupParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.participant - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updateGroupParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['participant'] !== undefined) {
            body = parameters['participant'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes group participant.
     * @method
     * @name Test#deleteGroupParticipant
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deleteGroupParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint duplicates given group participant. If no copy name is
    provided an "Copy of" prefix will be applied to the participant name.
     * @method
     * @name Test#duplicateGroupParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.groupId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.duplicateGroupParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/groups/{groupID}/participants/{participantID}/copy/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{groupID}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all participant info.
     * @method
     * @name Test#readAllParticipants
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterCountTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterComputeUnit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterHasGroup - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllParticipants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterCountFrom'] !== undefined) {
            queryParameters['filter_count_from'] = parameters['filterCountFrom'];
        }

        if (parameters['filterCountTo'] !== undefined) {
            queryParameters['filter_count_to'] = parameters['filterCountTo'];
        }

        if (parameters['filterComputeUnit'] !== undefined) {
            queryParameters['filter_compute_unit'] = parameters['filterComputeUnit'];
        }

        if (parameters['filterHasGroup'] !== undefined) {
            queryParameters['filter_has_group'] = parameters['filterHasGroup'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint creates new participant with given properties.
     * @method
     * @name Test#createParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.participant - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['participant'] !== undefined) {
            body = parameters['participant'];
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves participant info.
     * @method
     * @name Test#readParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint updates participant with given properties.
     * @method
     * @name Test#updateParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.participant - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.updateParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['participant'] !== undefined) {
            body = parameters['participant'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint deletes participant.
     * @method
     * @name Test#deleteParticipant
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.deleteParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/{participantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint duplicates given participant. If no copy name is provided
    an "Copy of" prefix will be applied to the participant name. Group and
    participant must be previously created.
     * @method
     * @name Test#duplicateParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {} parameters.body - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.participantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.duplicateParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/participants/{participantID}/copy/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        path = path.replace('{participantID}', parameters['participantId']);

        if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test run info. Project and test must be
    previously created
     * @method
     * @name Test#readAllTestRuns
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterTestName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterFinishedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterFinishedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionStartedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionStartedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionFinishedFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterExecutionFinishedTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterIncrementStrategy - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStatus - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterTestMode - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartIntervalTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterParticipantTimeoutTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterActive - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllTestRuns = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterTestName'] !== undefined) {
            queryParameters['filter_test_name'] = parameters['filterTestName'];
        }

        if (parameters['filterStartedFrom'] !== undefined) {
            queryParameters['filter_started_from'] = parameters['filterStartedFrom'];
        }

        if (parameters['filterStartedTo'] !== undefined) {
            queryParameters['filter_started_to'] = parameters['filterStartedTo'];
        }

        if (parameters['filterFinishedFrom'] !== undefined) {
            queryParameters['filter_finished_from'] = parameters['filterFinishedFrom'];
        }

        if (parameters['filterFinishedTo'] !== undefined) {
            queryParameters['filter_finished_to'] = parameters['filterFinishedTo'];
        }

        if (parameters['filterExecutionStartedFrom'] !== undefined) {
            queryParameters['filter_execution_started_from'] = parameters['filterExecutionStartedFrom'];
        }

        if (parameters['filterExecutionStartedTo'] !== undefined) {
            queryParameters['filter_execution_started_to'] = parameters['filterExecutionStartedTo'];
        }

        if (parameters['filterExecutionFinishedFrom'] !== undefined) {
            queryParameters['filter_execution_finished_from'] = parameters['filterExecutionFinishedFrom'];
        }

        if (parameters['filterExecutionFinishedTo'] !== undefined) {
            queryParameters['filter_execution_finished_to'] = parameters['filterExecutionFinishedTo'];
        }

        if (parameters['filterIncrementStrategy'] !== undefined) {
            queryParameters['filter_increment_strategy'] = parameters['filterIncrementStrategy'];
        }

        if (parameters['filterStatus'] !== undefined) {
            queryParameters['filter_status'] = parameters['filterStatus'];
        }

        if (parameters['filterTestMode'] !== undefined) {
            queryParameters['filter_test_mode'] = parameters['filterTestMode'];
        }

        if (parameters['filterStartIntervalFrom'] !== undefined) {
            queryParameters['filter_start_interval_from'] = parameters['filterStartIntervalFrom'];
        }

        if (parameters['filterStartIntervalTo'] !== undefined) {
            queryParameters['filter_start_interval_to'] = parameters['filterStartIntervalTo'];
        }

        if (parameters['filterParticipantTimeoutFrom'] !== undefined) {
            queryParameters['filter_participant_timeout_from'] = parameters['filterParticipantTimeoutFrom'];
        }

        if (parameters['filterParticipantTimeoutTo'] !== undefined) {
            queryParameters['filter_participant_timeout_to'] = parameters['filterParticipantTimeoutTo'];
        }

        if (parameters['filterActive'] !== undefined) {
            queryParameters['filter_active'] = parameters['filterActive'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint starts test execution. Project and test must be previously
    created
     * @method
     * @name Test#createTestRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.createTestRun = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves test run info. Project, test and run must be
    previously created
     * @method
     * @name Test#readTestRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readTestRun = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test run participant info.
     * @method
     * @name Test#readAllTestRunParticipants
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllTestRunParticipants = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/participants/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterNumFrom'] !== undefined) {
            queryParameters['filter_num_from'] = parameters['filterNumFrom'];
        }

        if (parameters['filterNumTo'] !== undefined) {
            queryParameters['filter_num_to'] = parameters['filterNumTo'];
        }

        if (parameters['filterGroupName'] !== undefined) {
            queryParameters['filter_group_name'] = parameters['filterGroupName'];
        }

        if (parameters['filterGroupNumFrom'] !== undefined) {
            queryParameters['filter_group_num_from'] = parameters['filterGroupNumFrom'];
        }

        if (parameters['filterGroupNumTo'] !== undefined) {
            queryParameters['filter_group_num_to'] = parameters['filterGroupNumTo'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves test run participant info. Run, run participant
    must be previously created
     * @method
     * @name Test#readTestRunParticipant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runParticipantId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readTestRunParticipant = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/participants/{runParticipantID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runParticipantID}', parameters['runParticipantId']);

        if (parameters['runParticipantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runParticipantId'));
            return deferred.promise;
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test run results. Project, test, run must be
    previously created and run has to be finished in order to get results
     * @method
     * @name Test#readAllTestResults
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.offset - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterBrowser - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNetwork - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterLocation - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterMediaType - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupName - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterGroupNumTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterRecordAudio - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStartTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterEndFrom - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterEndTo - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterStatus - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterSeleniumResult - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {string} parameters.filterDone - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readAllTestResults = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/results/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['filterBrowser'] !== undefined) {
            queryParameters['filter_browser'] = parameters['filterBrowser'];
        }

        if (parameters['filterNetwork'] !== undefined) {
            queryParameters['filter_network'] = parameters['filterNetwork'];
        }

        if (parameters['filterLocation'] !== undefined) {
            queryParameters['filter_location'] = parameters['filterLocation'];
        }

        if (parameters['filterMediaType'] !== undefined) {
            queryParameters['filter_media_type'] = parameters['filterMediaType'];
        }

        if (parameters['filterName'] !== undefined) {
            queryParameters['filter_name'] = parameters['filterName'];
        }

        if (parameters['filterNumFrom'] !== undefined) {
            queryParameters['filter_num_from'] = parameters['filterNumFrom'];
        }

        if (parameters['filterNumTo'] !== undefined) {
            queryParameters['filter_num_to'] = parameters['filterNumTo'];
        }

        if (parameters['filterGroupName'] !== undefined) {
            queryParameters['filter_group_name'] = parameters['filterGroupName'];
        }

        if (parameters['filterGroupNumFrom'] !== undefined) {
            queryParameters['filter_group_num_from'] = parameters['filterGroupNumFrom'];
        }

        if (parameters['filterGroupNumTo'] !== undefined) {
            queryParameters['filter_group_num_to'] = parameters['filterGroupNumTo'];
        }

        if (parameters['filterRecordAudio'] !== undefined) {
            queryParameters['filter_record_audio'] = parameters['filterRecordAudio'];
        }

        if (parameters['filterStartFrom'] !== undefined) {
            queryParameters['filter_start_from'] = parameters['filterStartFrom'];
        }

        if (parameters['filterStartTo'] !== undefined) {
            queryParameters['filter_start_to'] = parameters['filterStartTo'];
        }

        if (parameters['filterEndFrom'] !== undefined) {
            queryParameters['filter_end_from'] = parameters['filterEndFrom'];
        }

        if (parameters['filterEndTo'] !== undefined) {
            queryParameters['filter_end_to'] = parameters['filterEndTo'];
        }

        if (parameters['filterStatus'] !== undefined) {
            queryParameters['filter_status'] = parameters['filterStatus'];
        }

        if (parameters['filterSeleniumResult'] !== undefined) {
            queryParameters['filter_selenium_result'] = parameters['filterSeleniumResult'];
        }

        if (parameters['filterDone'] !== undefined) {
            queryParameters['filter_done'] = parameters['filterDone'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all test result statisctics. Project, test and
    run must be previously created
     * @method
     * @name Test#readTestResultStatistics
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readTestResultStatistics = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/results/statistics/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves single test run result info. Project, test, run
    and result must be previously created
     * @method
     * @name Test#readTestResult
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.describe - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.resultId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readTestResult = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/results/{resultID}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['describe'] !== undefined) {
            queryParameters['describe'] = parameters['describe'];
        }

        path = path.replace('{resultID}', parameters['resultId']);

        if (parameters['resultId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: resultId'));
            return deferred.promise;
        }

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint stops test run. Project, test and run must be
    previously created. Test run needs to be in progress.
     * @method
     * @name Test#stopTestRun
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.runId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.testId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
         * @param {integer} parameters.projectId - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.stopTestRun = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/projects/{projectID}/tests/{testID}/runs/{runID}/stop/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{runID}', parameters['runId']);

        if (parameters['runId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: runId'));
            return deferred.promise;
        }

        path = path.replace('{testID}', parameters['testId']);

        if (parameters['testId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: testId'));
            return deferred.promise;
        }

        path = path.replace('{projectID}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all static resource info
     * @method
     * @name Test#readAllStatics
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.readAllStatics = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/statics/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all available metric paths
     * @method
     * @name Test#readMetricPath
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.readMetricPath = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/statics/metric_path/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all static type info
     * @method
     * @name Test#readAllStaticTypes
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.readAllStaticTypes = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/statics/types/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint retrieves all specified static resource info
     * @method
     * @name Test#readStaticResource
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.resource - This application serves main Loadero's endpoints that can be used to
    manipulate test data and other services
     */
    Test.prototype.readStaticResource = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var domain = this.domain,
            path = '/statics/{resource}/';
        var body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{resource}', parameters['resource']);

        if (parameters['resource'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: resource'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return Test;
})();

exports.Test = Test;
