export type Analysis = {
  id: string;
  file_name: string;
  status: string;
  result_label: string | null;
  confidence: number | null;
  model_type: string;
  model_name: string;
  created_at: string;
};

export type AnalysisListResponse = {
  items: Analysis[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type AnalysisDetail = Analysis & {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  storage_key: string;
  result_json_key: string | null;
  source_url: string | null;
  source_kind: string;
  result_label: string | null;
  confidence: number | null;
  real_score: number | null;
  fake_score: number | null;
  explanation: string | null;
  inference_time_ms: number | null;
  error_message: string | null;
  finished_at: string | null;
  logs: AnalysisLog[];
};

export type AnalysisLog = {
  id: number;
  event_type: string;
  message: string | null;
  created_at: string;
};

