import onChange from 'on-change';

const setWatcher = (state, i18n, { input, output, postsContainer, feedsContainer }) =>
  onChange(state, (path, value) => {
    // for input ui
    if (path === 'ui.input.state') {
      output.classList.remove('text-danger', 'text-success');
      input.classList.remove('is-valid', 'is-invalid');

      switch (value) {
        case 'success':
          input.classList.add('is-valid');
          output.classList.add('text-success');
          output.textContent = i18n.t('input.success');
          break;
        case 'error':
          input.classList.add('is-invalid');
          output.classList.add('text-danger');
          break;
        default:
          throw new Error(`Unknown input state: ${value}`);
      }
    }

    //for adding links
    if (path === 'feeds') {
      // render feeds
      const feeds = value.map((feed) => {
        const feedElement = document.createElement('li');
        feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
        feedElement.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
        return feedElement;
      });

      feedsContainer.innerHTML = '';
      feedsContainer.append(...feeds);
    }

    if (path === 'posts') {
      // render posts
      const posts = value.map((post) => {
        const postElement = document.createElement('li');
        postElement.classList.add('list-group-item', 'border-0', 'border-end-0');
        postElement.innerHTML = `<a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
        return postElement;
      });

      postsContainer.innerHTML = '';
      postsContainer.append(...posts);
    }

    if (path === 'ui.input.error') {
      if (value === '') {
        return;
      }

      // render error
      output.textContent = value;
    }
  });

export default setWatcher;
