import axios from 'axios';
import { validateRss } from './validation.js';

export default function rssParser(url, id) {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

  return axios
    .get(`${proxyUrl}${encodeURIComponent(url)}`)
    .catch(() => {
      throw { message: { key: 'network' } };
    })
    .then((response) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data.contents, 'application/xml');

      validateRss(doc);

      const chanel = doc.querySelector('channel') || doc.querySelector('feed');
      const items = Array.from(chanel.children);

      const title = items.find((item) => item.nodeName === 'title').textContent ?? 'Unknown title';
      const description =
        items.find((item) => item.nodeName === 'description').textContent ?? 'Unknown description';

      const posts = items
        .filter((item) => item.nodeName === 'item')
        .map((item) => {
          const title = item.querySelector('title').textContent ?? 'Unknown post title';
          const link = item.querySelector('link').textContent;
          const description =
            item.querySelector('description').textContent ?? 'Unknown post description';

          return { title, link, description, feedId: id };
        });

      return { link: url, title, description, id, posts };
    });
}
