import React, { useState } from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as sinon from 'sinon';
import { expect } from 'chai';
import DebounceInput from '../DebounceInput';
import {
  WrappedFieldInputProps,
  WrappedFieldMetaProps,
} from 'redux-form';

configure({ adapter: new Adapter() });

const pause = (n: number = 0) => new Promise((res) => {
  setTimeout(res, n);
});

const fakeInput = {} as WrappedFieldInputProps;
const fakeMeta = {} as WrappedFieldMetaProps;

describe('<DebounceInput />', function() {

  describe('::DebounceInput', function () {

    it('renders the component', function () {
      const C = () => <div id="qwerty"/>
      const wrapper = mount(
        <DebounceInput
          ownerComponent={C}
          input={fakeInput}
          meta={fakeMeta}
        />
      );

      expect(wrapper.html()).to.equal('<div id="qwerty"></div>');
    });

    it('uses the redux form initial value', function() {
      const Sink = (): any => null;
      const props = {
        ownerComponent: Sink,
        input: {
          ...fakeInput,
          value: 'original'
        },
        meta: fakeMeta,
      };

      const wrapper = mount(<DebounceInput {...props}/>);

      expect(wrapper.find(Sink).prop('input').value).to.equal('original');
    });
    context('when the user changes the value', function() {
      it('uses the user\'s value', function() {
        let value;

        const Sink = (props: any): any => {
          value = props.input.value;
          return null;
        };
        const props = {
          ownerComponent: Sink,
          input: {
            ...fakeInput,
            onChange: () => {},
            value: 'original'
          },
          meta: fakeMeta,
        };
  
        const wrapper = mount(<DebounceInput {...props}/>);

        expect(value).to.equal('original');

        wrapper.find(Sink).prop('input').onChange({
          persist: () => {},
          target: {
            value: 'changed',
          },
        });
  
        expect(value).to.equal('changed');
      });
      it('sends the value to redux form after a delay', async function() {
        const spy = sinon.spy();
        const Sink = (): null => null;
        const props = {
          ownerComponent: Sink,
          input: {
            ...fakeInput,
            onChange: spy,
            value: 'original'
          },
          meta: fakeMeta,
        };
  
        const wrapper = mount(<DebounceInput wait={50} {...props}/>);

        const evt = {
          persist: () => {},
          target: {
            value: 'changed',
          },
        };
        // @ts-ignore
        wrapper.find(Sink).prop('input').onChange(evt);
  
        expect(spy.called).to.be.false;

        await pause(100);

        expect(spy.called).to.be.true;
        expect(spy.lastCall.args[0]).to.equal(evt);
      });
    });
    context('when the value changes in redux form', function() {
      it('it uses the redux form value', async function() {
        let value;
        const Sink = (props: any): any => {
          value = props.input.value;
          return null;
        };
        const props = {
          ownerComponent: Sink,
          meta: fakeMeta,
        };
        const Stub = (props: any) => {
          const [ input, setInput ] = useState({
            ...fakeInput,
            onChange: (evt: any) => setInput({
              ...input,
              value: evt.target.value,
            }),
            value: 'original',
          });
          return (
            <DebounceInput
              {...props}
              input={input}
              setInput={setInput}
            />
          );
        };

        const evt = {
          persist: () => {},
          target: {
            value: 'changed',
          },
        };
  
        const wrapper = mount(<Stub wait={50} {...props}/>);

        expect(value).to.equal('original');

        wrapper.find(Sink).prop('input').onChange(evt);

        await pause(100);

        expect(value).to.equal('changed');

        wrapper.find(Sink).prop('setInput')({
          ...fakeInput,
          onChange: () => {},
          value: 'overridden',
        });

        await pause(100);

        expect(value).to.equal('overridden');
      });
      context('when there is an ongoing debounce cycle', function() {
        it('prefers the user\'s value', async function() {
          let value;
          const Sink = (props: any): any => {
            value = props.input.value;
            return null;
          };
          const props = {
            ownerComponent: Sink,
            meta: fakeMeta,
          };
          const Stub = (props: any) => {
            const [ input, setInput ] = useState({
              ...fakeInput,
              onChange: (evt: any) => setInput(evt.target.value),
              value: 'original',
            });
            return (
              <DebounceInput
                {...props}
                input={input}
                setInput={setInput}
              />
            );
          };

          const evt = {
            persist: () => {},
            target: {
              value: 'changed',
            },
          };
    
          const wrapper = mount(<Stub wait={200} {...props}/>);
  
          expect(value).to.equal('original');
  
          // user types some input
          // this updates the value prop
          // and triggers the debounce
          wrapper.find(Sink).prop('input').onChange(evt);
  
          expect(value).to.equal('changed');

          // we're now half through the debounce
          await pause(100);

          // and the value shouldn't have changed
          expect(value).to.equal('changed');
  
          // now the redux form value is updated
          // but because we're mid-debounce it shouldn't
          // reach the input
          wrapper.find(Sink).prop('setInput')({
            ...fakeInput,
            onChange: () => {},
            value: 'overridden',
          });
          150
          expect(value).to.equal('changed');

          // the debounce should've now finished
          await pause(150);

          // now when the redux form value updates
          // it should come through okay...
          wrapper.find(Sink).prop('setInput')({
            ...fakeInput,
            onChange: () => {},
            value: 'overridden2',
          });

          await pause(100);
  
          expect(value).to.equal('overridden2');
        });
      });

      context('when user leaves the field', function() {
        it('updates the redux form value immediately', async function() {
          let value;
          const Sink = (props: any): any => {
            value = props.input.value;
            return null;
          };
          const props = {
            ownerComponent: Sink,
            meta: fakeMeta,
          };
          const Stub = (props: any) => {
            const [ input, setInput ] = useState({
              ...fakeInput,
              onChange: (evt: any) => setInput(evt.target.value),
              onBlur: () => {},
              value: 'original',
            });
            return (
              <DebounceInput
                {...props}
                input={input}
                setInput={setInput}
              />
            );
          };

          const evt = {
            persist: () => {},
            target: {
              value: 'changed',
            },
          };
    
          const wrapper = mount(<Stub wait={5000} {...props}/>);
  
          expect(value).to.equal('original');
  
          wrapper.find(Sink).prop('input').onChange(evt);
          wrapper.find(Sink).prop('input').onBlur(evt);

          await pause(100);
  
          expect(value).to.equal('changed');
        });
      });
    });
  });
});
