import {
  CONTACT_METHOD_EMAIL,
  CONTACT_METHOD_MESSENGER,
  contactMethodDisplay,
} from '@/constants';
import { useDialogContext } from '@/hooks';
import { ContactMethodDisplayKey } from '@/types';
import { BsCopy, BsLink45Deg } from 'react-icons/bs';

interface ContactMethodDetailProps {
  contactMethod: ContactMethodDisplayKey;
  contactDetail?: string;
}

export default function ContactMethodDetail({
  contactMethod,
  contactDetail,
}: ContactMethodDetailProps) {
  const { showToast } = useDialogContext();

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(contactDetail || '')
      .then(() => {
        showToast(
          `${contactMethod === CONTACT_METHOD_EMAIL ? '이메일 주소' : '연락처'}가 복사되었습니다!`,
        );
      })
      .catch(() => {
        showToast('복사에 실패했습니다.');
      });
  };

  const commonContactMethodStyle =
    'underline underline-offset-[2px] flex gap-1 item-center';

  return contactMethod === CONTACT_METHOD_MESSENGER ? (
    <a href={contactDetail} className={` ${commonContactMethodStyle}`}>
      {contactMethod ? contactMethodDisplay[contactMethod] : '-'}
      <BsLink45Deg size={20} className="mt-1.5" />
    </a>
  ) : (
    <button
      type="button"
      onClick={handleCopyClick}
      className={commonContactMethodStyle}
    >
      {contactMethod ? contactMethodDisplay[contactMethod] : '-'}
      <BsCopy className="ml-1 mt-1.5" size={20} />
    </button>
  );
}
