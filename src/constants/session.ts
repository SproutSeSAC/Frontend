export const SESSION_TABLE_HEADERS = ["이름", "캠퍼스", "교육과정", "메일주소", "연락처", "신청 시간", "상태"];

export const STATUS_MAP: Record<"WAIT" | "PARTICIPANT" | "REJECT", string> = {
  WAIT: "대기",
  PARTICIPANT: "승인",
  REJECT: "반려",
};

export const BUTTON_STYLES = {
  selectAll: "px-4 py-2 bg-darkGray hover:bg-darkGray-hover active:bg-darkGray-active text-white rounded-md",
  accept: "px-4 py-2 bg-lightGreen-active hover:bg-mainGreen/40 active:bg-mainGreen/30 text-mainGreen rounded-md",
  reject: "px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300 rounded-md",
};

export const STATUS_STYLES: Record<"WAIT" | "PARTICIPANT" | "REJECT", string> = {
  WAIT: "text-orange-500",
  PARTICIPANT: "text-green-600",
  REJECT: "text-red-500",
};
