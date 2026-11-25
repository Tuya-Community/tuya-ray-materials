import React, { Fragment } from "react";

import Header from "@/common/Header";
import Code from "@/common/Code";
import Demo0 from "@/components/Picker/basic";
import Demo1 from "@/components/Picker/multiSelector";

import DemoWrapper from "@/common/DemoWrapper";

const PagePreviewer: React.FC = () => {
	return (
		<Fragment>
			<Header title="Picker" description={I18n.t('bottomPicker')} />
			<Code title={I18n.t('singleColumn')}>{`const [current, setCurrent] = React.useState(0);

const handlePickerChange = (e) => {
  setCurrent(+e.detail.value);
};

const range = ['${I18n.t('usa')}', '${I18n.t('china')}', '${I18n.t('brazil')}', '${I18n.t('japan')}'];
return (
  <Picker onChange={handlePickerChange} range={range} mode='selector'>
    <View>${I18n.t('currentSelection')}{range[current]}</View>
  </Picker>);
      `}</Code>
			<DemoWrapper>
				<Demo0 />
			</DemoWrapper>

			<Code title={I18n.t('multipleColumns')}>{`const [current, setCurrent] = React.useState([0, 0, 0]);

const handlePickerChange = (e) => {
  setCurrent(e.detail.value);
};

const range = [
  ['${I18n.t('invertebrates')}', '${I18n.t('vertebrates')}'],
  ['${I18n.t('flatworms')}', '${I18n.t('roundworms')}', '${I18n.t('annelids')}', '${I18n.t('mollusks')}', '${I18n.t('arthropods')}'],
  ['${I18n.t('porkTapeworm')}', '${I18n.t('bloodworm')}'],
];
return (
  <Picker onChange={handlePickerChange} range={range} mode='multiSelector'>
    <View>
      ${I18n.t('currentSelection')}{range[0][+current[0]]}, {range[1][+current[1]]}, {range[2][+current[2]]}
    </View>
  </Picker>
);`}</Code>
			<DemoWrapper>
				<Demo1 />
			</DemoWrapper>
		</Fragment>
	);
};

export default PagePreviewer;
