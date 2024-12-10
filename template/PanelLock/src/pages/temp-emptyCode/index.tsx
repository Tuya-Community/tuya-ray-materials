import { FC } from 'react';
import { useQuery, router } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import EmptyCodeForm from './component/EmptyCodeForm';

const Index: FC = () => {
  const query = useQuery();
  return (
    <>
      <NavBar
        title={Strings.getLang('title_temp_emptyCode')}
        fixed
        placeholder
        leftArrow
        onClickLeft={() => router.back()}
      />
      <EmptyCodeForm {...query} />
    </>
  );
};

export default Index;
