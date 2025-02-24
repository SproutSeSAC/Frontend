import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDialogContext } from '@/hooks';
import {
  acceptParticipant,
  rejectParticipant,
} from "@/services/session/sessionMutations";
import { fetchParticipants } from "@/services/session/sessionQueries";
import { Applicant } from "@/types";

export const useApplicants = () => {
  const { postId } = useParams();
  const { showToast } = useDialogContext();
  const [participants, setParticipants] = useState<Applicant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadParticipants = useCallback(() => {
    setLoading(true);
    fetchParticipants(Number(postId))
      .then((data) => {
        setParticipants(data);
      })
      .catch(() => showToast("참여자 목록을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleSelectAll = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map((p) => p.noticeParticipantId));
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedParticipants((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id]
    );
  };

  const handleAcceptAll = async () => {
    if (selectedParticipants.length === 0) {
      alert("선택된 참가자가 없습니다.");
      return;
    }

    try {
      await Promise.all(
        selectedParticipants.map((participantId) =>
          acceptParticipant(Number(postId), participantId)
        )
      );
      showToast("선택한 참가자들이 승인되었습니다.");
      setSelectedParticipants([]);
      loadParticipants();
    } catch {
        showToast("참가자 승인 중 오류가 발생했습니다.");
    }
  };

  const handleRejectAll = async () => {
    if (selectedParticipants.length === 0) {
      alert("선택된 참가자가 없습니다.");
      return;
    }

    try {
      await Promise.all(
        selectedParticipants.map((participantId) =>
          rejectParticipant(Number(postId), participantId)
        )
      );
      showToast("선택한 참가자들이 거절되었습니다.");
      setSelectedParticipants([]);
      loadParticipants();
    } catch {
        showToast("참가자 거절 중 오류가 발생했습니다.");
    }
  };

  return {
    participants,
    selectedParticipants,
    loading,
    handleSelectAll,
    handleCheckboxChange,
    handleAcceptAll,
    handleRejectAll,
  };
};
