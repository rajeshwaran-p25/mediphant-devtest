package com.example.mobile.components


import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.mobile.data.mainactivity.ApiResponse

@Composable
fun AnswerCard(
    response: ApiResponse?,
    modifier: Modifier = Modifier,
    maxHeight: Int? = 300,
    showTitle: Boolean = true,
    title: String = "Answer:"
) {
    response?.let { apiResponse ->
        Card(
            modifier = modifier
                .fillMaxWidth()
                .padding(top = 24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            val scrollState = rememberScrollState()

            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .then(
                        if (maxHeight != null) {
                            Modifier.heightIn(max = maxHeight.dp)
                        } else {
                            Modifier
                        }
                    )
                    .verticalScroll(scrollState)
            ) {
                if (showTitle) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                Text(
                    text = apiResponse.answer,
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }
        }
    }
}