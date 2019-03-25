import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  boolean,
  select,
  text,
  number,
} from '@storybook/addon-knobs';
import {
  reduxForm,
  reducer as reduxFormReducer,
  getFormValues,
} from 'redux-form';
import {
  createStore,
  combineReducers,
} from 'redux';
import {
  connect,
  Provider,
} from 'react-redux';
import { compose } from 'recompose';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as r from 'ramda';

import DebounceField from '../DebounceField';

storiesOf('ReduxDebounceField', module)
  .add('default', () => {
    const Input = ({ input }: any) => (<input {...input}/>)

    const PureForm = ({ value }: { value: string }) => (
      <div>
        <label>Search</label>
        <DebounceField
          name="search"
          component={Input}
          wait={250}
        />
        <div>Value: {value}</div>
      </div>
    );
    const enhance = compose<{ value: string }, {}>(
      connect((state) => ({
        value: r.pipe(
          getFormValues('test'),
          r.prop('search'),
        )(state),
      })),
      reduxForm({
        form: 'test',
        propNamespace: 'form',
      }),
    );
    const TestForm = enhance(PureForm);

    const store = createStore(
      combineReducers({
        form: reduxFormReducer,
      }),
      composeWithDevTools(),
    );

    return (
      <Provider store={store} key="key">
        <TestForm/>
      </Provider>
    );
  })
  .add('long delay (blur override)', () => {
    const Input = ({ input }: any) => (<input {...input}/>)

    const PureForm = ({ value }: { value: string }) => (
      <form>
        <div>
          <label>Search</label>
          <DebounceField
            name="search"
            component={Input}
            wait={5000}
          />
          <div>Value: {value}</div>
        </div>
      </form>
    );
    const enhance = compose<{ value: string }, {}>(
      connect((state) => ({
        value: r.pipe(
          getFormValues('test'),
          r.prop('search'),
        )(state),
      })),
      reduxForm({
        form: 'test',
        propNamespace: 'form',
      }),
    );
    const TestForm = enhance(PureForm);

    const store = createStore(
      combineReducers({
        form: reduxFormReducer,
      }),
      composeWithDevTools(),
    );

    return (
      <Provider store={store} key="key">
        <TestForm/>
      </Provider>
    );
  });
