import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Image,
  View,
  setNavigationBarBack,
  onNavigationBarBack,
  offNavigationBarBack,
  nativeDisabled,
} from '@ray-js/ray';
import { Dialog, Toast } from '@ray-js/smart-ui';
import clsx from 'clsx';
import BgBones from '@/components/BgBones';
import TopBar from '@/components/TopBar';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';
import { emitter, getCdnPath } from '@/utils';
import Strings from '@/i18n';
import PetType from './PetType';
import PetBreed from './PetBreed';
import PetSex from './PetSex';
import PetActiveness from './PetActiveness';
import PetAnalytics from './PetProfile';
import PetInfo from './PetInfo';
import styles from './index.module.less';

const AddPet: FC = () => {
  const isLight = getCachedSystemInfo()?.theme === 'light';

  const [step, setStep] = useState(0);
  const [type, setType] = useState<PetType | null>(null);
  const [breed, setBreed] = useState<string | null>(null);
  const [sex, setSex] = useState<number | null>(null);
  const [activeness, setActiveness] = useState<number | null>(null);
  const [profile, setProfile] = useState<ProfileResult | null>(null);

  const goNextActive = useMemo(() => {
    if (step === 0) {
      return type !== null;
    }

    if (step === 1) {
      return breed !== null;
    }

    if (step === 2) {
      return sex !== null;
    }

    if (step === 3) {
      return activeness !== null;
    }

    if (step === 4) {
      return profile !== null;
    }

    return false;
  }, [step, type, breed, sex, activeness, profile]);

  useEffect(() => {
    nativeDisabled(true);
    const handleSelectProfile = (value: ProfileResult) => {
      setProfile(value);
    };

    emitter.on('selectProfile', handleSelectProfile);

    return () => {
      emitter.off('selectProfile', handleSelectProfile);
    };
  }, []);

  useEffect(() => {
    const handleBack = () => {
      setStep(step => step - 1);
    };

    if (step > 0) {
      setNavigationBarBack({ type: 'custom' });
      onNavigationBarBack(handleBack);
    } else {
      setNavigationBarBack({ type: 'system' });
      offNavigationBarBack(handleBack);
    }
    return () => {
      setNavigationBarBack({ type: 'system' });
      offNavigationBarBack(handleBack);
    };
  }, [step]);

  const handlePetTypeChange = (value: PetType) => {
    setType(value);
  };

  const handlePetBreedChange = (value: string) => {
    setBreed(value);
  };

  const handlePetSexChange = (value: number) => {
    setSex(value);
  };

  const handlePetActivenessChange = (value: number) => {
    setActiveness(value);
  };

  const handleGoNext = () => {
    if (step === 0) {
      setBreed(null);
    }

    setStep(step => step + 1);
  };

  const isBreed = step === 1;

  return (
    <View
      className={clsx(styles.container, isBreed && styles.white)}
      style={{
        overflow: isBreed ? 'visible' : 'hidden',
        height: isBreed ? 'auto' : '100vh',
      }}
    >
      {isLight && <BgBones visible={step !== 1} />}
      <TopBar.Sub title={Strings.getLang('add_pet')} />
      <View className={styles.content}>
        {step === 0 && <PetType value={type} onChange={handlePetTypeChange} />}
        {step === 1 && (
          <PetBreed
            petType={type}
            value={breed}
            onChange={handlePetBreedChange}
            onBack={() => setStep(step => step - 1)}
          />
        )}
        {step === 2 && (
          <PetSex
            value={sex}
            onChange={handlePetSexChange}
            onBack={() => setStep(step => step - 1)}
          />
        )}
        {step === 3 && (
          <PetActiveness
            petType={type}
            value={activeness}
            onChange={handlePetActivenessChange}
            onBack={() => setStep(step => step - 1)}
          />
        )}
        {step === 4 && (
          <PetAnalytics
            petType={type}
            goNext={handleGoNext}
            onBack={() => setStep(step => step - 1)}
          />
        )}
        {step === 5 && (
          <PetInfo
            petType={type}
            breed={breed}
            sex={sex}
            activeness={activeness}
            profile={profile}
          />
        )}
      </View>
      <View
        className={clsx(styles['go-next'], goNextActive && styles.active)}
        hoverClassName="touchable"
        onClick={handleGoNext}
      >
        <Image src={getCdnPath('arrowRight.png')} className={styles.icon} />
      </View>
      <Toast id="smart-toast" />
      <Dialog id="smart-dialog" />
    </View>
  );
};

export default AddPet;
