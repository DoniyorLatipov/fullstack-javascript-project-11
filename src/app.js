import setWatcher from './view.js';
import { validateUrl } from './validation.js';
import rssParser from './rssParser.js';

export default async (i18n) => {
  const state = {
    ui: {
      input: {
        state: 'idle',
        error: '',
      },
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.getElementById('rssForm'),
    input: document.getElementById('url-input'),
    output: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const watchedState = setWatcher(state, i18n, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const url = data.get('url').trim();

    Promise.resolve(url)
      .then((url) => validateUrl(url, watchedState))
      .then((url) => rssParser(url, idGen.generate()))
      .then(({ link, title, id, description, posts }) => {
        watchedState.ui.input.state = 'success';
        watchedState.ui.input.error = '';

        // reset form
        elements.input.value = '';
        elements.input.focus();

        // adding link
        watchedState.feeds.push({ title, description, link, id });
        watchedState.posts.push(...posts);
      })
      .catch((err) => {
        const key = err.isAxiosError ? 'network' : err.message.key;

        watchedState.ui.input.state = 'error';
        watchedState.ui.input.error = i18n.t(`input.error.${key}`);
      });
  });
};
