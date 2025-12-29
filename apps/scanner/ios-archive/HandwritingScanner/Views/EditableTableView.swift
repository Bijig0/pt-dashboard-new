import SwiftUI

struct EditableTableView: View {
    let tableData: TableData
    let onCellUpdate: (TableCell, String) -> Void
    let onDeleteRow: (Int) -> Void
    let onDeleteColumn: (Int) -> Void

    @State private var editingCell: UUID?

    var body: some View {
        ScrollView([.horizontal, .vertical]) {
            VStack(spacing: 0) {
                // Render table rows
                ForEach(0..<tableData.rows, id: \.self) { row in
                    HStack(spacing: 0) {
                        // Row actions
                        Button {
                            onDeleteRow(row)
                        } label: {
                            Image(systemName: "trash.circle.fill")
                                .foregroundStyle(.red)
                                .font(.title3)
                        }
                        .padding(.horizontal, 8)
                        .opacity(tableData.rows > 1 ? 1 : 0)
                        .disabled(tableData.rows <= 1)

                        // Cells in row
                        ForEach(0..<tableData.columns, id: \.self) { column in
                            if let cell = tableData.cell(at: row, column: column) {
                                EditableCellView(
                                    cell: cell,
                                    isEditing: editingCell == cell.id,
                                    onEdit: {
                                        editingCell = cell.id
                                    },
                                    onUpdate: { newContent in
                                        onCellUpdate(cell, newContent)
                                        editingCell = nil
                                    }
                                )
                            } else {
                                // Empty cell if data is missing
                                EmptyCellView()
                            }
                        }
                    }

                    if row == 0 {
                        // Column delete buttons
                        HStack(spacing: 0) {
                            Spacer()
                                .frame(width: 44) // Space for row delete button

                            ForEach(0..<tableData.columns, id: \.self) { column in
                                Button {
                                    onDeleteColumn(column)
                                } label: {
                                    Image(systemName: "trash.circle.fill")
                                        .foregroundStyle(.red)
                                        .font(.caption)
                                }
                                .frame(width: 120, height: 24)
                                .opacity(tableData.columns > 1 ? 1 : 0)
                                .disabled(tableData.columns <= 1)
                            }
                        }
                    }
                }
            }
            .padding()
        }
        .frame(maxHeight: 400)
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(.separator), lineWidth: 1)
        )
    }
}

struct EditableCellView: View {
    let cell: TableCell
    let isEditing: Bool
    let onEdit: () -> Void
    let onUpdate: (String) -> Void

    @State private var editText: String = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        ZStack {
            if isEditing {
                TextField("Enter text", text: $editText)
                    .textFieldStyle(.plain)
                    .padding(8)
                    .focused($isFocused)
                    .onSubmit {
                        onUpdate(editText)
                    }
                    .onAppear {
                        editText = cell.content
                        isFocused = true
                    }
            } else {
                Text(cell.content.isEmpty ? "Empty" : cell.content)
                    .font(.system(.body, design: .monospaced))
                    .foregroundStyle(cell.content.isEmpty ? .secondary : .primary)
                    .padding(8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        onEdit()
                    }
            }
        }
        .frame(width: 120, height: 44)
        .background(confidenceColor)
        .overlay(
            Rectangle()
                .stroke(Color(.separator), lineWidth: 1)
        )
    }

    private var confidenceColor: Color {
        if cell.confidence > 0.9 {
            return Color.green.opacity(0.1)
        } else if cell.confidence > 0.7 {
            return Color.yellow.opacity(0.1)
        } else {
            return Color.red.opacity(0.1)
        }
    }
}

struct EmptyCellView: View {
    var body: some View {
        Text("—")
            .foregroundStyle(.secondary)
            .frame(width: 120, height: 44)
            .background(Color(.systemGray6))
            .overlay(
                Rectangle()
                    .stroke(Color(.separator), lineWidth: 1)
            )
    }
}

#Preview {
    let sampleTableData = TableData(
        cells: [
            TableCell(row: 0, column: 0, content: "Name", confidence: 0.95),
            TableCell(row: 0, column: 1, content: "Age", confidence: 0.92),
            TableCell(row: 0, column: 2, content: "City", confidence: 0.88),
            TableCell(row: 1, column: 0, content: "John", confidence: 0.88),
            TableCell(row: 1, column: 1, content: "25", confidence: 0.90),
            TableCell(row: 1, column: 2, content: "NYC", confidence: 0.85),
            TableCell(row: 2, column: 0, content: "Jane", confidence: 0.92),
            TableCell(row: 2, column: 1, content: "30", confidence: 0.87),
            TableCell(row: 2, column: 2, content: "LA", confidence: 0.78)
        ],
        rows: 3,
        columns: 3
    )

    return EditableTableView(
        tableData: sampleTableData,
        onCellUpdate: { _, _ in },
        onDeleteRow: { _ in },
        onDeleteColumn: { _ in }
    )
    .padding()
}
