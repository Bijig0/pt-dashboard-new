import SwiftUI

struct TableEditorView: View {
    @Bindable var viewModel: ScannerViewModel
    let result: OCRResult

    @State private var showExportMenu = false
    @State private var showImagePreview = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Stats Card
                StatsCard(result: result)

                // Original Image Preview
                if let image = viewModel.selectedImage {
                    ImagePreviewCard(image: image, showFullImage: $showImagePreview)
                }

                // Table Editor
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Extracted Table")
                            .font(.headline)

                        Spacer()

                        Menu {
                            Button {
                                viewModel.addRow()
                            } label: {
                                Label("Add Row", systemImage: "plus.rectangle")
                            }

                            Button {
                                viewModel.addColumn()
                            } label: {
                                Label("Add Column", systemImage: "plus.rectangle.portrait")
                            }
                        } label: {
                            Image(systemName: "plus.circle.fill")
                                .font(.title3)
                                .foregroundStyle(.blue)
                        }
                    }

                    if let tableData = viewModel.currentTableData {
                        EditableTableView(
                            tableData: tableData,
                            onCellUpdate: { cell, newContent in
                                viewModel.updateCell(cell, newContent: newContent)
                            },
                            onDeleteRow: { row in
                                viewModel.deleteRow(row)
                            },
                            onDeleteColumn: { column in
                                viewModel.deleteColumn(column)
                            }
                        )
                    }
                }
                .padding()
                .background(.regularMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16))

                // Action Buttons
                VStack(spacing: 12) {
                    Button {
                        Task {
                            await viewModel.uploadToSupabase()
                        }
                    } label: {
                        HStack {
                            if viewModel.isUploadingToSupabase {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Image(systemName: "cloud.fill")
                            }
                            Text(viewModel.isUploadingToSupabase ? "Uploading..." : "Upload to Supabase")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.blue.gradient)
                        .foregroundStyle(.white)
                        .fontWeight(.semibold)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .disabled(viewModel.isUploadingToSupabase)

                    Button {
                        showExportMenu = true
                    } label: {
                        Label("Export Data", systemImage: "square.and.arrow.up")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(.green.gradient)
                            .foregroundStyle(.white)
                            .fontWeight(.semibold)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }

                    Button {
                        viewModel.reset()
                    } label: {
                        Label("Scan New Image", systemImage: "arrow.counterclockwise")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(.secondary.opacity(0.2))
                            .foregroundStyle(.primary)
                            .fontWeight(.semibold)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }
            }
            .padding()
        }
        .confirmationDialog("Export Data", isPresented: $showExportMenu) {
            Button("Export as JSON") {
                exportData(format: .json)
            }
            Button("Export as CSV") {
                exportData(format: .csv)
            }
            Button("Cancel", role: .cancel) {}
        }
        .sheet(isPresented: $showImagePreview) {
            if let image = viewModel.selectedImage {
                ImagePreviewSheet(image: image)
            }
        }
        .alert("Upload Successful", isPresented: $viewModel.showUploadSuccessAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Your table data has been successfully uploaded to Supabase.")
        }
    }

    private func exportData(format: ExportFormat) {
        let content: String?

        switch format {
        case .json:
            content = viewModel.exportAsJSON()
        case .csv:
            content = viewModel.exportAsCSV()
        }

        guard let content = content else { return }

        // Share the content
        let activityController = UIActivityViewController(
            activityItems: [content],
            applicationActivities: nil
        )

        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first,
           let rootViewController = window.rootViewController {
            rootViewController.present(activityController, animated: true)
        }
    }

    enum ExportFormat {
        case json, csv
    }
}

// MARK: - Supporting Views

struct StatsCard: View {
    let result: OCRResult

    var body: some View {
        VStack(spacing: 12) {
            HStack {
                StatItem(
                    icon: "tablecells",
                    title: "Rows",
                    value: "\(result.tableData.rows)"
                )

                Divider()

                StatItem(
                    icon: "tablecells.fill",
                    title: "Columns",
                    value: "\(result.tableData.columns)"
                )

                Divider()

                StatItem(
                    icon: "gauge.with.dots.needle.67percent",
                    title: "Confidence",
                    value: "\(Int(result.confidence * 100))%"
                )
            }
            .frame(height: 60)
        }
        .padding()
        .background(.blue.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct StatItem: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(.blue)

            Text(value)
                .font(.title3.bold())

            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct ImagePreviewCard: View {
    let image: UIImage
    @Binding var showFullImage: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Original Image")
                .font(.headline)

            Image(uiImage: image)
                .resizable()
                .scaledToFit()
                .frame(maxHeight: 200)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .onTapGesture {
                    showFullImage = true
                }

            Text("Tap to view full size")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct ImagePreviewSheet: View {
    let image: UIImage
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView([.horizontal, .vertical]) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            }
            .navigationTitle("Original Image")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    let sampleTableData = TableData(
        cells: [
            TableCell(row: 0, column: 0, content: "Name", confidence: 0.95),
            TableCell(row: 0, column: 1, content: "Age", confidence: 0.92),
            TableCell(row: 1, column: 0, content: "John", confidence: 0.88),
            TableCell(row: 1, column: 1, content: "25", confidence: 0.90)
        ],
        rows: 2,
        columns: 2
    )

    let sampleImage = UIImage(systemName: "photo")!

    let sampleResult = OCRResult(
        originalImage: sampleImage,
        recognizedText: "Name Age\nJohn 25",
        tableData: sampleTableData,
        confidence: 0.91,
        processingTime: 1.5
    )

    let viewModel = ScannerViewModel()
    viewModel.currentTableData = sampleTableData
    viewModel.selectedImage = sampleImage

    return NavigationStack {
        TableEditorView(viewModel: viewModel, result: sampleResult)
    }
}
