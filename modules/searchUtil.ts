import axios from "axios"
import { queryChunk } from "../interfaces/queryChunk"

// Utilities for searching the roblox API documentation
const URI = "https://apis.roblox.com/creator-resources-search-api/v1/search/docsite"
export async function query(queryParam: string, pageSize?: number): Promise<queryChunk[]> {
	const result: any = await (await fetch("https://apis.roblox.com/creator-resources-search-api/v1/search/docsite", {
		"credentials": "include",
		"headers": {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"Content-Type": "application/json-patch+json",
			"x-csrf-token": "" + process.env.CSRFTOKEN,
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-site"
		},
		"referrer": "https://create.roblox.com/",
		"body": `{"keyword":"${queryParam}","isFuzzyMatch":false,"documentationContentType":"","documentationSubType":"","documentationThirdType":"","tag":"","locale":"en-US","pageSize":${pageSize ?? 20}}`,
		"method": "POST",
		"mode": "cors"
	})).json()
	return result
}