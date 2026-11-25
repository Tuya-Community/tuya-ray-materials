import React, { Fragment } from "react";

import Header from "@/common/Header";

import Demo0 from "@/components/PageContainer/basic";

import DemoWrapper from "@/common/DemoWrapper";
import Code from "@/common/Code";
const PagePreviewer: React.FC = () => {
	return (
		<Fragment>
			<Header title="PageContainer" description={I18n.t('pageContainer')} />
			<Code>{` const [isShow, setIsShow] = React.useState(false);
  const toggleIsShow = () => {
    setIsShow(!isShow);
  };
  return (
    <React.Fragment>
      <Button onClick={toggleIsShow}>${I18n.t('openBottom')}</Button>
      <PageContainer show={isShow} position='bottom' onClickOverlay={toggleIsShow}>
      <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
      }}
    >
      ${I18n.t('rayDevelopment')}
    </View>
      </PageContainer>
    </React.Fragment>
  );
      `}</Code>
			<DemoWrapper>
				<Demo0 />
			</DemoWrapper>
		</Fragment>
	);
};

export default PagePreviewer;
