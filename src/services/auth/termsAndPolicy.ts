import axios from 'axios';

export type TermsConsentList = '이용약관' | '개인정보 수집이용';

export const getPolicyContent = async (type: TermsConsentList) => {
  const filename =
    type === '이용약관'
      ? 'termsAndConditionsOfService'
      : 'policyOfHandlingPersonalInformation';

  const response = await axios.get(`/terms-and-policy/${filename}.html`);

  return response.data;
};
