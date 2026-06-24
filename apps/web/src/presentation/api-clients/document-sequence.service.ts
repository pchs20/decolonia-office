import {
  DocumentSequenceAdjustRequest,
  DocumentSequenceResponse
} from "@/api/schemas/document-sequence-schemas";

const API_ENDPOINT = "/api/commercial-document-settings/sequences";

interface DocumentSequenceListResponse {
  sequences: DocumentSequenceResponse[];
}

export class DocumentSequenceService {
  static async getAll(year?: number): Promise<DocumentSequenceListResponse> {
    const params = new URLSearchParams();
    if (typeof year === "number") {
      params.set("year", year.toString());
    }

    const url = params.size > 0 ? `${API_ENDPOINT}?${params.toString()}` : API_ENDPOINT;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch document sequences");
    }

    return response.json();
  }

  static async adjust(data: DocumentSequenceAdjustRequest): Promise<DocumentSequenceResponse> {
    const response = await fetch(`${API_ENDPOINT}/adjust`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update document sequence");
    }

    return response.json();
  }
}
