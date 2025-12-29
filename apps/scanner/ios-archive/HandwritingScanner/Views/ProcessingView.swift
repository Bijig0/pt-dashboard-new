import SwiftUI

struct ProcessingView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .stroke(lineWidth: 4)
                    .foregroundStyle(.blue.opacity(0.2))
                    .frame(width: 100, height: 100)

                Circle()
                    .trim(from: 0, to: 0.7)
                    .stroke(lineWidth: 4)
                    .foregroundStyle(.blue.gradient)
                    .frame(width: 100, height: 100)
                    .rotationEffect(.degrees(isAnimating ? 360 : 0))
                    .animation(.linear(duration: 1).repeatForever(autoreverses: false), value: isAnimating)

                Image(systemName: "doc.text.magnifyingglass")
                    .font(.system(size: 40))
                    .foregroundStyle(.blue)
            }

            VStack(spacing: 8) {
                Text("Processing Image")
                    .font(.title2.bold())

                Text("Extracting text from your handwritten document...")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            // Processing steps
            VStack(alignment: .leading, spacing: 12) {
                ProcessingStep(
                    icon: "camera.viewfinder",
                    title: "Analyzing image",
                    isActive: true
                )
                ProcessingStep(
                    icon: "textformat.abc",
                    title: "Recognizing text",
                    isActive: true
                )
                ProcessingStep(
                    icon: "tablecells",
                    title: "Structuring table data",
                    isActive: true
                )
            }
            .padding()
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .padding()
        .onAppear {
            isAnimating = true
        }
    }
}

struct ProcessingStep: View {
    let icon: String
    let title: String
    let isActive: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(isActive ? .blue : .secondary)
                .frame(width: 24)

            Text(title)
                .font(.subheadline)
                .foregroundStyle(isActive ? .primary : .secondary)

            Spacer()

            if isActive {
                ProgressView()
                    .scaleEffect(0.8)
            }
        }
    }
}

#Preview {
    ProcessingView()
}
