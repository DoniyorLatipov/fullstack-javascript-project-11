import * as yup from 'yup';

yup.setLocale({
  string: {
    url: () => ({ key: 'invalid' }),
    required: () => ({ key: 'empty' }),
  },
});

const schema = yup.string().url().required();

export function validateUrl(url, watchedState) {
  return schema
    .test(
      'exists',
      () => ({ key: 'exists' }),
      (value) => !watchedState.feeds.some((feed) => feed.link === value),
    )
    .validate(url);
}

export function validateRss(doc) {
  const hasParseError = doc.querySelector('parsererror') === null;
  const hasFeedTag =
    doc.querySelector('rss') || doc.querySelector('feed') || doc.querySelector('rdf\\:RDF');

  const isRssFeed = hasParseError && hasFeedTag;

  if (!isRssFeed) {
    throw { message: { key: 'not_rss' } };
  }
}
