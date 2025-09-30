package com.example.mobile.data.mainactivity

data class ApiResponse(
    val answer: String,
    val matches: List<Match>
)

data class Match(
    val text: String,
    val score: Double
)