import Foundation
import SwiftUI
import PhotosUI

@Observable
class ScannerViewModel {
    // MARK: - Properties
    var scanState: ScanState = .idle
    var currentTableData: TableData?
    var selectedImage: UIImage?
    var isShowingImagePicker = false
    var isShowingCamera = false
    var isUploadingToSupabase = false
    var uploadSuccess = false
    var showUploadSuccessAlert = false

    // Services
    private let ocrService = OCRService()
    private var supabaseService: SupabaseService?

    // MARK: - Image Selection
    func selectImageFromLibrary() {
        isShowingImagePicker = true
    }

    func selectImageFromCamera() {
        isShowingCamera = true
    }

    // MARK: - OCR Processing
    func processImage(_ image: UIImage) async {
        selectedImage = image
        scanState = .processing

        do {
            let result = try await ocrService.recognizeText(from: image)
            scanState = .completed(result)
            currentTableData = result.tableData
        } catch {
            scanState = .error(error.localizedDescription)
        }
    }

    // MARK: - Table Editing
    func updateCell(_ cell: TableCell, newContent: String) {
        guard var tableData = currentTableData else { return }

        if let index = tableData.cells.firstIndex(where: { $0.id == cell.id }) {
            tableData.cells[index].content = newContent
            currentTableData = tableData
        }
    }

    func addRow() {
        guard var tableData = currentTableData else { return }

        let newRow = tableData.rows
        for col in 0..<max(tableData.columns, 1) {
            let cell = TableCell(row: newRow, column: col, content: "")
            tableData.cells.append(cell)
        }
        tableData.rows += 1
        currentTableData = tableData
    }

    func addColumn() {
        guard var tableData = currentTableData else { return }

        let newCol = tableData.columns
        for row in 0..<max(tableData.rows, 1) {
            let cell = TableCell(row: row, column: newCol, content: "")
            tableData.cells.append(cell)
        }
        tableData.columns += 1
        currentTableData = tableData
    }

    func deleteRow(_ row: Int) {
        guard var tableData = currentTableData, row < tableData.rows else { return }

        // Remove cells in the row
        tableData.cells.removeAll { $0.row == row }

        // Update row indices for cells below
        for index in tableData.cells.indices {
            if tableData.cells[index].row > row {
                tableData.cells[index].row -= 1
            }
        }

        tableData.rows -= 1
        currentTableData = tableData
    }

    func deleteColumn(_ column: Int) {
        guard var tableData = currentTableData, column < tableData.columns else { return }

        // Remove cells in the column
        tableData.cells.removeAll { $0.column == column }

        // Update column indices for cells to the right
        for index in tableData.cells.indices {
            if tableData.cells[index].column > column {
                tableData.cells[index].column -= 1
            }
        }

        tableData.columns -= 1
        currentTableData = tableData
    }

    // MARK: - Supabase Integration
    func setSupabaseService(_ service: SupabaseService) {
        self.supabaseService = service
    }

    func uploadToSupabase() async {
        guard let tableData = currentTableData,
              let supabaseService = supabaseService else {
            return
        }

        isUploadingToSupabase = true
        uploadSuccess = false

        do {
            try await supabaseService.uploadTableData(tableData)
            uploadSuccess = true
            showUploadSuccessAlert = true
        } catch {
            scanState = .error("Upload failed: \(error.localizedDescription)")
        }

        isUploadingToSupabase = false
    }

    // MARK: - Reset
    func reset() {
        scanState = .idle
        currentTableData = nil
        selectedImage = nil
        uploadSuccess = false
    }

    // MARK: - Export
    func exportAsJSON() -> String? {
        guard let tableData = currentTableData else { return nil }

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]

        guard let jsonData = try? encoder.encode(tableData),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            return nil
        }

        return jsonString
    }

    func exportAsCSV() -> String? {
        guard let tableData = currentTableData else { return nil }

        var csv = ""

        for row in 0..<tableData.rows {
            let rowCells = tableData.cellsInRow(row)
            let rowContent = rowCells.map { $0.content.replacingOccurrences(of: ",", with: "\\,") }
            csv += rowContent.joined(separator: ",") + "\n"
        }

        return csv
    }
}
