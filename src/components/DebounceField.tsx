import React from 'react';
import {
  Field,
  BaseFieldProps,
} from 'redux-form';
import DebounceInput from './DebounceInput';

interface Indexed {
  [key: string]: any;
}

export type Props<P = {}> = BaseFieldProps<P> & Indexed & { wait?: number };

const DebounceField = ({
  component,
  ...props
}: Props) => (
  <Field
    {...props}
    component={DebounceInput}
    ownerComponent={component}
  />
);
DebounceField.displayName = 'DebounceField';

export default DebounceField;
