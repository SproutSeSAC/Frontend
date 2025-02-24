import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  acceptParticipant,
  rejectParticipant,
} from "@/services/session/sessionMutations";
import { fetchParticipants } from "@/services/session/sessionQueries";

interface Applicant {
  noticeParticipantId: number;
  userId: number;
  userName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
  status: "WAIT" | "PARTICIPANT" | "REJECT";
  campuses: { id: number; name: string }[];
  courses: { id: number; name: string }[];
  applicationTime?: string;
}

export default function SessionsApplicants() {
  const { postId } = useParams();
  const [participants, setParticipants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const loadParticipants = useCallback(() => {
    setLoading(true);
    fetchParticipants(Number(postId))
      .then(setParticipants)
      .catch(() => setError("참여자 목록을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleAccept = (participantId: number) => {
    acceptParticipant(Number(postId), participantId)
      .then(() => {
        setAlertMessage("참여 수락이 완료되었습니다.");
        loadParticipants();
      })
      .catch(() => setAlertMessage("참여 수락에 실패하였습니다."));
  };

  const handleReject = (participantId: number) => {
    rejectParticipant(Number(postId), participantId)
      .then(() => {
        setAlertMessage("참여 거절이 완료되었습니다.");
        loadParticipants();
      })
      .catch(() => setAlertMessage("참여 거절에 실패하였습니다."));
  };

  const totalApplicants = participants.length;
  const maxApplicants = 30;


  const renderStatusText = (status: "WAIT" | "PARTICIPANT" | "REJECT") => {
    switch (status) {
      case "WAIT":
        return "대기";
      case "PARTICIPANT":
        return "승인";
      case "REJECT":
        return "반려";
      default:
        return "알 수 없는 상태";
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-center text-gray-500">신청자 데이터를 불러오는 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-hidden rounded-[20px]">
        <div className="flex-col items-center mb-4">
          <div className="text-lg">
            <span className="text-mainGreen">1세대에게 배우는 안드로이드 앱 개발</span>
            <span className="text-darkerGray ml-2">일자 2024.03.10 시간 17:00~19:00</span>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <span className="text-darkGray text-sm">21 / 30 (전체)</span>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">모두 선택</button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md">승인</button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md">반려</button>
          </div>
        </div>

        <div className="grid grid-cols-8 items-center bg-gray-100 text-gray-600 font-medium rounded-2xl px-6 py-4 w-full">

          <span className="text-center">이름</span>
          <span className="text-center">캠퍼스</span>
          <span className="text-center">교육과정</span>
          <span className="text-center">메일주소</span>
          <span className="text-center">연락처</span>
          <span className="text-center">신청 시간</span>
          <span className="text-center">상태</span>
        </div>

        <div className="space-y-4 ml-3 mt-2">
          {participants.map((applicant) => (
            <div key={applicant.noticeParticipantId} className="flex items-center">
              
              {/* 체크박스: 카드 왼쪽으로 분리 */}
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer border-2 border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-green-500 bg-transparent checked:bg-green-500 checked:border-transparent"
              />

              {/* 카드 내용 */}
              <div className="mx-3 max-w-[100%] grid grid-cols-8 flex-grow items-center bg-white rounded-2xl shadow-md px-6 py-4 w-full">
                <span className="text-gray-700 text-center truncate">{applicant.userName}</span>
                <span className="text-gray-500 text-center truncate">{applicant.campuses?.map(c => c.name).join(", ") || "정보 없음"}</span>

                <span
                  className="text-gray-500 truncate text-center hover:overflow-visible hover:whitespace-normal"
                  title={applicant.courses?.map(c => c.name).join(", ") || "정보 없음"}
                >
                  {applicant.courses?.map(c => c.name).join(", ").length > 10
                    ? applicant.courses?.map(c => c.name).join(", ").slice(0, 10) + "..."
                    : applicant.courses?.map(c => c.name).join(", ") || "정보 없음"}
                </span>

                <span className="text-gray-500 text-center truncate">{applicant.email}</span>
                <span className="text-gray-500 text-center truncate">{applicant.phoneNumber}</span>
                <span className="text-gray-500 text-center">{applicant.applicationTime || "-"}</span>

                <span
                  className={`font-medium text-center ${
                    applicant.status === "PARTICIPANT"
                      ? "text-green-600"
                      : applicant.status === "WAIT"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
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
