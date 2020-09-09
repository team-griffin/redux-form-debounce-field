import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import DebounceField from '../DebounceField';
import DebounceInput from '../DebounceInput';

configure({ adapter: new Adapter() });

describe('<DebounceField />', function() {

  describe('::DebounceField', function () {
    it('renders a Field', function () {
      const wrapper = shallow(
        <DebounceField
          name="testField"
        />
      );

      expect(wrapper.find('Field').length).to.equal(1);
    });

    it('overrides component with DebounceInput', function () {
      const C = () => (<input/>);
      const wrapper = shallow(
        <DebounceField
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
