package com.example.mobile.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun Button(
    onClick: () -> Unit,
    text: String,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    modifier: Modifier = Modifier,
    fillMaxWidth: Boolean = true,
    showDisabledMessage: Boolean = false,
    disabledMessage: String = "Please fill in all required fields"
) {
    Button(
        onClick = onClick,
        enabled = enabled && !isLoading,
        modifier = if (fillMaxWidth) {
            modifier.fillMaxWidth()
        } else {
            modifier
        }
    ) {
        when {
            isLoading -> {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = MaterialTheme.colorScheme.onPrimary,
                    strokeWidth = 2.dp
                )
            }
            !enabled && showDisabledMessage -> {
                Text(disabledMessage)
            }
            else -> {
                Text(text)
            }
        }
    }
}