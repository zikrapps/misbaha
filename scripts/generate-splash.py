#!/usr/bin/env python3
"""Generate splash assets and sync native iOS/Android splash colors + images."""

from __future__ import annotations

import json
import re
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

try:
    import arabic_reshaper
    from bidi.algorithm import get_display

    def shape_arabic(text: str) -> str:
        return get_display(arabic_reshaper.reshape(text))
except ImportError:
    def shape_arabic(text: str) -> str:
        return text

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1284, 2778
ICON_PATH = ROOT / "assets" / "splash-icon.png"
MARK_PATH = ROOT / "assets" / "brand" / "zikr-mark-primary.png"
LOGO_PATH = ROOT / "assets" / "splash-logo.png"
OUTPUT_PATH = ROOT / "assets" / "splash.png"
APP_JSON_PATH = ROOT / "app.json"
NAME_EN = "Misbaha"
NAME_AR = "مسبحة"
POWERED_BY = "Powered by Zikr Apps"
ENGLISH_FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/Library/Fonts/Georgia.ttf",
]
ARABIC_FONT_CANDIDATES = [
    "/System/Library/Fonts/SFArabic.ttf",
    "/System/Library/Fonts/Supplemental/Al Nile.ttc",
]
INK = (55, 52, 48)  # #373430
PAPER_TOLERANCE = 32

IOS_BG = ROOT / "ios" / "Misbaha" / "Images.xcassets" / "SplashScreenBackground.colorset" / "Contents.json"
IOS_LEGACY = ROOT / "ios" / "Misbaha" / "Images.xcassets" / "SplashScreenLegacy.imageset"
ANDROID_COLORS = ROOT / "android" / "app" / "src" / "main" / "res" / "values" / "colors.xml"
ANDROID_SPLASH_CANVAS_DP = 288
ANDROID_LOGO_DIRS = {
    "drawable-mdpi": ANDROID_SPLASH_CANVAS_DP,
    "drawable-hdpi": int(ANDROID_SPLASH_CANVAS_DP * 1.5),
    "drawable-xhdpi": ANDROID_SPLASH_CANVAS_DP * 2,
    "drawable-xxhdpi": int(ANDROID_SPLASH_CANVAS_DP * 3),
    "drawable-xxxhdpi": ANDROID_SPLASH_CANVAS_DP * 4,
}
ANDROID_MIPMAP_DIRS = {
    "mipmap-mdpi": 1,
    "mipmap-hdpi": 1.5,
    "mipmap-xhdpi": 2,
    "mipmap-xxhdpi": 3,
    "mipmap-xxxhdpi": 4,
}
ADAPTIVE_ICON_BASELINE_PX = 108
ADAPTIVE_LOGO_FRACTION = 0.58
IOS_APP_ICON = ROOT / "ios" / "Misbaha" / "Images.xcassets" / "AppIcon.appiconset" / "App-Icon-1024x1024@1x.png"
APP_ICON_PATH = ROOT / "assets" / "icon.png"
ADAPTIVE_ICON_PATH = ROOT / "assets" / "adaptive-icon.png"


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def paste_rgba(base: Image.Image, overlay: Image.Image, xy: tuple[int, int]) -> None:
    base.paste(overlay, xy, overlay if overlay.mode == "RGBA" else None)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    center_x: int,
    y: int,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
) -> int:
    text_w, text_h = text_size(draw, text, font)
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text((center_x - text_w // 2, y - bbox[1]), text, font=font, fill=fill)
    return text_h


def paper_color(icon: Image.Image) -> tuple[int, int, int]:
    rgb = icon.convert("RGB")
    width, height = rgb.size
    pixels: list[tuple[int, int, int]] = []
    for x in range(width):
        pixels.append(rgb.getpixel((x, 0)))
        pixels.append(rgb.getpixel((x, height - 1)))
    for y in range(1, height - 1):
        pixels.append(rgb.getpixel((0, y)))
        pixels.append(rgb.getpixel((width - 1, y)))
    return tuple(sorted(channel)[len(pixels) // 2] for channel in zip(*pixels))


def strip_paper_background(icon: Image.Image, paper: tuple[int, int, int], tolerance: int) -> Image.Image:
    stripped = icon.convert("RGBA")
    width, height = stripped.size
    pixels = stripped.load()

    def matches(color: tuple[int, int, int]) -> bool:
        return all(abs(color[index] - paper[index]) <= tolerance for index in range(3))

    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        for y in (0, height - 1):
            if matches(pixels[x, y][:3]):
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if matches(pixels[x, y][:3]):
                queue.append((x, y))

    seen: set[tuple[int, int]] = set()
    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= width or y >= height:
            continue
        if not matches(pixels[x, y][:3]):
            continue
        seen.add((x, y))
        pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return stripped


def hex_color(color: tuple[int, int, int]) -> str:
    return f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"


def srgb_component(value: int) -> str:
    return f"{value / 255:.15f}".rstrip("0").rstrip(".")


def sync_app_json(background: tuple[int, int, int]) -> None:
    config = json.loads(APP_JSON_PATH.read_text(encoding="utf-8"))
    splash = config["expo"]["splash"]
    splash["image"] = "./assets/splash.png"
    splash["resizeMode"] = "contain"
    splash["backgroundColor"] = hex_color(background)
    adaptive = config["expo"]["android"]["adaptiveIcon"]
    adaptive["foregroundImage"] = "./assets/adaptive-icon.png"
    adaptive["backgroundColor"] = hex_color(background)
    for plugin in config["expo"]["plugins"]:
        if isinstance(plugin, list) and plugin[0] == "expo-splash-screen":
            plugin[1]["image"] = "./assets/splash.png"
            plugin[1]["resizeMode"] = "contain"
            plugin[1]["backgroundColor"] = hex_color(background)
            plugin[1]["imageWidth"] = ANDROID_SPLASH_CANVAS_DP
    APP_JSON_PATH.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")


def sync_ios_background(background: tuple[int, int, int]) -> None:
    if not IOS_BG.exists():
        return
    payload = {
        "colors": [
            {
                "color": {
                    "components": {
                        "alpha": "1.000",
                        "blue": srgb_component(background[2]),
                        "green": srgb_component(background[1]),
                        "red": srgb_component(background[0]),
                    },
                    "color-space": "srgb",
                },
                "idiom": "universal",
            }
        ],
        "info": {"version": 1, "author": "expo"},
    }
    IOS_BG.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def sync_ios_splash(splash: Image.Image) -> None:
    if not IOS_LEGACY.exists():
        return
    rgb = splash.convert("RGB")
    for filename in ("image.png", "image@2x.png", "image@3x.png"):
        rgb.save(IOS_LEGACY / filename, format="PNG", optimize=True)


def sync_ios_storyboard_branded(background: tuple[int, int, int]) -> None:
    storyboard = ROOT / "ios" / "Misbaha" / "SplashScreen.storyboard"
    if not storyboard.exists():
        return
    storyboard.write_text(
        f"""<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="24093.7" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="EXPO-VIEWCONTROLLER-1">
    <device id="retina6_12" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="24053.1"/>
        <capability name="Named colors" minToolsVersion="9.0"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <scene sceneID="EXPO-SCENE-1">
            <objects>
                <viewController storyboardIdentifier="SplashScreenViewController" id="EXPO-VIEWCONTROLLER-1" sceneMemberID="viewController">
                    <view key="view" userInteractionEnabled="NO" contentMode="scaleToFill" insetsLayoutMarginsFromSafeArea="NO" id="EXPO-ContainerView" userLabel="ContainerView">
                        <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                        <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
                        <subviews>
                            <imageView id="EXPO-SplashScreen" userLabel="SplashScreenLegacy" image="SplashScreenLegacy" contentMode="scaleAspectFit" clipsSubviews="true" userInteractionEnabled="false" translatesAutoresizingMaskIntoConstraints="false">
                                <rect key="frame" x="0" y="0" width="393" height="852"/>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Rmq-lb-GrQ"/>
                        <constraints>
                            <constraint firstItem="EXPO-SplashScreen" firstAttribute="top" secondItem="EXPO-ContainerView" secondAttribute="top" id="83fcb9b545b870ba44c24f0feeb116490c499c52"/>
                            <constraint firstItem="EXPO-SplashScreen" firstAttribute="leading" secondItem="EXPO-ContainerView" secondAttribute="leading" id="61d16215e44b98e39d0a2c74fdbfaaa22601b12c"/>
                            <constraint firstItem="EXPO-SplashScreen" firstAttribute="trailing" secondItem="EXPO-ContainerView" secondAttribute="trailing" id="f934da460e9ab5acae3ad9987d5b676a108796c1"/>
                            <constraint firstItem="EXPO-SplashScreen" firstAttribute="bottom" secondItem="EXPO-ContainerView" secondAttribute="bottom" id="d6a0be88096b36fb132659aa90203d39139deda9"/>
                        </constraints>
                        <color key="backgroundColor" name="SplashScreenBackground"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="EXPO-PLACEHOLDER-1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="0.0" y="0.0"/>
        </scene>
    </scenes>
    <resources>
        <image name="SplashScreenLegacy" width="1284" height="2778"/>
        <namedColor name="SplashScreenBackground">
            <color alpha="1.000" blue="{srgb_component(background[2])}" green="{srgb_component(background[1])}" red="{srgb_component(background[0])}" customColorSpace="sRGB" colorSpace="custom"/>
        </namedColor>
    </resources>
</document>
""",
        encoding="utf-8",
    )


def sync_ios_storyboard_color(background: tuple[int, int, int]) -> None:
    sync_ios_storyboard_branded(background)


def sync_android_background(background: tuple[int, int, int]) -> None:
    if not ANDROID_COLORS.exists():
        return
    text = ANDROID_COLORS.read_text(encoding="utf-8")
    text = re.sub(
        r'(<color name="splashscreen_background">)(#[0-9a-fA-F]{6})(</color>)',
        rf"\1{hex_color(background)}\3",
        text,
    )
    text = re.sub(
        r'(<color name="iconBackground">)(#[0-9a-fA-F]{6})(</color>)',
        rf"\1{hex_color(background)}\3",
        text,
    )
    text = re.sub(
        r'(<color name="colorPrimaryDark">)(#[0-9a-fA-F]{6})(</color>)',
        rf"\1{hex_color(background)}\3",
        text,
    )
    ANDROID_COLORS.write_text(text, encoding="utf-8")


def compose_android_splash_drawable(
    splash: Image.Image,
    background: tuple[int, int, int],
    canvas_size: int,
) -> Image.Image:
    canvas = Image.new("RGB", (canvas_size, canvas_size), background)
    splash_w, splash_h = splash.size
    scale = min(canvas_size / splash_w, canvas_size / splash_h)
    new_w = max(1, int(splash_w * scale))
    new_h = max(1, int(splash_h * scale))
    resized = splash.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((canvas_size - new_w) // 2, (canvas_size - new_h) // 2))
    return canvas


def sync_android_splash(splash: Image.Image, background: tuple[int, int, int]) -> None:
    for folder, canvas_size in ANDROID_LOGO_DIRS.items():
        target_dir = ROOT / "android" / "app" / "src" / "main" / "res" / folder
        if not target_dir.exists():
            continue
        drawable = compose_android_splash_drawable(splash, background, canvas_size)
        drawable.save(target_dir / "splashscreen_logo.png", format="PNG", optimize=True)


def sync_android_splash_styles() -> None:
    styles_path = ROOT / "android" / "app" / "src" / "main" / "res" / "values" / "styles.xml"
    if not styles_path.exists():
        return
    text = styles_path.read_text(encoding="utf-8")
    if "windowSplashScreenAnimatedIcon" not in text:
        text = text.replace(
            '    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>\n'
            '    <item name="postSplashScreenTheme">@style/AppTheme</item>',
            '    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>\n'
            '    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>\n'
            '    <item name="postSplashScreenTheme">@style/AppTheme</item>\n'
            '    <item name="android:windowSplashScreenBehavior">icon_preferred</item>',
        )
        styles_path.write_text(text, encoding="utf-8")


def sync_android_resize_mode() -> None:
    strings = ROOT / "android" / "app" / "src" / "main" / "res" / "values" / "strings.xml"
    if not strings.exists():
        return
    text = strings.read_text(encoding="utf-8")
    text = re.sub(
        r'(<string name="expo_splash_screen_resize_mode" translatable="false">)[^<]+(</string>)',
        r"\1contain\2",
        text,
    )
    strings.write_text(text, encoding="utf-8")


def compose_adaptive_foreground(logo: Image.Image, size: int = 1024) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    logo_size = int(size * ADAPTIVE_LOGO_FRACTION)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    offset = (size - logo_size) // 2
    paste_rgba(canvas, logo_resized, (offset, offset))
    return canvas


def sync_app_icons(background: tuple[int, int, int], logo: Image.Image) -> None:
    size = 1024
    canvas = Image.new("RGB", (size, size), background)
    logo_size = int(size * 0.82)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    offset = (size - logo_size) // 2
    paste_rgba(canvas, logo_resized, (offset, offset))
    canvas.save(APP_ICON_PATH, format="PNG", optimize=True)

    adaptive = compose_adaptive_foreground(logo, size)
    adaptive.save(ADAPTIVE_ICON_PATH, format="PNG", optimize=True)

    if IOS_APP_ICON.parent.exists():
        canvas.save(IOS_APP_ICON, format="PNG", optimize=True)


def sync_android_adaptive_icons(background: tuple[int, int, int], foreground: Image.Image) -> None:
    for folder, scale in ANDROID_MIPMAP_DIRS.items():
        target_dir = ROOT / "android" / "app" / "src" / "main" / "res" / folder
        if not target_dir.exists():
            continue
        icon_size = max(1, int(ADAPTIVE_ICON_BASELINE_PX * scale))
        icon_fg = foreground.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        composed = Image.new("RGB", (icon_size, icon_size), background)
        paste_rgba(composed, icon_fg, (0, 0))
        icon_fg.save(target_dir / "ic_launcher_foreground.webp", format="WEBP", quality=100, method=6)
        composed.save(target_dir / "ic_launcher.webp", format="WEBP", quality=100, method=6)
        composed.save(target_dir / "ic_launcher_round.webp", format="WEBP", quality=100, method=6)


def fit_font_to_width(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_candidates: list[str],
    target_width: int,
    *,
    max_size: int = 360,
    min_size: int = 48,
) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for size in range(max_size, min_size - 1, -2):
        font = load_font(font_candidates, size)
        text_w, _ = text_size(draw, text, font)
        if text_w <= target_width:
            return font
    return load_font(font_candidates, min_size)


def compose_splash(background: tuple[int, int, int], logo: Image.Image, mark: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), background)
    draw = ImageDraw.Draw(canvas)
    center_x = WIDTH // 2

    logo_width = int(WIDTH * 0.48)
    logo_height = int(logo.height * (logo_width / logo.width))
    logo_large = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    logo_x = center_x - logo_width // 2
    logo_y = int(HEIGHT * 0.22)
    paste_rgba(canvas, logo_large, (logo_x, logo_y))

    name_target_width = int(WIDTH * 0.82)
    name_en_font = fit_font_to_width(draw, NAME_EN, ENGLISH_FONT_CANDIDATES, name_target_width)
    name_ar_font = fit_font_to_width(
        draw,
        shape_arabic(NAME_AR),
        ARABIC_FONT_CANDIDATES,
        name_target_width,
    )
    powered_font = fit_font_to_width(draw, POWERED_BY, ENGLISH_FONT_CANDIDATES, int(WIDTH * 0.88))

    names_y = logo_y + logo_height + 72
    names_y += draw_centered_text(draw, NAME_EN, center_x, names_y, name_en_font, INK) + 16
    draw_centered_text(draw, shape_arabic(NAME_AR), center_x, names_y, name_ar_font, INK)

    mark_width = int(WIDTH * 0.14)
    mark_height = int(mark.height * (mark_width / mark.width))
    mark_resized = mark.resize((mark_width, mark_height), Image.Resampling.LANCZOS)
    _, powered_h = text_size(draw, POWERED_BY, powered_font)

    footer_gap = 28
    footer_block_h = mark_height + footer_gap + powered_h
    footer_y = HEIGHT - 140 - footer_block_h

    mark_x = center_x - mark_width // 2
    paste_rgba(canvas, mark_resized, (mark_x, footer_y))
    draw_centered_text(
        draw,
        POWERED_BY,
        center_x,
        footer_y + mark_height + footer_gap,
        powered_font,
        INK,
    )

    return canvas


def main() -> None:
    icon = Image.open(ICON_PATH).convert("RGBA")
    mark = Image.open(MARK_PATH).convert("RGBA")
    background = paper_color(icon)
    logo = strip_paper_background(icon, background, PAPER_TOLERANCE)

    LOGO_PATH.parent.mkdir(parents=True, exist_ok=True)
    logo.save(LOGO_PATH, format="PNG", optimize=True)

    canvas = compose_splash(background, logo, mark)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT_PATH, format="PNG", optimize=True)

    sync_app_json(background)
    sync_ios_background(background)
    sync_ios_splash(canvas)
    sync_ios_storyboard_branded(background)
    sync_android_background(background)
    sync_android_splash(canvas, background)
    sync_android_splash_styles()
    sync_android_resize_mode()
    adaptive_foreground = compose_adaptive_foreground(logo)
    sync_app_icons(background, logo)
    sync_android_adaptive_icons(background, adaptive_foreground)

    print(f"Wrote {LOGO_PATH} (transparent logo)")
    print(f"Wrote {APP_ICON_PATH} (logo icon)")
    print(f"Wrote {ADAPTIVE_ICON_PATH} (adaptive foreground)")
    print(f"Wrote {OUTPUT_PATH} ({WIDTH}x{HEIGHT})")
    print(f"Synced native splash background={hex_color(background)}")


if __name__ == "__main__":
    main()
