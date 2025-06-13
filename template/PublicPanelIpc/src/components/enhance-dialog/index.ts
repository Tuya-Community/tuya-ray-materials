import { DialogInstance as OriginDialog } from '@ray-js/smart-ui';
import { nativeDisabled } from '@ray-js/ray';
import Strings from '@/i18n';

type Confirm = typeof OriginDialog.confirm;
type Input = typeof OriginDialog.input;

export const DialogInstance = {
  OriginDialog,
  confirm: (options: Parameters<Confirm>[0]): ReturnType<Confirm> => {
    nativeDisabled(true);
    return OriginDialog.confirm({
      zIndex: 500,
      ...options,
      confirmButtonText: Strings.getLang('confirmText'),
      cancelButtonText: Strings.getLang('cancelText'),
      beforeClose(action, value) {
        nativeDisabled(false);
        if (options.beforeClose) {
          return options.beforeClose(action, value);
        }
        return true;
      },
    });
  },
  input: (options: Parameters<Input>[0]): ReturnType<Input> => {
    nativeDisabled(true);
    return OriginDialog.input({
      zIndex: 500,
      ...options,
      beforeClose(action, value) {
        nativeDisabled(false);
        if (options.beforeClose) {
          return options.beforeClose(action, value);
        }
        return true;
      },
    });
  },
};
