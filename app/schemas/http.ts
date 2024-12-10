import { z } from "zod";

type HTTPRequestParams = {
  body?: Record<string, string>;
  params?: Record<string, string>;
  headers?: Record<string, string>;
};

export class HTTPRequest {
  body?: Record<string, string>;
  params?: Record<string, string>;
  headers?: Record<string, string>;

  constructor(event: HTTPRequestParams) {
    this.params = event.params || undefined;
    this.body = event.body || undefined;
    this.headers = event.headers || undefined;
  }

  toString(): string {
    return `HTTPRequest(params=${JSON.stringify(this.params)}, body=${JSON.stringify(this.body)}, headers=${JSON.stringify(this.headers)})`;
  }
}

export class HTTPResponse {
  statusCode: number;
  body?: Record<string, any>;
  message?: string;
  headers: Record<string, string>;

  constructor(statusCode: number, body?: Record<string, any>, message?: string) {
    this.statusCode = statusCode;
    this.body = body || {};
    this.message = message || undefined;
    this.headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  toDJson(): Record<string, any> {
    if (this.message) {
      this.body = { ...this.body, message: this.message };
    }
    return {
      statusCode: this.statusCode,
      body: this.body ? JSON.stringify(this.body) : null,
      headers: this.headers,
    };
  }

  toString(): string {
    return `HTTPResponse(statusCode=${this.statusCode}, body=${JSON.stringify(this.body)})`;
  }
}

export class HTTPError extends HTTPResponse {
  constructor(statusCode: number, details?: string | Error) {
    const errorDetails = typeof details === "string" ? details : details?.message || "An error occurred";
    super(statusCode, { details: errorDetails });

    this.headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  toString(): string {
    return `HTTPError(statusCode=${this.statusCode}, body=${JSON.stringify(this.body)})`;
  }
}

export const HTTPRequestSchema = z.object({
  body: z.record(z.string()).optional(),
  params: z.record(z.string()).optional(),
  headers: z.record(z.string()).optional(),
});

export const HTTPResponseSchema = z.object({
  statusCode: z.number(),
  body: z.record(z.any()).optional(),
  message: z.string().optional(),
  headers: z.record(z.string()),
});
