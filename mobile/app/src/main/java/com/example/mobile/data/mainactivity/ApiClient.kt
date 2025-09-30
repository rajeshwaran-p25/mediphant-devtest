package com.example.mobile.data.mainactivity

import io.github.cdimascio.dotenv.dotenv
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.net.URLEncoder

object ApiClient {
    private val dotenv = dotenv {
        directory = "/assets"
        filename = "env"
        ignoreIfMissing = true
        ignoreIfMalformed = true
    }
    private val client = OkHttpClient()
    private val BASE_URL = dotenv["BASE_URL"]

    suspend fun askQuestion(question: String): ApiResponse = withContext(Dispatchers.IO) {
        try {
            val encodedQuestion = URLEncoder.encode(question, "UTF-8")
            val url = "$BASE_URL/api/faq?q=$encodedQuestion"

            val request = Request.Builder()
                .url(url)
                .build()

            val response = client.newCall(request).execute()
            val responseBody = response.body?.string() ?: throw Exception("Empty response")

            if (response.isSuccessful) {
                parseResponse(responseBody)
            } else {
                throw Exception("HTTP ${response.code}: ${response.message}")
            }
        } catch (e: Exception) {
            ApiResponse(
                answer = "Error: ${e.message}",
                matches = emptyList()
            )
        }
    }

    private fun parseResponse(json: String): ApiResponse {
        val jsonObject = JSONObject(json)
        val answer = jsonObject.getString("answer")
        val matchesArray = jsonObject.getJSONArray("matches")

        val matches = mutableListOf<Match>()
        for (i in 0 until matchesArray.length()) {
            val matchObj = matchesArray.getJSONObject(i)
            matches.add(
                Match(
                    text = matchObj.getString("text"),
                    score = matchObj.getDouble("score")
                )
            )
        }

        return ApiResponse(answer, matches)
    }
}