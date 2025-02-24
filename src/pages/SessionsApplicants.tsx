import { useLocation } from "react-router-dom";
import { useApplicants } from "@/hooks";
import { SESSION_TABLE_HEADERS, STATUS_MAP, BUTTON_STYLES, STATUS_STYLES } from "@/constants";

export default function SessionsApplicants() {
  const location = useLocation();
  const sessionInfo = location.state;
  const {
    participants,
    selectedParticipants,
    loading,
    handleSelectAll,
    handleCheckboxChange,
    handleAcceptAll,
    handleRejectAll,
  } = useApplicants();

  const renderStatusText = (status: "WAIT" | "PARTICIPANT" | "REJECT") =>
    STATUS_MAP[status] || "알 수 없는 상태";

  return (
    <>
      {loading ? (
        <p className="text-center text-gray-500">신청자 데이터를 불러오는 중...</p>
      ) : (
        <div className="h-full relative overflow-hidden rounded-[20px]">
          <div className="flex-col ml-1 items-center mb-4">

            <div className="flex items-center justify-end space-x-4">
              <span className="text-darkGray text-sm">
                {participants.length} / {sessionInfo.participantCapacity}
              </span>
              <button onClick={handleSelectAll} className={BUTTON_STYLES.selectAll}>
                {selectedParticipants.length === participants.length ? "선택 해제" : "모두 선택"}
              </button>
              <button onClick={handleAcceptAll} className={BUTTON_STYLES.accept}>
                승인
              </button>
              <button onClick={handleRejectAll} className={BUTTON_STYLES.reject}>
                반려
              </button>
            </div>
          </div>

          <div className="grid grid-cols-8 items-center bg-gray-100 text-gray-600 font-medium rounded-2xl px-6 py-4 w-full">
            {SESSION_TABLE_HEADERS.map((header, index) => (
              <span key={index} className="text-center">
                {header}
              </span>
            ))}
          </div>

          <div className="space-y-4 ml-3 mt-2">
            {participants.map((applicant) => (
              <div key={applicant.noticeParticipantId} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer border-2 border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-green-500 bg-transparent checked:bg-green-500 checked:border-transparent"
                  checked={selectedParticipants.includes(applicant.noticeParticipantId)}
                  onChange={() => handleCheckboxChange(applicant.noticeParticipantId)}
                />

                <div className="mx-3 max-w-[100%] grid grid-cols-8 flex-grow items-center gap-x-4 bg-white rounded-2xl shadow-md pr-5 py-4 w-full">
                  <span className="text-gray-700 text-center truncate">{applicant.userName}</span>
                  <span className="text-gray-500 text-center truncate">
                    {applicant.campuses?.map((c) => c.name).join(", ") || "정보 없음"}
                  </span>

                  <span
                    className="text-gray-500 truncate text-center hover:overflow-visible hover:whitespace-normal"
                    title={applicant.courses?.map((c) => c.name).join(", ") || "정보 없음"}
                  >
                    {applicant.courses?.map((c) => c.name).join(", ").length > 10
                      ? applicant.courses?.map((c) => c.name).join(", ").slice(0, 10) + "..."
                      : applicant.courses?.map((c) => c.name).join(", ") || "정보 없음"}
                  </span>

                  <span className="text-gray-500 text-center truncate">{applicant.email}</span>
                  <span className="text-gray-500 text-center truncate">{applicant.phoneNumber}</span>
                  <span className="text-gray-500 text-center">{applicant.applicationTime || "-"}</span>

                  <span className={`font-medium text-center ${STATUS_STYLES[applicant.status]}`}>
                    {renderStatusText(applicant.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
