import SwiftUI

struct ErrorView: View {
    let message: String
    let onRetry: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 80))
                .foregroundStyle(.red.gradient)

            VStack(spacing: 8) {
                Text("Something Went Wrong")
                    .font(.title2.bold())

                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            Button {
                onRetry()
            } label: {
                Label("Try Again", systemImage: "arrow.counterclockwise")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(.blue.gradient)
                    .foregroundStyle(.white)
                    .fontWeight(.semibold)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .padding(.horizontal, 48)
        }
        .padding()
    }
}

#Preview {
    ErrorView(message: "Failed to process the image. Please try again.") {
        print("Retry tapped")
    }
}
