import Foundation
import Supabase

/// Service for interacting with Supabase backend
@Observable
class SupabaseService {
    private var client: SupabaseClient?
    var isConnected = false
    var isMockMode = true // Set to true to use mock implementation

    init() {
        if isMockMode {
            setupMockClient()
        }
    }

    /// Configure Supabase client with real credentials
    func configure(url: String, anonKey: String) {
        guard !isMockMode else { return }

        client = SupabaseClient(
            supabaseURL: URL(string: url)!,
            supabaseKey: anonKey
        )
        isConnected = true
    }

    /// Setup mock client for development
    private func setupMockClient() {
        print("📦 Supabase: Running in mock mode")
        isConnected = true
    }

    /// Upload table data to Supabase
    func uploadTableData(_ tableData: TableData) async throws {
        if isMockMode {
            try await mockUploadTableData(tableData)
        } else {
            try await realUploadTableData(tableData)
        }
    }

    /// Mock implementation of upload
    private func mockUploadTableData(_ tableData: TableData) async throws {
        print("📤 Mock Upload: Starting upload for table \(tableData.id)")

        // Simulate network delay
        try await Task.sleep(nanoseconds: 1_500_000_000) // 1.5 seconds

        print("📤 Mock Upload: Successfully uploaded table data")
        print("   - ID: \(tableData.id)")
        print("   - Rows: \(tableData.rows)")
        print("   - Columns: \(tableData.columns)")
        print("   - Total cells: \(tableData.cells.count)")

        // Simulate successful upload
        // In a real implementation, this would insert data into Supabase tables
    }

    /// Real implementation of upload
    private func realUploadTableData(_ tableData: TableData) async throws {
        guard let client = client else {
            throw SupabaseError.notConfigured
        }

        // Upload to Supabase
        // Note: You'll need to create these tables in your Supabase project:
        // - table_data (id, rows, columns, created_at, image_name)
        // - table_cells (id, table_id, row, column, content, confidence)

        // TableData is already Codable, so we can insert it directly
        try await client
            .database
            .from("table_data")
            .insert(tableData)
            .execute()

        print("✅ Successfully uploaded table data to Supabase")
    }

    /// Fetch all table data from Supabase
    func fetchAllTableData() async throws -> [TableData] {
        if isMockMode {
            return try await mockFetchAllTableData()
        } else {
            return try await realFetchAllTableData()
        }
    }

    /// Mock implementation of fetch
    private func mockFetchAllTableData() async throws -> [TableData] {
        print("📥 Mock Fetch: Fetching table data")

        // Simulate network delay
        try await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds

        // Return empty array for mock
        return []
    }

    /// Real implementation of fetch
    private func realFetchAllTableData() async throws -> [TableData] {
        guard let client = client else {
            throw SupabaseError.notConfigured
        }

        let response: [TableData] = try await client
            .database
            .from("table_data")
            .select()
            .execute()
            .value

        return response
    }

    /// Delete table data from Supabase
    func deleteTableData(_ tableData: TableData) async throws {
        if isMockMode {
            try await mockDeleteTableData(tableData)
        } else {
            try await realDeleteTableData(tableData)
        }
    }

    /// Mock implementation of delete
    private func mockDeleteTableData(_ tableData: TableData) async throws {
        print("🗑️ Mock Delete: Deleted table \(tableData.id)")
        try await Task.sleep(nanoseconds: 500_000_000)
    }

    /// Real implementation of delete
    private func realDeleteTableData(_ tableData: TableData) async throws {
        guard let client = client else {
            throw SupabaseError.notConfigured
        }

        try await client
            .database
            .from("table_data")
            .delete()
            .eq("id", value: tableData.id.uuidString)
            .execute()

        print("✅ Deleted table data from Supabase")
    }
}

enum SupabaseError: LocalizedError {
    case notConfigured
    case uploadFailed
    case fetchFailed
    case deleteFailed

    var errorDescription: String? {
        switch self {
        case .notConfigured:
            return "Supabase client is not configured. Please provide credentials."
        case .uploadFailed:
            return "Failed to upload data to Supabase."
        case .fetchFailed:
            return "Failed to fetch data from Supabase."
        case .deleteFailed:
            return "Failed to delete data from Supabase."
        }
    }
}
