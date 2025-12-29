import SwiftUI

struct MainView: View {
    @State private var viewModel = ScannerViewModel()
    @Environment(SupabaseService.self) private var supabaseService

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.scanState {
                case .idle, .selecting:
                    ScannerView(viewModel: viewModel)
                case .processing:
                    ProcessingView()
                case .completed(let result):
                    TableEditorView(
                        viewModel: viewModel,
                        result: result
                    )
                case .error(let message):
                    ErrorView(message: message) {
                        viewModel.reset()
                    }
                }
            }
            .navigationTitle("Handwriting Scanner")
            .navigationBarTitleDisplayMode(.large)
        }
        .onAppear {
            viewModel.setSupabaseService(supabaseService)
        }
    }
}

#Preview {
    MainView()
        .environment(SupabaseService())
}
