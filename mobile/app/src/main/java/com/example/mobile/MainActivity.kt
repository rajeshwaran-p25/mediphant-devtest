package com.example.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.mobile.ui.theme.MobileTheme
import kotlinx.coroutines.launch
import com.example.mobile.data.mainactivity.ApiClient
import com.example.mobile.data.mainactivity.ApiResponse
import com.example.mobile.components.TextField
import com.example.mobile.components.Button
import com.example.mobile.components.AnswerCard

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MobileTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FaqScreen()
                }
            }
        }
    }
}

@Composable
fun FaqScreen() {
    var question by remember { mutableStateOf("") }
    var faqResponse by remember { mutableStateOf<ApiResponse?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val minCharacters = 3
    val maxCharacters = 500

    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "FAQ Bot",
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        TextField(
            value = question,
            onValueChange = { question = it },
            label = "Ask a question",
            placeholder = "Type your question here...",
            minCharacters = minCharacters,
            maxCharacters = maxCharacters,
            showCharacterCount = true
        )

        Button(
            onClick = {
                scope.launch {
                    isLoading = true
                    faqResponse = ApiClient.askQuestion(question)
                    isLoading = false
                }
            },
            text = "Get Answer",
            isLoading = isLoading,
            enabled = question.isNotEmpty()
        )

        AnswerCard(
            response = faqResponse,
            maxHeight = 300,
            showTitle = true
        )
    }
}