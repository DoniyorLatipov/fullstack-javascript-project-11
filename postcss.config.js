import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1,
    }),
    autoprefixer(),
    cssnano(),
  ],
};
