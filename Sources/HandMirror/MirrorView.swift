import AppKit

final class MirrorView: NSView {
    let previewView = CameraPreviewView()

    private let rimView = NSView()
    private let shineLayer = CAShapeLayer()

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        configure()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configure()
    }

    override func layout() {
        super.layout()

        let diameter = min(bounds.width - 28, bounds.height - 28, 260)
        let rimFrame = NSRect(
            x: (bounds.width - diameter) / 2,
            y: (bounds.height - diameter) / 2,
            width: diameter,
            height: diameter
        )

        rimView.frame = rimFrame
        rimView.layer?.cornerRadius = diameter / 2

        let previewInset: CGFloat = 14
        previewView.frame = rimFrame.insetBy(dx: previewInset, dy: previewInset)
        previewView.previewLayer.cornerRadius = previewView.bounds.width / 2

        shineLayer.frame = bounds
        shineLayer.path = makeShinePath(in: rimFrame)
    }

    private func configure() {
        wantsLayer = true
        layer?.backgroundColor = NSColor.clear.cgColor

        configureRim()

        addSubview(rimView)
        addSubview(previewView)

        shineLayer.fillColor = NSColor.clear.cgColor
        shineLayer.strokeColor = NSColor.white.withAlphaComponent(0.38).cgColor
        shineLayer.lineWidth = 4
        shineLayer.lineCap = .round
        layer?.addSublayer(shineLayer)
    }

    private func configureRim() {
        rimView.wantsLayer = true
        rimView.layer?.backgroundColor = NSColor(calibratedRed: 0.84, green: 0.81, blue: 0.75, alpha: 1).cgColor
        rimView.layer?.borderColor = NSColor(calibratedRed: 0.97, green: 0.95, blue: 0.9, alpha: 1).cgColor
        rimView.layer?.borderWidth = 2
        rimView.layer?.shadowColor = NSColor.black.cgColor
        rimView.layer?.shadowOpacity = 0.24
        rimView.layer?.shadowRadius = 20
        rimView.layer?.shadowOffset = CGSize(width: 0, height: -8)
    }

    private func makeShinePath(in rimFrame: NSRect) -> CGPath {
        let path = CGMutablePath()
        path.move(to: CGPoint(x: rimFrame.minX + 64, y: rimFrame.maxY - 56))
        path.addCurve(
            to: CGPoint(x: rimFrame.midX - 8, y: rimFrame.maxY - 34),
            control1: CGPoint(x: rimFrame.minX + 86, y: rimFrame.maxY - 34),
            control2: CGPoint(x: rimFrame.midX - 34, y: rimFrame.maxY - 30)
        )
        return path
    }
}
