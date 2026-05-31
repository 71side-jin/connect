import { useEffect, useMemo, useState } from "react";

import {
  ADMIN_ANALYSIS_API,
  clearAdminToken,
  fetchAdminJson,
  fetchAdminResponse,
} from "../api/adminApi";
import { PageButton, Td, Th } from "../components/AdminTable";
import AnalysisDetailPanel from "../components/AnalysisDetailPanel";
import FilterField from "../components/FilterField";
import {
  MODEL_NAME_MAP,
  MODEL_TYPE_OPTIONS,
  RESULT_OPTIONS,
  STATUS_OPTIONS,
} from "../constants/analysisFilters";
import "../css/AnalysisList.css";
import type { Analysis, AnalysisDetail, AnalysisListResponse } from "../types/analysis";

type Props = {
  onLogout: () => void;
};

export default function AnalysisList({ onLogout }: Props) {
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Analysis | null>(null);
  const [detail, setDetail] = useState<AnalysisDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [modelTypeFilter, setModelTypeFilter] = useState("all");
  const [modelNameFilter, setModelNameFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [previewBlobUrl, setPreviewBlobUrl] = useState("");
  const itemsPerPage = 10;

  const modelNameOptions = useMemo(() => {
    if (modelTypeFilter === "all") return [];
    return MODEL_NAME_MAP[modelTypeFilter] ?? [];
  }, [modelTypeFilter]);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
    setLoading(true);
  }

  function updateSortOrder(value: string) {
    setSortOrder(value as "desc" | "asc");
    setCurrentPage(1);
    setLoading(true);
  }

  function updateModelTypeFilter(value: string) {
    setModelTypeFilter(value);
    setModelNameFilter((current) => {
      const validModels = MODEL_NAME_MAP[value] ?? [];
      return value === "all" || !validModels.includes(current) ? "all" : current;
    });
    setCurrentPage(1);
    setLoading(true);
  }

  function updateCurrentPage(value: number) {
    setCurrentPage(value);
    setLoading(true);
  }

  function closeDetailPanel() {
    setSelectedId(null);
    setSelectedItem(null);
    setDetail(null);
    setPreviewBlobUrl("");
    setTextContent("");
  }

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(itemsPerPage));
    params.set("sort_order", sortOrder);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (resultFilter !== "all") params.set("result_label", resultFilter);
    if (modelTypeFilter !== "all") params.set("model_type", modelTypeFilter);
    if (modelNameFilter !== "all") params.set("model_name", modelNameFilter);

    fetchAdminJson<AnalysisListResponse>(`${ADMIN_ANALYSIS_API}?${params}`)
      .then((response) => {
        setData(response.items);
        setTotalPages(response.total_pages);
        setTotalCount(response.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [currentPage, statusFilter, resultFilter, modelTypeFilter, modelNameFilter, sortOrder]);

  useEffect(() => {
    if (!selectedId) return;
    fetchAdminJson<AnalysisDetail>(`${ADMIN_ANALYSIS_API}/${selectedId}`)
      .then(setDetail)
      .catch(console.error);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId || !selectedItem || !detail) return;
    let objectUrl = "";

    fetchAdminResponse(`${ADMIN_ANALYSIS_API}/${selectedId}/preview`)
      .then(async (response) => {
        if (detail.mime_type.startsWith("text/") || detail.mime_type === "application/json" || detail.source_kind === "url_only") {
          setTextContent(await response.text());
          return;
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewBlobUrl(objectUrl);
      })
      .catch(console.error);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedId, selectedItem, detail]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = start + max - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - max + 1);
    }
    for (let page = start; page <= end; page += 1) pages.push(page);
    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="admin-shell">
        <main className="admin-page">
          <section className="admin-loading-panel">Loading...</section>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <main className={`admin-page ${detail ? "has-panel" : ""}`}>
        <div className="admin-main">
          <div className="admin-topbar">
            <button
              className="admin-floating-logout"
              onClick={() => {
                clearAdminToken();
                onLogout();
              }}
            >
              로그아웃
            </button>
          </div>

          <section className="admin-hero">
            <div className="admin-hero-copy">분석 결과 목록</div>
            <div className="admin-hero-stats">
              <div className="admin-stat-card"><span>전체 결과</span><strong>{totalCount}</strong></div>
              <div className="admin-stat-card"><span>현재 페이지</span><strong>{currentPage}</strong></div>
              <div className="admin-stat-card"><span>총 페이지</span><strong>{totalPages}</strong></div>
            </div>
          </section>

          <section className="admin-filter-panel">
            <FilterField
              label="상태"
              value={statusFilter}
              onChange={(value) => updateFilter(setStatusFilter, value)}
              options={[{ value: "all", label: "전체" }, ...STATUS_OPTIONS.map((status) => ({ value: status, label: status }))]}
            />
            <FilterField
              label="결과"
              value={resultFilter}
              onChange={(value) => updateFilter(setResultFilter, value)}
              options={[{ value: "all", label: "전체" }, ...RESULT_OPTIONS.map((result) => ({ value: result, label: result }))]}
            />
            <FilterField
              label="모델 타입"
              value={modelTypeFilter}
              onChange={updateModelTypeFilter}
              options={[{ value: "all", label: "전체" }, ...MODEL_TYPE_OPTIONS.map((type) => ({ value: type, label: type }))]}
            />
            <FilterField
              label="모델 이름"
              value={modelNameFilter}
              onChange={(value) => updateFilter(setModelNameFilter, value)}
              disabled={modelTypeFilter === "all"}
              options={[{ value: "all", label: "전체" }, ...modelNameOptions.map((name) => ({ value: name, label: name }))]}
            />
            <FilterField
              label="시간 정렬"
              value={sortOrder}
              onChange={updateSortOrder}
              options={[
                { value: "desc", label: "최신순" },
                { value: "asc", label: "오래된순" },
              ]}
            />
          </section>

          <div className="admin-total-row">총 {totalCount}개</div>

          <section className="admin-table-panel">
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th>파일명</Th>
                    <Th>상태</Th>
                    <Th>결과</Th>
                    <Th>신뢰도</Th>
                    <Th>모델 타입</Th>
                    <Th>모델 이름</Th>
                    <Th>시간</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="admin-row"
                      onClick={() => {
                        setSelectedId(item.id);
                        setSelectedItem(item);
                      }}
                    >
                      <Td className="is-file">{item.file_name}</Td>
                      <Td><span className={`admin-badge status-${item.status}`}>{item.status}</span></Td>
                      <Td>{item.result_label && <span className={`admin-badge result-${item.result_label.toLowerCase()}`}>{item.result_label}</span>}</Td>
                      <Td>{formatConfidence(item.confidence)}</Td>
                      <Td>{item.model_type}</Td>
                      <Td>{item.model_name}</Td>
                      <Td>{new Date(item.created_at).toLocaleString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <PageButton onClick={() => updateCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>이전</PageButton>
              {pageNumbers.map((page) => (
                <PageButton key={page} onClick={() => updateCurrentPage(page)} active={page === currentPage}>{page}</PageButton>
              ))}
              <PageButton onClick={() => updateCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>다음</PageButton>
            </div>
          </section>
        </div>

        {detail && selectedItem && selectedId && (
          <AnalysisDetailPanel
            detail={detail}
            selectedId={selectedId}
            selectedItem={selectedItem}
            previewBlobUrl={previewBlobUrl}
            textContent={textContent}
            onClose={closeDetailPanel}
          />
        )}
      </main>
    </div>
  );
}

function formatConfidence(confidence: number | null) {
  return confidence != null ? `${(confidence * 100).toFixed(1)}%` : "-";
}
