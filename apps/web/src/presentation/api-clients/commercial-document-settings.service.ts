import {
  CommercialDocumentSettingsResponse,
  CommercialDocumentSettingsUpdateRequest
} from "@/api/schemas/commercial-document-settings-schemas";

const API_ENDPOINT = "/api/commercial-document-settings";

export class CommercialDocumentSettingsService {
  static async get(): Promise<CommercialDocumentSettingsResponse> {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error("Failed to fetch commercial document settings");
    }
    return response.json();
  }

  static async update(
    data: CommercialDocumentSettingsUpdateRequest
  ): Promise<CommercialDocumentSettingsResponse> {
    const response = await fetch(API_ENDPOINT, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update commercial document settings");
    }

    return response.json();
  }
}
