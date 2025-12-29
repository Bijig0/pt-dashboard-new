import Foundation

/// Represents a single cell in the table
struct TableCell: Identifiable, Codable, Hashable {
    let id: UUID
    var row: Int
    var column: Int
    var content: String
    var confidence: Float

    init(id: UUID = UUID(), row: Int, column: Int, content: String, confidence: Float = 1.0) {
        self.id = id
        self.row = row
        self.column = column
        self.content = content
        self.confidence = confidence
    }
}

/// Represents the complete table data extracted from an image
struct TableData: Identifiable, Codable {
    let id: UUID
    var cells: [TableCell]
    var rows: Int
    var columns: Int
    var createdAt: Date
    var imageName: String?

    init(id: UUID = UUID(), cells: [TableCell] = [], rows: Int = 0, columns: Int = 0, createdAt: Date = Date(), imageName: String? = nil) {
        self.id = id
        self.cells = cells
        self.rows = rows
        self.columns = columns
        self.createdAt = createdAt
        self.imageName = imageName
    }

    /// Get cell at specific row and column
    func cell(at row: Int, column: Int) -> TableCell? {
        cells.first { $0.row == row && $0.column == column }
    }

    /// Get all cells in a specific row
    func cellsInRow(_ row: Int) -> [TableCell] {
        cells.filter { $0.row == row }.sorted { $0.column < $1.column }
    }

    /// Get all cells in a specific column
    func cellsInColumn(_ column: Int) -> [TableCell] {
        cells.filter { $0.column == column }.sorted { $0.row < $1.row }
    }

    /// Convert to dictionary format for Supabase
    func toDictionary() -> [String: Any] {
        return [
            "id": id.uuidString,
            "rows": rows,
            "columns": columns,
            "created_at": ISO8601DateFormatter().string(from: createdAt),
            "image_name": imageName ?? "",
            "cells": cells.map { cell in
                [
                    "id": cell.id.uuidString,
                    "row": cell.row,
                    "column": cell.column,
                    "content": cell.content,
                    "confidence": cell.confidence
                ]
            }
        ]
    }
}
