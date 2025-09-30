package com.example.mobile.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    singleLine: Boolean = true,
    maxLines: Int = 1,
    placeholder: String? = null,
    minCharacters: Int? = null,
    maxCharacters: Int? = null,
    showCharacterCount: Boolean = false,
    errorMessage: String? = null,
    isError: Boolean = false
) {
    val hasMinCharError = minCharacters?.let { value.length < it && value.isNotEmpty() } ?: false
    val hasMaxCharError = maxCharacters?.let { value.length > it } ?: false
    val showError = isError || hasMinCharError || hasMaxCharError

    val currentErrorMessage = when {
        hasMinCharError && minCharacters != null -> "Minimum $minCharacters characters required"
        hasMaxCharError && maxCharacters != null -> "Maximum $maxCharacters characters allowed"
        errorMessage != null -> errorMessage
        else -> null
    }

    TextField(
        value = value,
        onValueChange = { newValue ->
            // Optional: Prevent exceeding max characters
            if (maxCharacters == null || newValue.length <= maxCharacters) {
                onValueChange(newValue)
            }
        },
        label = { Text(label) },
        placeholder = placeholder?.let { { Text(it) } },
        enabled = enabled,
        singleLine = singleLine,
        maxLines = maxLines,
        isError = showError,
        supportingText = {
            when {
                currentErrorMessage != null -> {
                    Text(
                        text = currentErrorMessage,
                        color = MaterialTheme.colorScheme.error
                    )
                }
                showCharacterCount -> {
                    val charCountText = if (maxCharacters != null) {
                        "${value.length} / $maxCharacters"
                    } else {
                        "${value.length} characters"
                    }
                    Text(
                        text = charCountText,
                        color = if (hasMaxCharError) {
                            MaterialTheme.colorScheme.error
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        }
                    )
                }
            }
        },
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = if (currentErrorMessage != null || showCharacterCount) 8.dp else 16.dp),
        colors = TextFieldDefaults.colors()
    )

}