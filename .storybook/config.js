import { configure, addDecorator, setAddon } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { HeadingRoot } from '@team-griffin/react-heading-section';


addDecorator(withKnobs);
addDecorator(function (getStory) {
  const story = getStory();

  return (
    <div>
      <HeadingRoot>
        {story}
      </HeadingRoot>
    </div>
  );
});

function loadStories() {
  require('../src/components/__stories__/DebounceField.story');
}

configure(loadStories, module);
