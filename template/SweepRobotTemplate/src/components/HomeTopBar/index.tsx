import { statusCode } from '@/constant/dpCodes';
import Strings from '@/i18n';
import { useProps } from '@ray-js/panel-sdk';
import { NavBar } from '@ray-js/smart-ui';
import { CoverView } from 'ray';
import React, { FC } from 'react';

const HomeTopBar: FC = () => {
  const dpStatus = useProps(props => props[statusCode]);

  return (
    <CoverView>
      <NavBar leftText={Strings.getDpLang(statusCode, dpStatus)} leftTextType="home" />
    </CoverView>
  );
};

export default HomeTopBar;
