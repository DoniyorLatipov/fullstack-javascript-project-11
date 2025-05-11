import setWatcher from './view.js';
import IdGenerator from './idGenerator.js';
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

  let timerId = null;

  function updateRss() {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      const { feeds } = watchedState;
      const promises = feeds.map(({ link, id }) => rssParser(link, id));
      Promise.allSettled(promises)
        .then((results) => {
          const newPosts = results
            .flatMap((result) => {
              console.log(result);

              if (result.status !== 'fulfilled') return null;
              const { posts } = result.value;
              return posts;
            })
            .filter(Boolean)
            .filter((post) => {
              const isPostExists = watchedState.posts.some((p) => p.link === post.link);
              return !isPostExists;
            });

          watchedState.posts.push(...newPosts);
        })
        .then(() => {
          console.log('tested');

          updateRss;
        });
    }, 5000);
  }

  const idGen = new IdGenerator();
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
      .then(() => {
        updateRss();
      })
      .catch((err) => {
        const key = err.isAxiosError ? 'network' : err.message.key;

        watchedState.ui.input.state = 'error';
        watchedState.ui.input.error = i18n.t(`input.error.${key}`);
      });
  });
};
