import AppKit
import AVFoundation

final class CameraPreviewView: NSView {
    var previewLayer: AVCaptureVideoPreviewLayer {
        layer as! AVCaptureVideoPreviewLayer
    }

    override func makeBackingLayer() -> CALayer {
        AVCaptureVideoPreviewLayer()
    }

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        configure()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configure()
    }

    func attach(session: AVCaptureSession) {
        previewLayer.session = session
    }

    private func configure() {
        wantsLayer = true
        previewLayer.videoGravity = .resizeAspectFill
        previewLayer.cornerCurve = .continuous
        previewLayer.masksToBounds = true
    }
}
