declare namespace SmartMiniprogram {
  type SystemInfo = {
    is24Hour: boolean;
    system: string;
    brand: string;
    model: string;
    platform: string;
    timezoneId: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight: number;
    language: string;
    safeArea: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      width: number;
      height: number;
    };
    albumAuthorized: boolean;
    cameraAuthorized: boolean;
    locationAuthorized: boolean;
    microphoneAuthorized: boolean;
    notificationAuthorized: boolean;
    notificationAlertAuthorized: boolean;
    notificationBadgeAuthorized: boolean;
    notificationSoundAuthorized: boolean;
    bluetoothEnabled: boolean;
    locationEnabled: boolean;
    wifiEnabled: boolean;
    theme?: 'dark' | 'light';
    deviceOrientation?: 'landscape' | 'portrait';
  };

  type GetSystemInfoOption = AsyncApiOptions<SystemInfo>;

  interface TY {
    
    env: {
      
      USER_DATA_PATH: string;
    };

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    

    
    setNavigationBarBack(options: AsyncApiOptions<void, void> & { type: 'system' | 'custom' }): void;

    
    onNavigationBarBack(listener: Function): void;

    
    offNavigationBarBack(listener: Function): void;
  }
}
