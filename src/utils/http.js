import rootStore from '../stores/Root';
import {API_ROOT} from '../config';

const defaultHeaders = {
  Accept: 'application/json',
  'Accept-Charset': 'utf-8',
  'Content-Type': 'application/json',
};

function formatUri(uri) {
  const url = uri.replace(new RegExp('/+$/g'), '');
  if (new RegExp('^http|https').test(url)) {
    return `${uri}`;
  }
  return `${API_ROOT}${url}`;
}
const rxOne = /^[\],:{}\s]*$/;
const rxTwo = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g;
const rxThree =
  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g;
const rxFour = /(?:^|:|,)(?:\s*\[)+/g;
const isJSON = (input) =>
  input.length &&
  rxOne.test(
    input.replace(rxTwo, '@').replace(rxThree, ']').replace(rxFour, '')
  );

const fetching = (
  uriInput = '',
  method = 'GET',
  body = {},
  customHeaders = {}
) => {
  const uri = formatUri(uriInput);
  const jsonBody = JSON.stringify(body);
  const authHeaders = {
    'Content-Length': `${jsonBody.length}`,
    Authorization: `${sessionStorage.getItem('accessToken')}`,
  };
  const headers = Object.assign({}, defaultHeaders, authHeaders, customHeaders);
  const data = {
    method,
    headers,
    mode: 'cors',
    credentials: 'include',
  };
  if (method !== 'GET') {
    Object.assign(data, {
      body: jsonBody,
    });
  }

  const fetchAPI = fetch(uri, data)
    .then((resp) => {

      if (!resp.ok) {
        return resp.text().then((text) => {
          const json = isJSON(text) ? JSON.parse(text) : {};
          if (json.error) {
            rootStore.uiStore.noty.error(json.error);
          } else if (json.errors) {
            Object.values(json.errors).map((each) => {
              if (typeof each === 'object') {
                const keys = Object.keys(each);
                return keys.map((key) => rootStore.uiStore.noty.error(each[key]));
              }
              return rootStore.uiStore.noty.error(each);
            });
          }
          return Promise.reject({
            statusCode: resp.status,
            message: json.error
          });
        });
      }
      return resp.text().then((text) => {
        const json = isJSON(text) ? JSON.parse(text) : {};
        return Promise.resolve(json);
      });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        return Promise.reject(err).then(
          () => {},
          () => {
            sessionStorage.clear();
            location.replace('/#inactive');
          }
        );
      }

      return Promise.reject(err);
    });
  return Promise.race([
    fetchAPI,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('timeout');
      }, 120000);
    }),
  ]);
};

const GET = (uri, body, customHeaders) =>
  fetching(uri, 'GET', body, customHeaders);
const POST = (uri, body, customHeaders) =>
  fetching(uri, 'POST', body, customHeaders);
const PATCH = (uri, body, customHeaders) =>
  fetching(uri, 'PATCH', body, customHeaders);
const PUT = (uri, body, customHeaders) =>
  fetching(uri, 'PUT', body, customHeaders);
const DELETE = (uri, body, customHeaders) =>
  fetching(uri, 'DELETE', body, customHeaders);

const DEFAULT_HEADERS = defaultHeaders;
export default {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
};

export {DEFAULT_HEADERS, formatUri};
