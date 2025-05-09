import 'bootstrap';
import './style.scss';

import i18next from 'i18next';
import app from './app.js';

const runApp = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    debug: true,
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          input: {
            error: {
              empty: 'Не должно быть пустым',
              invalid: 'Ссылка должна быть валидным URL',
              exists: 'RSS уже существует',
            },
            success: 'RSS успешно загружен',
          },
        },
      },
    },
  });

  app(i18nextInstance);
};

runApp();
