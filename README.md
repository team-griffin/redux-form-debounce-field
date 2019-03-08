# redux-form-debounce-field
A variant of redux-form's `<Field>` component, but with a debounce feature that delay's the field's `onChange` event from triggering.

## Usage
```js
import DebounceField from 'redux-form-debounce-field';

const MyInput = ({
  input,
  meta,
  ...rest
}) => (
  <input
    {...input}
    {...rest}
  />
);

const MyForm = () => (
  <DebounceField
    wait={250}
    component={MyInput}
  />
);
```

## Props
| Prop | Type     | Description        | Default |
| wait | `number` | The debounce delay | `250`   |
