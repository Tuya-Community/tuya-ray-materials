import React, { FC, useEffect, useState } from 'react';
import { PageContainer, View } from '@ray-js/ray';
import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import { useDispatch } from 'react-redux';
import { fetchAudios } from '@/redux/modules/audiosSlice';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import Status from './Status';
import Player from './Player';
import PetAssistant from './PetAssistant';
import styles from './index.module.less';
import Voices from './Voices';

const Home: FC = () => {
  const isLight = getCachedSystemInfo()?.theme === 'light';
  const dispatch = useDispatch();
  const [showVoices, setShowVoices] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(fetchAudios());
  }, []);

  return (
    <View className={styles.container}>
      <TopBar />
      {isLight && <BgBones />}
      <Status showVoice={() => setShowVoices(true)} />
      <Player />
      <PetAssistant />
      <PageContainer
        show={showVoices}
        customStyle="backgroundColor: transparent"
        position="bottom"
        overlayStyle="background: var(--panel-popup-bg)"
        onLeave={() => setShowVoices(false)}
        onAfterEnter={() => setReady(true)}
        onClickOverlay={() => setShowVoices(false)}
      >
        <Voices ready={ready} onClose={() => setShowVoices(false)} />
      </PageContainer>
    </View>
  );
};

export default Home;
