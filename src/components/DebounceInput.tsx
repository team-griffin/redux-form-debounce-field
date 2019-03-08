import React from 'react';
import {
  setDisplayName,
  compose,
  defaultProps,
  pure,
  withProps,
  lifecycle,
  withStateHandlers,
  withHandlers,
} from 'recompose';
import {
  WrappedFieldProps,
} from 'redux-form';
import debounce from 'lodash.debounce';

type OnChange = (evt: React.ChangeEvent<HTMLInputElement>) => any;

interface Indexed {
  [key: string]: any;
}

export interface OuterProps extends WrappedFieldProps, Indexed {
  wait?: number;
  ownerComponent: React.ComponentType<WrappedFieldProps & Indexed>,
}

export interface DefaultProps extends OuterProps {
  wait: number;
}

export interface StateProps extends DefaultProps {
  debounceFieldValue: string;
  setDebounceFieldValue: (v: string) => any,
  debouncing: boolean,
  setDebouncing: (v: boolean) => any,
}

export interface HandlerProps extends StateProps {
  onChange: OnChange,
}

export interface InnerProps extends WrappedFieldProps, Indexed {
  ownerComponent: React.ComponentType<WrappedFieldProps & Indexed>,
}

const PureDebounceInput = ({
  ownerComponent: Component,
  wait,
  debounceFieldValue,
  setDebounceFieldValue,
  onChange,
  ...props
}: InnerProps) => (
  <Component {...props}/>
);

const enhance = compose<InnerProps, OuterProps>(
  setDisplayName('DebounceInput'),
  pure,
  defaultProps({ wait: 250 }),
  withStateHandlers(
    {
      debounceFieldValue: '',
      debouncing: false,
    },
    {
      setDebounceFieldValue: () => (debounceFieldValue) => ({ debounceFieldValue }),
      setDebouncing: () => (debouncing) => ({ debouncing }),
    },
  ),
  lifecycle<StateProps, {}>({
    componentDidMount() {
      this.props.setDebounceFieldValue(this.props.input.value);
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.debouncing) {
        return;
      }
      if (nextProps.input.value === this.props.input.value) {
        return;
      }
      this.props.setDebounceFieldValue(nextProps.input.value);
    },
  }),
  withHandlers<StateProps, {}>(({ wait, setDebouncing }) => {
    const call = debounce(
      (
        onChange: OnChange,
        evt: React.ChangeEvent<HTMLInputElement>,
      ) => {
        setDebouncing(false);
        onChange(evt);
      },
      wait,
    );

    return {
      onChange: (props) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.persist();
        setDebouncing(true);
        call(props.input.onChange, evt);
        props.setDebounceFieldValue(evt.target.value);
      },
    };
  }),
  withProps(({
    input,
    debounceFieldValue,
    onChange,
  }: HandlerProps) => ({
    input: {
      ...input,
      value: debounceFieldValue,
      onChange: onChange,
    },
  })),
);

export default enhance(PureDebounceInput);

// eslint-disable-next-line no-underscore-dangle
export const __test__ = {
  PureDebounceInput,
  enhance,
};