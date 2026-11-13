# output: coordinate-frame-rotation
"""3D coordinate frame rotation demo for the blog system sample.

A is fixed in world space. The coordinate frame rotates by R around z,
so coordinates change from a to a' = R^T a.
"""

import numpy as np
from manim import (
    DEGREES,
    DL,
    DOWN,
    LEFT,
    ORIGIN,
    OUT,
    UL,
    UP,
    Arc,
    Arrow3D,
    Create,
    DashedLine,
    Dot3D,
    FadeIn,
    Indicate,
    Line3D,
    ManimColor,
    Text,
    ThreeDScene,
    TransformFromCopy,
    VGroup,
    normalize,
)


class CoordinateFrameRotation(ThreeDScene):
    def construct(self):
        self.camera.background_color = ManimColor("#11111B")
        self.set_camera_orientation(phi=68 * DEGREES, theta=-48 * DEGREES, zoom=0.86)

        angle = 60 * DEGREES
        rotation = np.array(
            [
                [np.cos(angle), -np.sin(angle), 0.0],
                [np.sin(angle), np.cos(angle), 0.0],
                [0.0, 0.0, 1.0],
            ]
        )
        a = np.array([2.0, 1.0, 1.0])
        a_prime = rotation.T @ a

        old_colors = ["#F38BA8", "#A6E3A1", "#89B4FA"]
        new_colors = ["#FAB387", "#CBA6F7", "#94E2D5"]

        old_axes = self.coordinate_frame(np.identity(3), old_colors, opacity=0.55)
        new_axes = self.coordinate_frame(rotation, new_colors, opacity=1.0)
        new_axes.set_opacity(0)

        point_a = Dot3D(a, radius=0.105, color="#F9E2AF")
        point_label = Text("A", font_size=30, color="#F9E2AF").move_to(a + np.array([0.18, 0.18, 0.25]))

        old_components = self.components(a, np.identity(3), old_colors, opacity=0.72)
        new_components = self.components(a_prime, rotation, new_colors, opacity=0.96)
        new_components.set_opacity(0)

        title = Text("Coordinate Frame Rotation", font_size=34, color="#CDD6F4")
        subtitle = Text("A is fixed; only its coordinates change", font_size=22, color="#A6ADC8")
        title.to_corner(UL, buff=0.45)
        subtitle.next_to(title, DOWN, aligned_edge=LEFT, buff=0.12)
        equation = Text("a' = R^T a", font_size=30, color="#89B4FA")
        equation.to_corner(DL, buff=0.55)
        numeric = Text(
            f"a = (2.00, 1.00, 1.00)    a' = ({a_prime[0]:.2f}, {a_prime[1]:.2f}, {a_prime[2]:.2f})",
            font_size=18,
            color="#CDD6F4",
        )
        numeric.next_to(equation, UP, aligned_edge=LEFT, buff=0.14)

        self.add_fixed_in_frame_mobjects(title, subtitle, equation, numeric)
        self.play(Create(old_axes), FadeIn(point_a), FadeIn(point_label), run_time=1.6)
        self.play(Create(old_components), run_time=1.3)
        self.wait(0.8)

        rotation_arc = Arc(
            radius=1.05,
            start_angle=0,
            angle=angle,
            color="#F9E2AF",
            stroke_width=5,
        ).shift(0.04 * OUT)
        rotation_mark = Text("R", font_size=24, color="#F9E2AF").move_to(
            np.array([0.55, 0.82, 0.15])
        )

        self.play(FadeIn(rotation_arc), FadeIn(rotation_mark), run_time=0.5)
        new_axes.set_opacity(1)
        self.play(
            TransformFromCopy(old_axes, new_axes),
            old_axes.animate.set_opacity(0.2),
            old_components.animate.set_opacity(0.16),
            run_time=2.4,
        )
        self.wait(0.4)

        new_components.set_opacity(1)
        self.play(Create(new_components), run_time=1.5)
        self.play(Indicate(point_a, color="#F9E2AF", scale_factor=1.35), run_time=0.8)
        self.wait(2.0)

    @staticmethod
    def coordinate_frame(basis, colors, opacity):
        group = VGroup()
        labels = ["x", "y", "z"]
        for i in range(3):
            direction = basis[:, i] * 3.25
            arrow = Arrow3D(
                start=ORIGIN,
                end=direction,
                color=colors[i],
                thickness=0.018,
                height=0.18,
                base_radius=0.07,
            )
            label = Text(labels[i], font_size=22, color=colors[i]).move_to(
                direction + 0.18 * normalize(direction)
            )
            group.add(arrow, label)
        group.set_opacity(opacity)
        return group

    @staticmethod
    def components(coords, basis, colors, opacity):
        group = VGroup()
        origin = np.zeros(3)
        current = origin.copy()
        for i in range(3):
            nxt = current + coords[i] * basis[:, i]
            segment = Line3D(current, nxt, color=colors[i], thickness=0.015)
            group.add(segment)
            if i < 2:
                guide = DashedLine(
                    nxt,
                    np.sum([coords[j] * basis[:, j] for j in range(i + 1, 3)], axis=0) + nxt,
                    color="#585B70",
                    dash_length=0.12,
                    stroke_opacity=0.42,
                )
                group.add(guide)
            current = nxt
        group.set_opacity(opacity)
        return group
