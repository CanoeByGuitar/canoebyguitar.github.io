# output: bouncing-ball
"""A ball bouncing on the XZ plane with simple Y-axis physics."""

import numpy as np
from manim import (
    ManimColor,
    Rectangle,
    Sphere,
    Surface,
    Text,
    ValueTracker,
    VGroup,
    always_redraw,
    linear,
)
from manim_utils import UnityScene, face_camera, to_manim

GRAVITY = 5.0
RESTITUTION = 0.62
STOP_SPEED = 0.8
BALL_RADIUS = 0.16
START_Y = 2.0
READOUT_POS = (3.4, 1.2, 1.2)


def _build_segments():
    """Return (t0, height, velocity, t1) for each fall."""
    segments = []
    t0 = 0.0
    height = START_Y - BALL_RADIUS
    velocity = 0.0
    while True:
        fall_time = (
            velocity + np.sqrt(velocity**2 + 2.0 * GRAVITY * height)
        ) / GRAVITY
        impact_speed = np.sqrt(
            velocity**2 + 2.0 * GRAVITY * height
        )
        t1 = t0 + fall_time
        segments.append((t0, height, velocity, t1))
        if impact_speed < STOP_SPEED:
            break
        t0 = t1
        height = 0.0
        velocity = RESTITUTION * impact_speed
    return segments


SEGMENTS = _build_segments()
TOTAL_TIME = SEGMENTS[-1][3]


def sample_height(time):
    """Return (height above the plane, y velocity) at ``time``."""
    if time >= TOTAL_TIME:
        return 0.0, 0.0
    for t0, height, velocity, t1 in SEGMENTS:
        if time <= t1:
            tau = time - t0
            h = height + velocity * tau - 0.5 * GRAVITY * tau**2
            return max(0.0, h), velocity - GRAVITY * tau
    return 0.0, 0.0


class BouncingBall(UnityScene):
    def construct(self):
        self.camera.background_color = ManimColor("#11111B")
        self.set_unity_camera(
            pos=(6.0, 4.0, -8.0),
            look_at=(0.6, 0.9, 0.0),
            up=(0.0, 1.0, 0.0),
            zoom=1.05,
        )

        plane = Surface(
            lambda u, v: to_manim(
                np.stack([u, np.zeros_like(u), v], axis=-1)
            ),
            u_range=(-2.5, 2.5),
            v_range=(-2.5, 2.5),
            resolution=(16, 16),
            checkerboard_colors=False,
            fill_color=ManimColor("#1E1E2E"),
            fill_opacity=0.6,
            stroke_color=ManimColor("#45475A"),
            stroke_opacity=0.55,
        )

        tracker = ValueTracker(0.0)
        ball = Sphere(
            radius=BALL_RADIUS,
            resolution=(20, 20),
            checkerboard_colors=False,
            fill_color=ManimColor("#F9E2AF"),
            fill_opacity=1.0,
            stroke_width=0,
            shade_in_3d=True,
        )
        ball.move_to(to_manim([0.0, START_Y, 0.0]))

        def follow_tracker(mob):
            height, _ = sample_height(tracker.get_value())
            mob.move_to(
                to_manim([0.0, height + BALL_RADIUS, 0.0])
            )

        ball.add_updater(follow_tracker)

        camera = self.renderer.camera

        def build_readout():
            height, velocity = sample_height(tracker.get_value())
            position_y = height + BALL_RADIUS
            text = Text(
                f"vel: (0.00, {velocity:+.2f}, 0.00)\n"
                f"pos: (0.00, {position_y:+.2f}, 0.00)",
                font_size=26,
                color=ManimColor("#CDD6F4"),
                line_spacing=0.55,
                t2c={"vel": "#89B4FA", "pos": "#A6E3A1"},
            )
            panel = Rectangle(
                width=text.width + 0.5,
                height=text.height + 0.35,
                fill_color=ManimColor("#11111B"),
                fill_opacity=0.85,
                stroke_color=ManimColor("#45475A"),
                stroke_width=1.2,
                stroke_opacity=0.7,
            )
            group = VGroup(panel, text)
            group.move_to(to_manim(READOUT_POS))
            return face_camera(group, camera)

        readout = always_redraw(build_readout)

        self.add(plane, ball, readout)
        self.wait(0.5)
        self.play(
            tracker.animate.set_value(TOTAL_TIME),
            run_time=TOTAL_TIME,
            rate_func=linear,
        )
        self.wait(0.8)
