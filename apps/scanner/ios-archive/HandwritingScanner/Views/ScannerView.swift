import SwiftUI
import PhotosUI

struct ScannerView: View {
    @Bindable var viewModel: ScannerViewModel
    @State private var selectedPhotoItem: PhotosPickerItem?

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // App Icon/Logo
            Image(systemName: "doc.text.viewfinder")
                .font(.system(size: 100))
                .foregroundStyle(.blue.gradient)
                .symbolEffect(.pulse)

            VStack(spacing: 12) {
                Text("Handwriting Scanner")
                    .font(.title.bold())

                Text("Scan handwritten tables and convert them to editable text")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            Spacer()

            // Action Buttons
            VStack(spacing: 16) {
                PhotosPicker(
                    selection: $selectedPhotoItem,
                    matching: .images
                ) {
                    Label("Select from Library", systemImage: "photo.on.rectangle")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.blue.gradient)
                        .foregroundStyle(.white)
                        .fontWeight(.semibold)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .onChange(of: selectedPhotoItem) { _, newItem in
                    Task {
                        if let data = try? await newItem?.loadTransferable(type: Data.self),
                           let image = UIImage(data: data) {
                            await viewModel.processImage(image)
                        }
                    }
                }

                Button {
                    viewModel.selectImageFromCamera()
                } label: {
                    Label("Take Photo", systemImage: "camera")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.green.gradient)
                        .foregroundStyle(.white)
                        .fontWeight(.semibold)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
        }
        .sheet(isPresented: $viewModel.isShowingCamera) {
            ImagePicker(
                sourceType: .camera,
                selectedImage: $viewModel.selectedImage
            )
            .onDisappear {
                if let image = viewModel.selectedImage {
                    Task {
                        await viewModel.processImage(image)
                    }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        ScannerView(viewModel: ScannerViewModel())
    }
}
