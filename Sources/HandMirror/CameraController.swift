import AVFoundation

enum CameraError: LocalizedError {
    case noCamera
    case cannotAddInput

    var errorDescription: String? {
        switch self {
        case .noCamera:
            return "사용 가능한 카메라를 찾을 수 없습니다."
        case .cannotAddInput:
            return "카메라 입력을 세션에 연결할 수 없습니다."
        }
    }
}

final class CameraController {
    let session = AVCaptureSession()

    private let sessionQueue = DispatchQueue(label: "dev.codex.HandMirror.camera")
    private var isConfigured = false

    func configureIfNeeded() throws {
        guard !isConfigured else {
            return
        }

        session.beginConfiguration()
        session.sessionPreset = .high

        let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .unspecified)
            ?? AVCaptureDevice.default(for: .video)

        guard let camera else {
            session.commitConfiguration()
            throw CameraError.noCamera
        }

        let input = try AVCaptureDeviceInput(device: camera)
        guard session.canAddInput(input) else {
            session.commitConfiguration()
            throw CameraError.cannotAddInput
        }

        session.addInput(input)
        session.commitConfiguration()
        isConfigured = true
    }

    func start() {
        sessionQueue.async { [session] in
            if !session.isRunning {
                session.startRunning()
            }
        }
    }

    func stop() {
        sessionQueue.async { [session] in
            if session.isRunning {
                session.stopRunning()
            }
        }
    }
}
