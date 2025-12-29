import SwiftUI

@main
struct HandwritingScannerApp: App {
    @State private var supabaseService = SupabaseService()

    var body: some Scene {
        WindowGroup {
            MainView()
                .environment(supabaseService)
        }
    }
}
