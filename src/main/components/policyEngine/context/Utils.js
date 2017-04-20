/**
 * Created by hjiang on 3/9/17.
 */

/**
 * Copyright 2016 PT Inovação e Sistemas SA
 * Copyright 2016 INESC-ID
 * Copyright 2016 QUOBIS NETWORKS SL
 * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
 * Copyright 2016 ORANGE SA
 * Copyright 2016 Deutsche Telekom AG
 * Copyright 2016 Apizee
 * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
 * Copyright 2016 Telecom Bretagne
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
/**
 * Support module with some functions will be useful
 * @module utils
 */

/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */

/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
module.exports = {
 divideURL: function(url) {

    if (!url) return;

    // let re = /([a-zA-Z-]*)?:\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;
    let re = /([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
    let subst = '$1,$2,$3';
    let parts = url.replace(re, subst).split(',');

    // If the url has no protocol, the default protocol set is https
    if (parts[0] === url) {
        parts[0] = 'https';
        parts[1] = url;
    }

    let result = {
        type: parts[0],
        domain: parts[1],
        identity: parts[2]
    };

    return result;
},

divideEmail: function(email) {
    if(!email) return;
    let indexOfAt = email.indexOf('@');

    let result = {
        username: email.substring(0, indexOfAt),
        domain: email.substring(indexOfAt + 1, email.length)
    };

    return result;
},

/**
 * Check if an Object is empty
 * @param  {Object} object Object to be checked
 * @return {Boolean}       status of Object, empty or not (true|false);
 */
emptyObject: function (object) {
    return Object.keys(object).length > 0 ? false : true;
},

/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
deepClone: function (obj) {
    //TODO: simple but inefficient JSON deep clone...
    if (obj) return JSON.parse(JSON.stringify(obj));
},

removePathFromURL: function (url) {
    let splitURL = url.split('/');
    return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
},

/**
 * Obtains the user URL that corresponds to a given email
 * @param  {string} userEmail The user email
 * @return {URL.URL} userURL The user URL
 */
getUserURLFromEmail: function (userEmail) {
    let indexOfAt = userEmail.indexOf('@');
    return 'user://' + userEmail.substring(indexOfAt + 1, userEmail.length) + '/' + userEmail.substring(0, indexOfAt);
},

/**
 * Obtains the user email that corresponds to a given URL
 * @param  {URL.URL} userURL The user URL
 * @return {string} userEmail The user email
 */

getUserEmailFromURL: function (userURL) {
    let url = module.exports.divideURL(userURL);
    return url.identity.replace('/', '') + '@' + url.domain; // identity field has '/exampleID' instead of 'exampleID'
},


/**
 * Check if the user identifier is already in the URL format, if not, convert to URL format
 * @param  {string}   identifier  user identifier
 * @return {string}   userURL    the user URL
 */
convertToUserURL: function (identifier) {

    // check if the identifier is already in the url format
    if (identifier.substring(0, 7) === 'user://') {
        let dividedURL = module.exports.divideURL(identifier);

        //check if the url is well formated
        if (dividedURL.domain && dividedURL.identity) {
            return identifier;
        } else {
            throw 'userURL with wrong format';
        }

        //if not, convert the user email to URL format
    } else {
        return getUserURLFromEmail(identifier);
    }
},

isDataObjectURL: function (url) {
    if (!url) return;
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain', 'hyperty'];
    let splitURL = (url).split('://');
    let urlSchema = splitURL[0];

    return schemasToIgnore.indexOf(urlSchema) === -1;
},

/**
 * get information relative each component configured on runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @return {object}               return an object with all configurations;
 */
getConfigurationResources: function (configuration, component, resource) {
    let objectResource = configuration[component];
    let resourceType = objectResource[resource];

    return resourceType;
},

/**
 * Build a full url with the runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @param  {string} type          resource to get, like a hyperty name or protocolstub name;
 * @param  {boolean} useFallback  if true the function will check if have a fallback url;
 * @return {string}               partial url to contact the resource;
 */
buildURL: function (configuration, component, resource, type, useFallback = false) {
    let objectResource = configuration[component];
    let url;

    if (!objectResource.hasOwnProperty(resource)) {
        throw Error('The configuration ' + JSON.stringify(objectResource, '', 2) + ' don\'t have the ' + resource + ' resource you are looking for');
    }

    let resourceType = objectResource[resource];

    if (type) {
        url = resourceType.prefix + configuration.domain + resourceType.suffix + type;
        if (resourceType.hasOwnProperty('fallback') && useFallback) {
            if (resourceType.fallback.indexOf('%domain%')) {
                url = resourceType.fallback.replace(/(%domain%)/g, configuration.domain) + type;
            } else {
                url = resourceType.fallback + type;
            }
        }
    } else {
        url = resourceType.prefix + configuration.domain + resourceType.suffix;
    }

    // console.log(url);

    return url;
}
};