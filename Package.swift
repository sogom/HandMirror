// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "HandMirror",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "HandMirror", targets: ["HandMirror"])
    ],
    targets: [
        .executableTarget(
            name: "HandMirror",
            linkerSettings: [
                .linkedFramework("AppKit"),
                .linkedFramework("AVFoundation"),
                .linkedFramework("Carbon"),
                .linkedFramework("QuartzCore")
            ]
        )
    ]
)
