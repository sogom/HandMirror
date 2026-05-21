import AppKit

final class MirrorWindowController {
    private let panelSize = NSSize(width: 300, height: 300)

    private let cameraController = CameraController()
    private var panel: NSPanel?
    private var mirrorView: MirrorView?

    var isVisible: Bool {
        panel?.isVisible == true
    }

    func toggle() {
        isVisible ? hide() : show()
    }

    func show() {
        do {
            try cameraController.configureIfNeeded()
        } catch {
            showAlert(title: "카메라를 열 수 없습니다", message: error.localizedDescription)
            return
        }

        let panel = panel ?? makePanel()
        let mirrorView = mirrorView ?? makeMirrorView()

        mirrorView.previewView.attach(session: cameraController.session)
        panel.contentView = mirrorView
        panel.setFrame(makePreferredFrame(for: panel), display: true)
        panel.orderFrontRegardless()

        self.panel = panel
        self.mirrorView = mirrorView
        cameraController.start()
        animateIn(mirrorView)
    }

    func hide() {
        panel?.orderOut(nil)
        cameraController.stop()
    }

    private func makePanel() -> NSPanel {
        let panel = NSPanel(
            contentRect: NSRect(origin: .zero, size: panelSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        panel.backgroundColor = .clear
        panel.isOpaque = false
        panel.hasShadow = false
        panel.isMovableByWindowBackground = true
        panel.hidesOnDeactivate = false
        panel.level = .floating
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .ignoresCycle]
        return panel
    }

    private func makeMirrorView() -> MirrorView {
        MirrorView(frame: NSRect(origin: .zero, size: panelSize))
    }

    private func makePreferredFrame(for panel: NSPanel) -> NSRect {
        let size = panel.frame.size
        let mouseLocation = NSEvent.mouseLocation
        let targetScreen = NSScreen.screens.first { screen in
            screen.frame.contains(mouseLocation)
        } ?? NSScreen.main ?? NSScreen.screens.first

        guard let screen = targetScreen else {
            return NSRect(origin: .zero, size: size)
        }

        return NSRect(
            x: screen.visibleFrame.maxX - size.width - 36,
            y: screen.visibleFrame.minY + 36,
            width: size.width,
            height: size.height
        )
    }

    private func animateIn(_ view: NSView) {
        view.layer?.removeAllAnimations()
        view.wantsLayer = true
        view.layer?.opacity = 0
        view.layer?.transform = CATransform3DMakeScale(0.94, 0.94, 1)

        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.16
            context.timingFunction = CAMediaTimingFunction(name: .easeOut)
            view.animator().layer?.opacity = 1
            view.animator().layer?.transform = CATransform3DIdentity
        }
    }

    private func showAlert(title: String, message: String) {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = message
        alert.alertStyle = .warning
        alert.addButton(withTitle: "확인")
        alert.runModal()
    }
}
