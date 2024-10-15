'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '../../_api/axiosInstance';

function AttendHistoryContent() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // 쿼리 파라미터 접근

  const [programId, setProgramId] = useState<number | null>(null);

  // QR 코드로부터 프로그램 ID 추출 및 팝업 표시
  useEffect(() => {
    const id = searchParams.get('programId');
    if (id) {
      setProgramId(Number(id));
      setShowPopup(true);
    }
  }, [searchParams]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/programs/${programId}/attend/`, {
        username: '20171534',
      });
      alert('참여가 성공적으로 기록되었습니다!');
      setShowPopup(false);
      router.push('/attend-history');
    } catch (error) {
      console.error('참여 실패:', error);
      alert('참여에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setShowPopup(false);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">참여 내역</h1>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">이 행사에 참여하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`py-2 px-4 mr-2 rounded ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'
                }`}
              >
                {isSubmitting ? '처리 중...' : '예'}
              </button>
              <button
                onClick={handleCancel}
                className="py-2 px-4 bg-gray-300 rounded"
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttendHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendHistoryContent />
    </Suspense>
  );
}
