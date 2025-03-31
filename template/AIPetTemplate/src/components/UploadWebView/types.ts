export type PageLoadEndParams = { success: boolean };

export type PageLoadEndType = (data: PageLoadEndParams) => void;

export type LoggerInfoType =
  | ((data: { info: string; theme: string; args: any }) => void)
  | undefined;

export interface UploadViewProps {
  componentId?: string;
  uploadBackendConfig?: any;
  onPageLoadEnd?: PageLoadEndType;
  onLoggerInfo?: LoggerInfoType;
}
