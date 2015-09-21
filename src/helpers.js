/**
 * Sandcrawler Dashboard Helpers
 * ==============================
 *
 * Miscellaneous utility functions.
 */
import {default as nodeUrl} from 'url';
import {last} from 'lodash';

function pad(nb) {
  const nbstr = '' + nb;

  if (nbstr.length < 2)
    return '0' + nb;
  return nbstr;
}

export function formatHMS(seconds) {
  const hours = (seconds / 3600) | 0,
        minutes = ((seconds - (hours * 3600)) / 60) | 0,
        secs = Math.round(seconds) % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
}

export function formatMS(seconds) {
  const minutes = (seconds / 60) | 0,
        secs = Math.round(seconds) % 60;
  return pad(minutes) + ':' + pad(secs);
}

export function formatUrl(url, pad) {
  pad = pad || 45;

  let truncatedUrl = url.slice(-pad);

  if (truncatedUrl.length !== url.length) {
    const parsed = nodeUrl.parse(url),
        root = parsed.protocol + '//' +  parsed.host;

    if (root.length > pad - 5) {
      truncatedUrl = root.slice(-pad - 2) + '...';
    }
    else {
      truncatedUrl = (root + '/../' + last(parsed.path.split('/')));

      if (truncatedUrl.length > pad)
        truncatedUrl = root + '/../..';
    }
  }

  return truncatedUrl;
}
