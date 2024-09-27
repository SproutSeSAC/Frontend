const CODE = '새싹';

interface VerifyCodeButtonProps {
  currentCode: string;
}

export default function VerifyCodeButton({
  currentCode,
}: VerifyCodeButtonProps) {
  const onVerifyCodeClick = () => {
    if (CODE === currentCode) {
      alert('인증 확인되었습니다!');
    } else {
      alert('인증에 실패했습니다!');
    }
  };

  return (
    <button
      type="button"
      className="absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 text-gray1"
      onClick={onVerifyCodeClick}
    >
      인증 확인
    </button>
  );
}
