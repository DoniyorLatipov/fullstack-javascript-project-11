import { string } from 'yup';
import setWatcher from './view.js';

export default async () => {
  const state = {
    ui: {
      input: {
        state: 'idle',
        error: '',
      },
    },
    links: [],
  };

  const elements = {
    form: document.getElementById('rssForm'),
    input: document.getElementById('url-input'),
    output: document.querySelector('.feedback'),
  };

  const watchedState = setWatcher(state, elements);

  const schema = string()
    .url('Ссылка должна быть валидным URL')
    .required('Не должно быть пустым')
    .test('unique-url', 'RSS уже существует', (value) => !watchedState.links.includes(value));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const value = data.get('url').trim();

    Promise.resolve(value)
      .then((value) => schema.validate(value))
      .then(() => {
        watchedState.ui.input.state = 'success';
        watchedState.ui.input.error = '';

        // reset form
        elements.input.value = '';
        elements.input.focus();

        // adding link
        watchedState.links.push(value);
      })
      .catch((err) => {
        watchedState.ui.input.state = 'error';
        watchedState.ui.input.error = err.message;
      });
  });
};
