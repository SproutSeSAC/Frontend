import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

import Alert, { AlertProps } from '../common/modal/Alert';

interface Dialog {
  key: string; // TODO : key 타입 명확하게 수정필요해 보임
  element: ReactNode;
  visible: boolean;
}

interface DialogContextProviderProps {
  children?: ReactNode;
}

interface AlertType extends AlertProps {
  showDim?: boolean;
}

interface DialogContextProviderActions {
  showDialog: (result: { key: string; element: ReactNode }) => Promise<void>;
  hideDialog: (key?: string) => Promise<void>;
  alert: (args: AlertType) => Promise<void>;
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
 */

export const DialogContext = createContext<DialogContextProviderActions>(
  {} as DialogContextProviderActions,
);

export default function DialogContextProvider({
  children,
}: DialogContextProviderProps) {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);

  // Dialog 추가하는 함수
  const showDialog = useCallback(
    (result: { key: string; element: ReactNode }): Promise<void> => {
      return new Promise(resolve => {
        const newDialog: Dialog = {
          key: result.key,
          element: result.element,
          visible: true,
        };

        setDialogs(prevDialogs => [...prevDialogs, newDialog]);
        resolve();
      });
    },
    [],
  );

  // Dialog 제거하는 함수
  const hideDialog = useCallback(async (key?: string): Promise<void> => {
    setDialogs(prevDialogs => {
      if (key) {
        prevDialogs.map(dialog =>
          dialog.key === key ? { ...dialog, visible: false } : dialog,
        );
      }

      return [];
    });
  }, []);

  const alert = useCallback(
    async (args: AlertType): Promise<void> => {
      await showDialog({
        key: 'alert',
        element: (
          <>
            <Alert {...args} />
            {args.showDim && (
              <div
                className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
                onClick={async () => hideDialog()}
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

  const actions = useMemo(
    () => ({
      showDialog,
      hideDialog,
      alert,
    }),
    [showDialog, hideDialog, alert],
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
    </DialogContext.Provider>
  );
}
