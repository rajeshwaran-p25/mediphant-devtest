import { POST } from "./route";
import { NextRequest } from "next/server";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

describe("POST /api/interactions", () => {
  it("Return risky interaction for warfarin and ibuprofen", async () => {
    const request = new NextRequest(`${BASE_URL}/api/interactions`, {
      method: "POST",
      body: JSON.stringify({ medA: "warfarin", medB: "ibuprofen" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isPotentiallyRisky).toBe(true);
    expect(data.reason).toBe("Increased bleeding risk");
  });

  it("Return no interaction for unknown medications", async () => {
    const request = new NextRequest(`${BASE_URL}/api/interactions`, {
      method: "POST",
      body: JSON.stringify({ medA: "aspirin", medB: "vitamin-c" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isPotentiallyRisky).toBe(false);
    expect(data.reason).toContain("No known interaction");
  });

  it("Return error for missing medications", async () => {
    const request = new NextRequest(`${BASE_URL}/api/interactions`, {
      method: "POST",
      body: JSON.stringify({ medA: "", medB: "ibuprofen" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("Return error for duplicate medications", async () => {
    const request = new NextRequest(`${BASE_URL}/api/interactions`, {
      method: "POST",
      body: JSON.stringify({ medA: "aspirin", medB: "ASPIRIN" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("Check for case-insensitive interactions", async () => {
    const request = new NextRequest(`${BASE_URL}/api/interactions`, {
      method: "POST",
      body: JSON.stringify({ medA: "WARFARIN", medB: "Ibuprofen" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isPotentiallyRisky).toBe(true);
  });
});
