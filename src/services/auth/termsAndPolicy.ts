import axios from 'axios';

export type TermsAndPolicyType = '개인정보 처리방침' | '서비스 이용약관';

export const getPolicyContent = async (type: TermsAndPolicyType) => {
  const filename =
    type === '서비스 이용약관'
      ? 'termsAndConditionsOfService'
      : 'policyOfHandlingPersonalInformation';

  const response = await axios.get(
    `/src/assets/terms-and-policy/${filename}.html`,
  );

  return response.data;
};
