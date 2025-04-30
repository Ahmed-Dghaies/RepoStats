import { describe, expect, it } from "vitest";
import { extractRepositoryDetailsFromUrl } from "../url";

describe("extractRepositoryDetailsFromUrl", () => {
  it("Get repository details from a valid github url", () => {
    const url = "https://github.com/owner/repo";
    const result = extractRepositoryDetailsFromUrl(url);
    expect(result).toEqual({ platform: "github.com", organization: "owner", repository: "repo" });
  });

  it("Get repository details from an invalid github url", () => {
    const url = "https://github.com/owner/";
    const result = extractRepositoryDetailsFromUrl(url);
    expect(result).toEqual(null);
  });

  it("Get repository details from an invalid url", () => {
    const url = "whatever";
    const result = extractRepositoryDetailsFromUrl(url);
    expect(result).toEqual(null);
  });
});
