export type TermsAndPolicyType = '개인정보 처리방침' | '서비스 이용약관';

export const getPolicyContent = async (type: TermsAndPolicyType) => {
  const filename =
    type === '서비스 이용약관'
      ? 'termsAndConditionsOfService'
      : 'policyOfHandlingPersonalInformation';

  const response = await fetch(`/src/assets/terms-and-policy/${filename}.html`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
};
