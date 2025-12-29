import Foundation
import UIKit

/// Represents the result of an OCR scan
struct OCRResult {
    let originalImage: UIImage
    let recognizedText: String
    let tableData: TableData
    let confidence: Float
    let processingTime: TimeInterval

    init(
        originalImage: UIImage,
        recognizedText: String,
        tableData: TableData,
        confidence: Float,
        processingTime: TimeInterval
    ) {
        self.originalImage = originalImage
        self.recognizedText = recognizedText
        self.tableData = tableData
        self.confidence = confidence
        self.processingTime = processingTime
    }
}

/// Represents the current state of the scanning process
enum ScanState: Equatable {
    case idle
    case selecting
    case processing
    case completed(OCRResult)
    case error(String)

    static func == (lhs: ScanState, rhs: ScanState) -> Bool {
        switch (lhs, rhs) {
        case (.idle, .idle),
             (.selecting, .selecting),
             (.processing, .processing):
            return true
        case (.completed, .completed),
             (.error, .error):
            return true
        default:
            return false
        }
    }
}
