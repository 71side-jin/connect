import { useMemo } from "react";

import { ADMIN_ANALYSIS_API, fetchAdminResponse } from "../api/adminApi";
import type { Analysis, AnalysisDetail, AnalysisLog } from "../types/analysis";

type Props = {
  detail: AnalysisDetail;
  selectedId: string;
  selectedItem: Analysis;
  previewBlobUrl: string;
  textContent: string;
  onClose: () => void;
};

const TIMELINE_EVENTS = new Set([
  "processing_started",
  "processing_finished",
  "processing_failed",
]);

export default function AnalysisDetailPanel({
  detail,
  selectedId,
  selectedItem,
  previewBlobUrl,
  textContent,
  onClose,
}: Props) {
  const realScore = useMemo(() => formatPercentValue(detail.real_score), [detail.real_score]);
  const fakeScore = useMemo(() => formatPercentValue(detail.fake_score), [detail.fake_score]);

  async function handleDownload() {
    try {
      const response = await fetchAdminResponse(`${ADMIN_ANALYSIS_API}/${selectedId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = selectedItem.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="admin-panel-wrapper">
      <button className="admin-panel-close" onClick={onClose} aria-label="닫기">×</button>

      <aside className="admin-side-panel">
        <div className="panel-table">
          <table>
            <tbody>
              <tr>
                <th>파일명</th>
                <td colSpan={5}>{selectedItem.file_name}</td>
              </tr>
              <tr>
                <th>상태</th>
                <td><span className={`admin-badge status-${selectedItem.status}`}>{selectedItem.status}</span></td>
                <th>결과</th>
                <td>
                  {selectedItem.result_label && (
                    <span className={`admin-badge result-${selectedItem.result_label.toLowerCase()}`}>
                      {selectedItem.result_label}
                    </span>
                  )}
                </td>
                <th>신뢰도</th>
                <td>{formatConfidence(selectedItem.confidence)}</td>
              </tr>
              <tr>
                <th>모델 타입</th>
                <td colSpan={2}>{selectedItem.model_type}</td>
                <th>모델 이름</th>
                <td colSpan={2}>{selectedItem.model_name}</td>
              </tr>
              <tr>
                <th>시간</th>
                <td colSpan={5}>{new Date(selectedItem.created_at).toLocaleString()}</td>
              </tr>
              {detail.source_url ? (
                <tr>
                  <th>URL</th>
                  <td colSpan={5}>{detail.source_url}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="panel-row">
          <div className="panel-preview">
            <button className="preview-download-button" onClick={handleDownload}>다운로드</button>
            <Preview detail={detail} previewBlobUrl={previewBlobUrl} textContent={textContent} />
          </div>

          <div className="panel-score">
            <div>Real Score</div>
            <div>{realScore}</div>
            <div>Fake Score</div>
            <div>{fakeScore}</div>
          </div>
        </div>

        <div className="timeline-table">
          <div className="timeline-side">타임라인</div>
          <div className="timeline-rows">
            {detail.logs
              .filter((log) => TIMELINE_EVENTS.has(log.event_type))
              .map((log) => <TimelineRow key={log.id} log={log} />)}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Preview({
  detail,
  previewBlobUrl,
  textContent,
}: {
  detail: AnalysisDetail;
  previewBlobUrl: string;
  textContent: string;
}) {
  if (detail.model_type === "text" || detail.source_kind === "url_only") {
    return <pre className="panel-text-preview">{textContent || "미리보기 내용이 없습니다."}</pre>;
  }
  if (detail.mime_type.startsWith("image/")) {
    return <img src={previewBlobUrl} alt={detail.file_name} className="panel-preview-media" />;
  }
  if (detail.mime_type.startsWith("video/") || detail.model_type === "video" || detail.model_type === "multimodal") {
    return <video src={previewBlobUrl} controls className="panel-preview-media" />;
  }
  return <pre className="panel-text-preview">{textContent || "이 파일 형식은 미리보기를 지원하지 않습니다."}</pre>;
}

function TimelineRow({ log }: { log: AnalysisLog }) {
  const label =
    log.event_type === "processing_started"
      ? "Analysis started"
      : log.event_type === "processing_finished"
        ? "Analysis completed"
        : "Analysis failed";

  return (
    <div className="timeline-row">
      <div className="timeline-event">{label}</div>
      <div className="timeline-time">{new Date(log.created_at).toLocaleString()}</div>
    </div>
  );
}

function formatPercentValue(value: number | null) {
  return value != null ? `${value.toFixed(1)}%` : "-";
}

function formatConfidence(confidence: number | null) {
  return confidence != null ? `${(confidence * 100).toFixed(1)}%` : "-";
}
