import 'bootstrap';
import './style.scss';

import i18next from 'i18next';
import ru from './localization/ru.js';

import app from './app.js';

const runApp = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    debug: true,
    lng: 'ru',
    resources: {
      ru,
    },
  });

  app(i18nextInstance);
};

runApp();
