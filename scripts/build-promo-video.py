#!/usr/bin/env python3
"""Build the Misbaha promo video with narration, captions, and feature zooms."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import textwrap
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "marketing" / "screenshots"
WORK = ROOT / "marketing" / "video-build"
OUT = ROOT / "marketing" / "misbaha-promo-75s.mp4"

NARRATORS = {
    "M1": ("Reed", 165),
    "M2": ("Fred", 162),
    "M3": ("Rocko", 168),
    "A": ("Samantha", 165),
    "B": ("Daniel", 160),
    "C": ("Karen", 168),
}

FONT_PATH = "/System/Library/Fonts/Supplemental/Georgia.ttf"
VIEW_W, VIEW_H = 1080, 2340
FPS = 30
XFADE = 0.35
TARGET_SECONDS = 75.0


@dataclass
class Focus:
    """Normalized focus point (cx, cy) and end zoom level for Ken Burns effect."""

    cx: float
    cy: float
    end_zoom: float = 1.55
    start_zoom: float = 1.0


@dataclass
class Segment:
    key: str
    narration: str
    caption: str
    image: Path | None = None
    focus: Focus | None = None


# Focus coordinates target the fitted 1080×2340 phone frame.
SEGMENTS: list[Segment] = [
    Segment(
        "intro",
        "For many Muslims, faith includes a quiet daily rhythm — repeating short prayers that remember God, "
        "often counted on prayer beads. Misbaha helps them stay consistent: counting each phrase, following plans, "
        "and tracking progress.",
        "A calm companion for daily remembrance",
    ),
    Segment(
        "today",
        "Today shows daily counts, lifetime totals, active goals, and hourly activity.",
        "Your spiritual dashboard at a glance",
        image=SHOTS / "01-today.png",
        focus=Focus(0.50, 0.17, end_zoom=1.50),
    ),
    Segment(
        "library",
        "The Counter organizes prayers by category — scripture, morning and evening, worship, and hardship.",
        "Browse prayers by category",
        image=SHOTS / "02-tasbeeh.png",
        focus=Focus(0.50, 0.52, end_zoom=1.45),
    ),
    Segment(
        "search",
        "Search by English spelling or Arabic script — on the Counter screen or inside Goals.",
        "Find any prayer instantly",
        image=SHOTS / "02-tasbeeh.png",
        focus=Focus(0.50, 0.24, end_zoom=1.85),
    ),
    Segment(
        "search-goals",
        "The same search works when planning goals — pick prayers and drop them into your plan.",
        "Search while building a goal",
        image=SHOTS / "04-goals.png",
        focus=Focus(0.50, 0.21, end_zoom=1.80),
    ),
    Segment(
        "detail",
        "Open any prayer for text, translation, and references. Double-tap to count, hold to complete.",
        "Count toward your daily target",
        image=SHOTS / "03-dua-detail.png",
        focus=Focus(0.50, 0.55, end_zoom=1.40),
    ),
    Segment(
        "goals",
        "Goals turn remembrance into plans — suggested paths, surprise challenges, or custom rotations.",
        "Gentle plans for steady progress",
        image=SHOTS / "04-goals.png",
        focus=Focus(0.50, 0.48, end_zoom=1.42),
    ),
    Segment(
        "goal-detail",
        "Each goal focuses one prayer per day with progress tracking and a quick counter.",
        "One focused prayer each day",
        image=SHOTS / "05-goal-detail.png",
        focus=Focus(0.50, 0.38, end_zoom=1.48),
    ),
    Segment(
        "goal-create",
        "Plan a new goal by choosing prayers and duration.",
        "Build your own spiritual roadmap",
        image=SHOTS / "06-goal-create.png",
        focus=Focus(0.50, 0.45, end_zoom=1.45),
    ),
    Segment(
        "visualize",
        "Visualize three ways — a growing garden, a walk across the earth, or a rise into the stars.",
        "Three visual journeys through your progress",
        image=SHOTS / "07-visualize-garden.png",
        focus=Focus(0.50, 0.14, end_zoom=1.55),
    ),
    Segment(
        "badges",
        "Earn badges as you count — finish prayer cycles, keep streaks, complete goals, and try new prayers. "
        "Each milestone unlocks the next set of ten.",
        "Badges reward consistency and exploration",
        image=SHOTS / "09-badges.png",
        focus=Focus(0.50, 0.78, end_zoom=1.65),
    ),
    Segment(
        "settings",
        "Tune counts per tap, themes, language, sound, and haptics.",
        "Personalize the counting experience",
        image=SHOTS / "08-settings.png",
        focus=Focus(0.50, 0.30, end_zoom=1.50),
    ),
    Segment(
        "outro",
        "Misbaha — counting, goals, and visual journeys. From Zikr Apps.",
        "Misbaha by Zikr Apps",
    ),
]


def run(cmd: list[str], **kwargs) -> None:
    subprocess.run(cmd, check=True, **kwargs)


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


def say_segment(key: str, text: str, voice: str, rate: int) -> Path:
    aiff = WORK / f"{key}.aiff"
    wav = WORK / f"{key}.wav"
    run(["say", "-v", voice, "-r", str(rate), "-o", str(aiff), text])
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(aiff), "-ar", "44100", "-ac", "1", str(wav)])
    return wav


def make_intro_card() -> Path:
    out = WORK / "00-intro-card.png"
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "lavfi",
            "-i",
            "color=c=0xf8e6bd:s=1080x2340:d=1",
            "-i",
            str(ROOT / "assets" / "splash.png"),
            "-filter_complex",
            "[1]scale=720:-1[logo];[0][logo]overlay=(W-w)/2:(H-h)/2",
            "-frames:v",
            "1",
            str(out),
        ]
    )
    return out


def fit_phone(img: Image.Image) -> Image.Image:
    bg = Image.new("RGB", (VIEW_W, VIEW_H), (248, 230, 189))
    scale = min(VIEW_W / img.width, VIEW_H / img.height)
    resized = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    x = (VIEW_W - resized.width) // 2
    y = (VIEW_H - resized.height) // 2
    bg.paste(resized, (x, y))
    return bg


def load_fit(path: Path) -> Image.Image:
    return fit_phone(Image.open(path))


def smoothstep(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


def render_zoom_frames(img: Image.Image, duration: float, focus: Focus) -> list[Image.Image]:
    frame_count = max(2, int(duration * FPS))
    frames: list[Image.Image] = []
    for i in range(frame_count):
        t = smoothstep(i / max(frame_count - 1, 1))
        zoom = focus.start_zoom + (focus.end_zoom - focus.start_zoom) * t
        vw = VIEW_W / zoom
        vh = VIEW_H / zoom
        cx = focus.cx * VIEW_W
        cy = focus.cy * VIEW_H
        x0 = max(0.0, min(cx - vw / 2, VIEW_W - vw))
        y0 = max(0.0, min(cy - vh / 2, VIEW_H - vh))
        crop = img.crop((int(x0), int(y0), int(x0 + vw), int(y0 + vh)))
        frames.append(crop.resize((VIEW_W, VIEW_H), Image.Resampling.LANCZOS))
    return frames


def render_caption(text: str, width: int = VIEW_W) -> Image.Image:
    font = ImageFont.truetype(FONT_PATH, 34)
    lines = textwrap.wrap(text, width=34)
    line_h = 42
    pad_y = 18
    bar_h = pad_y * 2 + line_h * len(lines)
    img = Image.new("RGBA", (width, bar_h + 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((24, 0, width - 24, bar_h), radius=18, fill=(47, 59, 31, 230))
    y = pad_y
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2, y), line, font=font, fill=(255, 255, 255, 255))
        y += line_h
    return img


def make_caption_png(text: str, path: Path) -> None:
    render_caption(text).save(path)


def frames_to_video(frames: list[Image.Image], duration: float, caption: str, out: Path) -> None:
    seq_dir = WORK / f"{out.stem}-frames"
    if seq_dir.exists():
        shutil.rmtree(seq_dir)
    seq_dir.mkdir()
    for i, frame in enumerate(frames):
        frame.save(seq_dir / f"{i:04d}.png")
    caption_png = WORK / f"{out.stem}-caption.png"
    make_caption_png(caption, caption_png)
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-framerate",
            str(FPS),
            "-i",
            str(seq_dir / "%04d.png"),
            "-loop",
            "1",
            "-i",
            str(caption_png),
            "-t",
            str(duration),
            "-filter_complex",
            "[0:v]format=yuv420p[base];[1:v]scale=1080:-1[c];[base][c]overlay=0:H-h-36",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-an",
            str(out),
        ]
    )
    shutil.rmtree(seq_dir, ignore_errors=True)


def make_zoom_clip(image: Path, duration: float, caption: str, focus: Focus, out: Path) -> None:
    frames = render_zoom_frames(load_fit(image), duration, focus)
    frames_to_video(frames, duration, caption, out)


def make_intro_clip(image: Path, duration: float, caption: str, out: Path) -> None:
    focus = Focus(0.5, 0.5, start_zoom=1.0, end_zoom=1.06)
    frames = render_zoom_frames(load_fit(image), duration, focus)
    frames_to_video(frames, duration, caption, out)


def concat_audio(wavs: list[Path], out: Path) -> None:
    inputs: list[str] = []
    for wav in wavs:
        inputs.extend(["-i", str(wav)])
    n = len(wavs)
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            *inputs,
            "-filter_complex",
            f"{''.join(f'[{i}]' for i in range(n))}concat=n={n}:v=0:a=1[aout]",
            "-map",
            "[aout]",
            str(out),
        ]
    )


def xfade_videos(clips: list[Path], durations: list[float], out: Path) -> None:
    inputs: list[str] = []
    for clip in clips:
        inputs.extend(["-i", str(clip)])
    parts: list[str] = []
    offset = max(0.0, durations[0] - XFADE)
    prev = "[0:v]"
    for i in range(1, len(clips)):
        label = f"v{i:02d}" if i < len(clips) - 1 else "vout"
        parts.append(
            f"{prev}[{i}:v]xfade=transition=fade:duration={XFADE}:offset={offset:.3f}[{label}]"
        )
        prev = f"[{label}]"
        offset += durations[i] - XFADE
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            *inputs,
            "-filter_complex",
            ";".join(parts),
            "-map",
            "[vout]",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            str(out),
        ]
    )


def scale_durations(raw: list[float], target: float) -> list[float]:
    total = sum(raw)
    if total <= 0:
        return raw
    overlap = XFADE * max(0, len(raw) - 1)
    factor = (target + overlap) / total
    return [d * factor for d in raw]


def main() -> None:
    narrator = os.environ.get("NARRATOR", "B").upper()
    if narrator not in NARRATORS:
        raise SystemExit(f"Unknown NARRATOR={narrator!r}. Choose M1–M3, A, B, or C.")
    voice, rate = NARRATORS[narrator]

    WORK.mkdir(parents=True, exist_ok=True)
    intro_card = make_intro_card()

    wavs: list[Path] = []
    raw_durations: list[float] = []
    for seg in SEGMENTS:
        wav = say_segment(seg.key, seg.narration, voice, rate)
        wavs.append(wav)
        raw_durations.append(probe_duration(wav))

    narration = WORK / "narration.wav"
    concat_audio(wavs, narration)
    narration_dur = probe_duration(narration)
    print(f"Raw narration: {narration_dur:.2f}s")

    padded = WORK / "narration-padded.wav"
    pad_seconds = max(0.0, TARGET_SECONDS - narration_dur)
    if pad_seconds > 0.05 and narration_dur < TARGET_SECONDS:
        run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(narration),
                "-af",
                f"apad=pad_dur={pad_seconds:.3f}",
                str(padded),
            ]
        )
        narration = padded
        narration_dur = probe_duration(narration)
        print(f"Padded narration: {narration_dur:.2f}s")

    video_target = max(TARGET_SECONDS, narration_dur)
    seg_durations = scale_durations(raw_durations, video_target)
    final_length = max(TARGET_SECONDS, narration_dur)

    clips: list[Path] = []
    for seg, duration in zip(SEGMENTS, seg_durations):
        out = WORK / f"clip-{seg.key}.mp4"
        if seg.key in {"intro", "outro"}:
            make_intro_clip(intro_card, duration, seg.caption, out)
        elif seg.image and seg.focus:
            make_zoom_clip(seg.image, duration, seg.caption, seg.focus, out)
        elif seg.image:
            make_zoom_clip(
                seg.image,
                duration,
                seg.caption,
                Focus(0.5, 0.5, start_zoom=1.0, end_zoom=1.05),
                out,
            )
        else:
            make_intro_clip(intro_card, duration, seg.caption, out)
        clips.append(out)

    video_only = WORK / "video-only.mp4"
    xfade_videos(clips, seg_durations, video_only)

    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(video_only),
            "-i",
            str(narration),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-t",
            str(final_length),
            str(OUT),
        ]
    )

    final_dur = probe_duration(OUT)
    manifest = {
        "narrator": narrator,
        "voice": voice,
        "rate": rate,
        "duration_seconds": round(final_dur, 2),
        "target_seconds": final_length,
        "output": str(OUT),
        "segments": [
            {
                "key": seg.key,
                "caption": seg.caption,
                "narration": seg.narration,
                "duration_seconds": round(d, 2),
            }
            for seg, d in zip(SEGMENTS, seg_durations)
        ],
    }
    (WORK / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"Wrote {OUT} ({final_dur:.2f}s) using narrator {narrator} ({voice})")


if __name__ == "__main__":
    main()
