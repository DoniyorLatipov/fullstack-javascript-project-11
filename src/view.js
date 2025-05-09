import onChange from 'on-change';

const setWatcher = (state, { input, output }) =>
  onChange(state, (path, value) => {
    // for input ui
    if (path === 'ui.input.state') {
      output.classList.remove('text-danger', 'text-success');
      input.classList.remove('is-valid', 'is-invalid');

      switch (value) {
        case 'success':
          input.classList.add('is-valid');
          output.classList.add('text-success');
          output.textContent = 'RSS успешно загружен';
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
    if (path === 'parsedLinks') {
      // render parsedLinks
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
