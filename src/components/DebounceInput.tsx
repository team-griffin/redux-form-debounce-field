import React, {
  ComponentType,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useRef,
} from 'react';
import { WrappedFieldProps } from 'redux-form';
import debounce from 'lodash.debounce';

type OnChange = (evt: React.ChangeEvent<HTMLInputElement>) => any;

interface Indexed {
  [key: string]: any;
}

interface OuterProps extends WrappedFieldProps, Indexed {
  ownerComponent: ComponentType<WrappedFieldProps & Indexed>,
  wait?: number,
}

const DebounceInput = ({
  ownerComponent: Component,
  wait = 250,
  ...props
}: OuterProps) => {
  const [ debounceFieldValue, setDebounceFieldValue ] = useState('');
  const [ debouncing, setDebouncing ] = useState(false);
  const lastInputValue = useRef(props.input.value);

  useEffect(() => {
    if (debouncing) {
      return;
    }
    if (props.input.value === lastInputValue.current) {
      return;
    }
    lastInputValue.current = props.input.value;
    setDebounceFieldValue(props.input.value);
  }, [ debouncing, props.input.value ]);

  const call = useMemo(() => debounce((
    onChange: OnChange,
    evt: ChangeEvent<HTMLInputElement>,
  ) => {
    setDebouncing(false);
    onChange(evt);
  }, wait), [ setDebouncing, wait ]);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    evt.persist();
    setDebouncing(true);
    call(props.input.onChange, evt);
    setDebounceFieldValue(evt.target.value);
  }, [ setDebouncing, call, setDebounceFieldValue ]);

  const onBlur = useCallback((evt: FocusEvent<HTMLInputElement>) => {
    call.cancel();
    setDebouncing(false);
    props.input.onChange(evt);
    props.input.onBlur(evt);
  }, [ call, setDebouncing, props.input.onChange, props.input.onBlur ]);

  const onKeyDown = useCallback((evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13) {
      call.cancel();
      setDebouncing(false);
      props.input.onChange(evt);
    }
  }, [ call, setDebouncing, props.input.onChange ]);

  const input = {
    ...props.input,
    value: debounceFieldValue,
    onChange,
    onBlur,
    onKeyDown,
  };

  return (
    <Component
      {...props}
      input={input}
    />
  );
};
DebounceInput.displayName = 'DebounceInput';

export default DebounceInput;
