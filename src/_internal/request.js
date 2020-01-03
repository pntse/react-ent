import axios from 'axios';
import ReactEnt from '../ReactEnt';
import { get, has } from '@react-ent/utils';
import { methods } from './methods';

export const request = async (payload, model, method) => {
  const nullableParams = model.nullableParams;
  const apiUriOverride = model.apiUriOverride;
  const headers = get(ReactEnt, 'config.api.headers', {});
  const defaultAdapter = get(ReactEnt, 'config.api.adapter');
  const uri = apiUriOverride ? apiUriOverride : get(ReactEnt, 'config.api.uri', '');
  const path = formatPath(payload.path, payload.query, payload.body, method, nullableParams);

  // No path specified. Return undefined.
  if (path === undefined || path === '') return;

  switch (method) {
    case methods.GET:
      return has(model, 'plugins.api')
        ? await model.plugins.api.get({ url: uri + path, headers })
        : await axios.get(uri + path, { headers });
    case methods.POST:
      if(has(model, 'plugins.api')) return await model.plugins.api.post({ url: uri + path, headers: headers, data: payload.body });
    case methods.DELETE:
      if(has(model, 'plugins.api')) return await model.plugins.api.del({ url: uri + path, headers: headers, data: payload.body });
    case methods.PUT:
      if(has(model, 'plugins.api')) return await model.plugins.api.put({ url: uri + path, headers: headers, data: payload.body });
    case methods.PATCH:
      if(has(model, 'plugins.api')) {
        return await model.plugins.api.patch({ url: uri + path, headers: headers, data: payload.body });
      }

      return await axios({
        method: method,
        url: uri + path,
        headers: headers,
        data: payload.body
      });
    default:
      // Unknown method specified. Return undefined.
      return;
  }
};

export const formatPath = (path, payloadQuery, payloadBody, method, nullableParams) => {
  // Check for null params if they aren't allowed.
  if (!nullableParams) {
    if (payloadQuery) {
      for (let key in payloadQuery) {
        if (typeof payloadQuery[key] === 'undefined' || payloadQuery[key] === null) {
          // Params cannot be null. Return undefined.
          return;
        }
      }
    } else if (payloadBody) {
      for (let key in payloadBody) {
        if (typeof payloadBody[key] === 'undefined' || payloadBody[key] === null) {
          // Params cannot be null. Return undefined.
          return;
        }
      }
    }
  }

  // If request is not a GET or is a GET and has no params, return the base path.
  if (path && (method !== methods.GET || (!payloadQuery && !payloadBody))) return path;

  // If payloadQuery exists, return the path with the params appended.
  if (path && payloadQuery) {
    let returnValue;

    // Create an array of all payload keys.
    let queryStringKeys = [];
    for (let key in payloadQuery) {
      queryStringKeys.push(key);
    }

    // Replace all the :key instances with the actual values given.
    returnValue = path
      .split('/')
      .map((section, index) => {
        if (section.includes(':')) {
          const key = section.match(/:(.*)/).pop();

          // Remove key from queryStringKeys array since it is a path param.
          const index = queryStringKeys.indexOf(key);
          queryStringKeys.splice(index, 1);

          return section.replace(':' + key, payloadQuery[key]);
        }

        return section;
      })
      .join('/');

    const query = [];

    // Create query string with query string params.
    for (let key in payloadQuery) {
      if (queryStringKeys.includes(key)) {
        query.push(`${key}=${payloadQuery[key]}`);
      }
    }

    if (query.length > 0) {
      returnValue += '?' + query.join('&');
    }

    return returnValue;
  }

  // Could not format the path. Return undefined.
  return;
};
