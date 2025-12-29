import Foundation
import Vision
import UIKit

/// Service responsible for performing OCR on images
@Observable
class OCRService {
    var isProcessing = false
    var error: Error?

    /// Perform OCR on an image and extract text
    func recognizeText(from image: UIImage) async throws -> OCRResult {
        let startTime = Date()
        isProcessing = true
        defer { isProcessing = false }

        guard let cgImage = image.cgImage else {
            throw OCRError.invalidImage
        }

        return try await withCheckedThrowingContinuation { continuation in
            let request = VNRecognizeTextRequest { request, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                guard let observations = request.results as? [VNRecognizedTextObservation] else {
                    continuation.resume(throwing: OCRError.noTextFound)
                    return
                }

                // Extract all recognized text
                var allText = ""
                var confidenceSum: Float = 0
                var textItems: [(text: String, boundingBox: CGRect, confidence: Float)] = []

                for observation in observations {
                    guard let topCandidate = observation.topCandidates(1).first else { continue }

                    let text = topCandidate.string
                    let confidence = topCandidate.confidence
                    let boundingBox = observation.boundingBox

                    allText += text + "\n"
                    confidenceSum += confidence
                    textItems.append((text, boundingBox, confidence))
                }

                let averageConfidence = observations.isEmpty ? 0 : confidenceSum / Float(observations.count)

                // Parse the text into table format
                let tableData = self.parseTextToTable(textItems: textItems, imageSize: image.size)

                let result = OCRResult(
                    originalImage: image,
                    recognizedText: allText.trimmingCharacters(in: .whitespacesAndNewlines),
                    tableData: tableData,
                    confidence: averageConfidence,
                    processingTime: Date().timeIntervalSince(startTime)
                )

                continuation.resume(returning: result)
            }

            // Configure for accurate handwriting recognition
            request.recognitionLevel = .accurate
            request.recognitionLanguages = ["en-US"]
            request.usesLanguageCorrection = true

            let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

            do {
                try handler.perform([request])
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }

    /// Parse recognized text items into a table structure
    private func parseTextToTable(
        textItems: [(text: String, boundingBox: CGRect, confidence: Float)],
        imageSize: CGSize
    ) -> TableData {
        // Sort text items by their vertical position (top to bottom)
        let sortedByY = textItems.sorted { $0.boundingBox.minY > $1.boundingBox.minY }

        // Group text items into rows based on Y-coordinate proximity
        var rows: [[( text: String, boundingBox: CGRect, confidence: Float)]] = []
        var currentRow: [(text: String, boundingBox: CGRect, confidence: Float)] = []
        var lastY: CGFloat?

        let rowThreshold: CGFloat = 0.02 // Threshold for considering items in the same row

        for item in sortedByY {
            let itemY = item.boundingBox.minY

            if let lastY = lastY, abs(itemY - lastY) > rowThreshold {
                if !currentRow.isEmpty {
                    rows.append(currentRow)
                    currentRow = []
                }
            }

            currentRow.append(item)
            lastY = itemY
        }

        if !currentRow.isEmpty {
            rows.append(currentRow)
        }

        // Sort items within each row by X-coordinate (left to right)
        rows = rows.map { row in
            row.sorted { $0.boundingBox.minX < $1.boundingBox.minX }
        }

        // Determine the maximum number of columns
        let maxColumns = rows.map { $0.count }.max() ?? 0

        // Create table cells
        var cells: [TableCell] = []
        for (rowIndex, row) in rows.enumerated() {
            for (colIndex, item) in row.enumerated() {
                let cell = TableCell(
                    row: rowIndex,
                    column: colIndex,
                    content: item.text,
                    confidence: item.confidence
                )
                cells.append(cell)
            }
        }

        return TableData(
            cells: cells,
            rows: rows.count,
            columns: maxColumns
        )
    }
}

enum OCRError: LocalizedError {
    case invalidImage
    case noTextFound
    case processingFailed

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "The selected image is invalid or cannot be processed."
        case .noTextFound:
            return "No text was found in the image."
        case .processingFailed:
            return "Failed to process the image."
        }
    }
}
