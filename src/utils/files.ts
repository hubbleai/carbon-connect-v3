import {
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP_SIZE,
  DEFAULT_SIZE_MB,
  ENV,
  ONE_MB,
} from "../constants/shared";
import {
  Formats,
  CarbonConnectProps,
  LocalFilesIntegration,
} from "../typing/shared";
import { getBaseURL } from "./helper-functions";

export const generateFileUploadUrl = (
  fileType: string | undefined,
  filesConfig: LocalFilesIntegration | null | undefined,
  carbonProps: CarbonConnectProps
) => {
  const {
    chunkSize,
    overlapSize,
    embeddingModel,
    useOcr,
    parsePdfTablesWithOcr,
    maxItemsPerChunk,
    generateSparseVectors,
    prependFilenameToChunks,
    environment = ENV.PRODUCTION,
    apiURL,
  } = carbonProps;
  const allowedFileTypes = filesConfig?.allowedFileTypes || [];
  const fileTypeConfigValue = allowedFileTypes.find(
    (type) => type && type.extension == fileType
  );
  const setPageAsBoundary =
    fileTypeConfigValue?.setPageAsBoundary ||
    filesConfig?.setPageAsBoundary ||
    false;
  const chunkSizeValue =
    fileTypeConfigValue?.chunkSize ||
    filesConfig?.chunkSize ||
    chunkSize ||
    DEFAULT_CHUNK_SIZE;
  const overlapSizeValue =
    fileTypeConfigValue?.overlapSize ||
    filesConfig?.overlapSize ||
    overlapSize ||
    DEFAULT_OVERLAP_SIZE;

  const skipEmbeddingGeneration =
    fileTypeConfigValue?.skipEmbeddingGeneration ||
    filesConfig?.skipEmbeddingGeneration ||
    false;

  const embeddingModelValue = embeddingModel || null;

  const useOCRValue =
    fileTypeConfigValue?.useOcr || filesConfig?.useOcr || useOcr || false;

  const parsePdfTablesWithOcrValue =
    filesConfig?.parsePdfTablesWithOcr ||
    fileTypeConfigValue?.parsePdfTablesWithOcr ||
    parsePdfTablesWithOcr ||
    false;

  const generateSparseVectorsValue =
    fileTypeConfigValue?.generateSparseVectors ||
    filesConfig?.generateSparseVectors ||
    generateSparseVectors ||
    false;

  const prependFilenameToChunksValue =
    filesConfig?.prependFilenameToChunks || prependFilenameToChunks || false;

  const maxItemsPerChunkValue =
    filesConfig?.maxItemsPerChunk || maxItemsPerChunk || undefined;

  const splitRowsValue =
    fileTypeConfigValue?.splitRows || filesConfig?.splitRows || false;

  const transcriptionServiceValue =
    fileTypeConfigValue?.transcriptionService ||
    filesConfig?.transcriptionService;

  const includeSpeakerLabelsValue =
    fileTypeConfigValue?.includeSpeakerLabels ||
    filesConfig?.includeSpeakerLabels ||
    false;

  const generateChunksOnlyValue =
    fileTypeConfigValue?.generateChunksOnly ||
    filesConfig?.generateChunksOnly ||
    false;

  const endpointUrl = new URL(`${getBaseURL(apiURL, environment)}/uploadfile`);

  endpointUrl.searchParams.append(
    "set_page_as_boundary",
    setPageAsBoundary.toString()
  );
  endpointUrl.searchParams.append("chunk_size", chunkSizeValue.toString());
  endpointUrl.searchParams.append("chunk_overlap", overlapSizeValue.toString());
  endpointUrl.searchParams.append(
    "skip_embedding_generation",
    skipEmbeddingGeneration.toString()
  );
  embeddingModelValue &&
    endpointUrl.searchParams.append("embedding_model", embeddingModelValue);
  endpointUrl.searchParams.append("use_ocr", useOCRValue.toString());
  endpointUrl.searchParams.append(
    "parse_pdf_tables_with_ocr",
    parsePdfTablesWithOcrValue.toString()
  );
  endpointUrl.searchParams.append(
    "generate_sparse_vectors",
    generateSparseVectorsValue.toString()
  );
  endpointUrl.searchParams.append(
    "prepend_filename_to_chunks",
    prependFilenameToChunksValue.toString()
  );
  endpointUrl.searchParams.append("split_rows", splitRowsValue.toString());

  transcriptionServiceValue &&
    endpointUrl.searchParams.append(
      "transcription_service",
      transcriptionServiceValue.toString()
    );

  endpointUrl.searchParams.append(
    "include_speaker_labels",
    includeSpeakerLabelsValue.toString()
  );

  if (maxItemsPerChunkValue) {
    endpointUrl.searchParams.append(
      "max_items_per_chunk",
      maxItemsPerChunkValue.toString()
    );
  }

  if (generateChunksOnlyValue) {
    endpointUrl.searchParams.append(
      "generate_chunks_only",
      generateChunksOnlyValue.toString()
    );
  }

  return endpointUrl;
};

export const getFileSizeLimit = (
  processedIntegration: LocalFilesIntegration,
  whiteLabelingData: any,
  maxFileSize: number
) => {
  const defaultLimit = DEFAULT_SIZE_MB * ONE_MB;
  const orgLevelLimit =
    whiteLabelingData?.custom_limits?.file_size_limit || defaultLimit;
  const ccLimit = processedIntegration?.maxFileSize || maxFileSize;

  return Math.min(orgLevelLimit, ccLimit);
};

export const getSupportedFileTypes = (extensions: string[]) => {
  const allFormats: Formats = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
    "text/html": [".html"],
    "text/markdown": [".md"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "application/json": [".json"],
    "audio/mpeg": [".mp3"],
    "video/mp4": [".mp4"],
    "audio/aac": [".aac"],
    "audio/wav": [".wav"],
    "audio/flac": [".flac"],
    "audio/x-pcm": [".pcm"],
    "audio/mp4": [".m4a"],
    "audio/ogg": [".ogg"],
    "audio/opus": [".opus"],
    "image/webp": [".webp"],
  };

  let accepted: any = {};
  let key: keyof Formats;
  for (key in allFormats) {
    if (extensions.map((ext) => "." + ext).includes(allFormats[key][0])) {
      accepted[key] = allFormats[key];
    }
  }
  return accepted;
};
