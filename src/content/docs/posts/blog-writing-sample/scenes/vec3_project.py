# output: vec3-projection
"""Project a Unity-space vector onto the XZ ground plane.

The scene is authored in Unity coordinates: +X right, +Y up, +Z forward.
The still therefore drops the vector along -Y, not along -Z.
"""

import numpy as np
from manim import (
    ORIGIN,
    Arrow3D,
    DashedLine,
    ManimColor,
    Surface,
    VGroup,
)
from manim_utils import UnityScene, to_manim


class Vector3Project(UnityScene):
    def construct(self):
        self.camera.background_color = ManimColor("#FFFFFF")
        self.set_unity_camera(
            pos=(0, 3.0, -5.0),
            look_at=(0.0, 0.0, 0.0),
            up=(0.0, 1.0, 0.0),
            zoom=2.2,
        )

        origin = np.array([-1.0, 0.3, -1.0])
        vector_end = np.array([1.0, 2.0, 1.0])

        # Unity convention: +Y is up, so the ground is the XZ plane.
        plane_normal = np.array([0.0, 1.0, 0.0])
        projected_end = (
            vector_end - np.dot(vector_end, plane_normal) * plane_normal
        )

        plane = Surface(
            lambda u, v: to_manim(
                np.stack([u, np.zeros_like(u), v], axis=-1)
            ),
            u_range=(-1.5, 1.5),
            v_range=(-1.5, 1.5),
            resolution=(8, 8),
            fill_color=ManimColor("#B8C0CC"),
            fill_opacity=0.65,
            stroke_color=ManimColor("#6C7480"),
            stroke_opacity=0.8,
        )
        original_vector = Arrow3D(
            start=to_manim(origin),
            end=to_manim(vector_end),
            color=ManimColor("#000000"),
            thickness=0.025,
        )
        projection_line = DashedLine(
            to_manim(vector_end),
            to_manim(projected_end),
            color=ManimColor("#444444"),
            dash_length=0.08,
        )
        projected_vector = Arrow3D(
            start=to_manim(origin),
            end=to_manim(projected_end),
            color=ManimColor("#FF3030"),
            thickness=0.025,
        )
        axes = self.unity_axes(
            origin=(0, 0.0, 0),
            length=2,
            label_font_size=18,
            opacity=0.3
        )

        diagram = VGroup(
            plane,
            projection_line,
            projected_vector,
            original_vector,
            axes,
        )
        diagram.move_to(ORIGIN)
        self.add(diagram)
