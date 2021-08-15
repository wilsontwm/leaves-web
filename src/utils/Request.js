import empty from 'is-empty';
import qs from 'query-string';

class Request {
  constructor(attrs, url) {
    this.body = attrs.body || {};
    this.query = attrs.query || {};
    this.success = typeof attrs.success === 'function' ? attrs.success : () => { };
    this.error = attrs.error || (() => { });
    this.finally = attrs.finally || (() => { });

    this.url = url;
    if (!empty(attrs.query)) {
      this.url = `${url}?${qs.stringify(attrs.query)}`;
    }
  }
}

export default Request;
