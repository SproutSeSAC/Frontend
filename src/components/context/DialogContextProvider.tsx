import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

import Toast from '@/components/common/Toast';
import Alert, { AlertProps } from '@/components/common/modal/Alert';
import LoadingAlert, {
  LoadingAlertProps,
} from '@/components/common/modal/LoadingAlert';

interface Dialog {
  key: string;
  element: ReactNode;
  visible: boolean;
}

interface DialogContextProviderProps {
  children?: ReactNode;
}

interface AlertType extends AlertProps {
  showDim?: boolean;
  dimClick?: boolean;
  key?: string;
}
interface ToastType {
  id: number;
  message: string;
  onClose: (id: number) => void;
}

interface DialogContextProviderActions {
  showDialog: (result: { key: string; element: ReactNode }) => Promise<void>;
  hideDialog: (key?: string) => Promise<void>;
  alert: (args: AlertType) => Promise<void>;
  showToast: (message: string, autoCloseDuration?: number) => void;
  loadingAlert: (args: LoadingAlertProps) => Promise<void>;
}

/**
 * DialogContext는 Dialog의 상태를 관리하고, Dialog를 표시 및 숨기는 기능을 제공합니다.
 *
 * @param showDialog - 새로운 Dialog를 생성하고 보여주는 함수입니다.
 *                     Dialog를 보여주면, 결과를 반환하지 않습니다.
 * @param hideDialog - 특정 Dialog를 숨기는 함수입니다.
 *                     만약 Dialog가 2개 이상 존재할 경우,
 *                     특정 Dialog를 숨기려면 반드시 key를 제공해야 합니다.
 *                     key를 제공하지 않으면, 모든 Dialog가 숨겨집니다.
 * @param alert - Alert 컴포넌트를 사용해 간편하게 alert 창을 띄우는 함수입니다.
 *                AlertProps를 전달하여 커스터마이징이 가능하며, showDim를 true로 줄 경우 백그라운드 딤처리 됩니다.
 *                'alert' 키를 사용해 Alert 컴포넌트를 Dialog로 렌더링합니다.
 * @param showToast - Toast 컴포넌트를 사용하여 메시지를 표시하는 함수입니다.
 *                    첫 번째 인자는 노출할 메시지이며, 두 번째 인자는
 *                    토스트를 몇 초 동안 표시할지를 결정합니다.
 * @param loadingAlert - 데이터를 mutate하는 동안 표시할 로딩 표시 함수입니다.
 *
 *
 */

export const DialogContext = createContext<DialogContextProviderActions>(
  {} as DialogContextProviderActions,
);

export default function DialogContextProvider({
  children,
}: DialogContextProviderProps) {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Dialog 추가하는 함수
  const showDialog = useCallback(
    (result: { key: string; element: ReactNode }): Promise<void> => {
      return new Promise(resolve => {
        setDialogs(prevDialogs => {
          const newDialog: Dialog = {
            key: result.key,
            element: result.element,
            visible: true,
          };
          return [...prevDialogs, newDialog];
        });
        resolve();
      });
    },
    [],
  );

  // Dialog 제거하는 함수
  const hideDialog = useCallback(
    async (key?: string): Promise<void> => {
      if (typeof key === 'string' && key) {
        const newDialogs = dialogs.map(dialog =>
          dialog.key === key ? { ...dialog, visible: false } : dialog,
        );

        setDialogs(newDialogs);
      } else {
        setDialogs([]);
      }
    },
    [dialogs],
  );

  const alert = useCallback(
    async ({
      key,
      showDim = true,
      dimClick = true,
      ...rest
    }: AlertType): Promise<void> => {
      await showDialog({
        key: key || 'alert',
        element: (
          <>
            <Alert {...rest} />
            {showDim && (
              <div
                className={`${dimClick ? 'cursor-pointer' : 'cursor-default'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
                onClick={dimClick ? async () => hideDialog() : undefined}
                onKeyDown={event => {
                  if (event.key === 'Escape') {
                    hideDialog();
                  }
                }}
                tabIndex={-1}
                role="button"
                aria-label="모달 닫기"
              />
            )}
          </>
        ),
      });
    },
    [hideDialog, showDialog],
  );

  const loadingAlert = useCallback(
    async ({ key, showDim = true, ...rest }: AlertType): Promise<void> => {
      await showDialog({
        key: key || 'loading_alert',
        element: (
          <>
            <LoadingAlert {...rest} />
            {showDim && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
            )}
          </>
        ),
      });
    },
    [showDialog],
  );

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = useCallback((message: string, autoCloseDuration = 3000) => {
    const newToast = { id: Date.now(), message, onClose: removeToast };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => removeToast(newToast.id), autoCloseDuration);
  }, []);

  const actions = useMemo(
    () => ({
      showDialog,
      hideDialog,
      alert,
      showToast,
      loadingAlert,
    }),
    [showDialog, hideDialog, alert, showToast, loadingAlert],
  );

  return (
    <DialogContext.Provider value={actions}>
      {children}

      {/* Dialog가 렌더링될 컨테이너 */}
      {dialogs
        .filter(dialog => dialog.visible)
        .map(dialog => (
          <div key={dialog.key}>{dialog.element}</div>
        ))}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.length > 0 &&
          toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              onClose={() => toast.onClose(toast.id)}
            />
          ))}
      </div>
    </DialogContext.Provider>
  );
}
