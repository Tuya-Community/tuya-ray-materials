declare namespace SmartMiniprogram {
  type PanelKitInitConfig = {
    
    deviceId?: string;
    
    groupId?: string;

    
    useDefaultOffline: boolean;
    
    bleCover?: boolean;

    
    customTop?: string;

    
    showBLEToast?: boolean;

    
    bleConnectType?: number;
  };

  type StatusToastOptions = {
    
    title: string;
    
    type?: 'success' | 'warning' | 'error';
    
    leftIcon?: string;
    
    rightIcon?: string;
    
    cover?: boolean;
    
    duration?: number;
    
    autoClose?: boolean;
    
    coverColor?: string;
  };

  type WarningItem = {
    
    content: string;
    
    type?: 'success' | 'warning' | 'error';
  };

  type ListConfig = {
    
    title?: string;
  };

  type Permissions =
    | 'bluetooth'
    | 'writePhotosAlbum'
    | 'userLocationBackground'
    | 'record'
    | 'camera'
    | 'userLocation'
    | 'userPreciseLocation';

  interface TY {
    panel: {
      
      initPanelKit(config: PanelKitInitConfig): void;
      
      unregisterEvent(): void;

      
      checkOTAUpdate(deviceId: string): void;
      
      showToast(options: StatusToastOptions): Promise<string>;
      
      closeToast(id?: string): void;

      
      showWarningWithList(list: WarningItem[], config?: ListConfig): Promise<string>;

      
      checkPermission(permission: Permissions): Promise<boolean>;
    };
  }
}
