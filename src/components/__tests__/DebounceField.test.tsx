import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as sinon from 'sinon';
import { expect } from 'chai';
import {
  __test__,
} from '../DebounceField';
import DebounceInput from '../DebounceInput';

configure({ adapter: new Adapter() });

const {
  PureDebounceField,
} = __test__;

describe('<ReduxDebounceField />', function() {

  describe('::PureReduxDebounceField', function () {
    it('renders a Field', function () {
      const wrapper = shallow(
        <PureDebounceField
          name="testField"
        />
      );

      expect(wrapper.find('Field').length).to.equal(1);
    });

    it('overrides component with DebounceInput', function () {
      const C = () => (<input/>);
      const wrapper = shallow(
        <PureDebounceField
          name="testField"
          component={C}
        />
      );

      const props: any = wrapper.find('Field').props();
      
      expect(props.component).to.equal(DebounceInput);
      expect(props.ownerComponent).to.equal(C);
    });
  });
});
