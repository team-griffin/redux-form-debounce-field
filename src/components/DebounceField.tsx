import React from 'react';
import {
  compose,
  setDisplayName,
  pure,
} from 'recompose';
import {
  Field,
  BaseFieldProps,
} from 'redux-form';
import DebounceInput from './DebounceInput';

interface Indexed {
  [key: string]: any;
}

export type Props<P = {}> = BaseFieldProps<P> & Indexed & { wait?: number };

const PureDebounceField = ({
  component,
  ...props
}: Props) => (
  <Field
    {...props}
    component={DebounceInput}
    ownerComponent={component}
  />
);

const enhance = compose<Props, Props>(
  setDisplayName('DebounceField'),
  pure,
);

export default enhance(PureDebounceField);

// eslint-disable-next-line no-underscore-dangle
export const __test__ = {
  PureDebounceField,
  enhance,
};