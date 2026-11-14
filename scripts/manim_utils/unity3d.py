"""Unity-style 3D authoring helpers for Manim CE.

Unity uses ``+X`` right, ``+Y`` up and ``+Z`` forward. Manim CE is Z-up and
its camera is parameterised by ``phi``/``theta`` with a right-handed view
basis, so Unity's exact view cannot be expressed with those angles: it needs
a mirrored depth axis. This module keeps that detail in one place.

Scenes import it through the shared directory that
``scripts/render-manim.mjs`` adds to ``PYTHONPATH``::

    from manim_utils import UnityScene, to_manim
"""

from __future__ import annotations

from collections.abc import Sequence

import numpy as np
from manim import (
    DEGREES,
    Arrow3D,
    Cone,
    DashedLine,
    Line3D,
    Text,
    ThreeDCamera,
    ThreeDScene,
    VGroup,
)

# Unity (x, y, z) -> Manim (x, -z, y). This is a proper rotation (det = +1).
UNITY_TO_MANIM = np.array(
    [
        [1.0, 0.0, 0.0],
        [0.0, 0.0, -1.0],
        [0.0, 1.0, 0.0],
    ]
)

UNITY_AXIS_COLORS = ("#E5484D", "#30A46C", "#3E63DD")
UNITY_AXIS_NAMES = ("X", "Y", "Z")


def to_manim(points):
    """Convert a Unity-space point (or array of points) to Manim space."""
    return np.asarray(points, dtype=float) @ UNITY_TO_MANIM.T


def U(x: float = 0.0, y: float = 0.0, z: float = 0.0) -> np.ndarray:
    """Shorthand for one Unity-space point."""
    return to_manim([x, y, z])


def face_camera(mobject, camera):
    """Rotate a flat mobject so its glyphs read upright from ``camera``.

    Text and TeX live in the XY plane. A normal 3D rotation cannot align them
    with this camera because the Unity view basis is left-handed, so the
    inverse camera basis is applied directly. Projecting that plane with the
    camera then maps it back to an unmirrored, screen-aligned label.
    """
    camera.reset_rotation_matrix()
    mobject.apply_matrix(
        camera.get_rotation_matrix().T,
        about_point=mobject.get_center(),
    )
    return mobject


def look_at_view(
    pos: Sequence[float],
    look_at: Sequence[float] = (0.0, 0.0, 0.0),
    up: Sequence[float] = (0.0, 1.0, 0.0),
) -> np.ndarray:
    """Build screen rows for a Unity camera at ``pos`` looking at ``look_at``.

    Rows are camera right, camera up, and depth toward the camera. ``up`` is
    a hint and is re-orthogonalized, so it does not need to be perpendicular
    to the view direction. All inputs are Unity-space coordinates.
    """
    position = np.asarray(pos, dtype=float)
    target = np.asarray(look_at, dtype=float)
    up_hint = np.asarray(up, dtype=float)

    forward = target - position
    distance = np.linalg.norm(forward)
    if distance < 1e-9:
        raise ValueError("pos and look_at must be different points")
    forward = forward / distance

    right = np.cross(up_hint, forward)
    right_norm = np.linalg.norm(right)
    if right_norm < 1e-9:
        raise ValueError("up must not be parallel to the view direction")
    right = right / right_norm
    camera_up = np.cross(forward, right)
    camera_up = camera_up / np.linalg.norm(camera_up)

    return np.array([right, camera_up, -forward])


class UnityCamera(ThreeDCamera):
    """A ``ThreeDCamera`` driven by Unity-style yaw/pitch or a look-at view.

    ``pitch`` is positive when the camera looks down, matching the sign of
    the X rotation in Unity's Inspector. ``yaw`` rotates around ``+Y`` and
    the Euler order is ZXY with zero roll, like a Unity Transform.
    """

    def __init__(self, *args, yaw: float = 0.0, pitch: float = 0.0, **kwargs):
        self.unity_yaw = yaw
        self.unity_pitch = pitch
        self._look_at_rows: np.ndarray | None = None
        super().__init__(*args, **kwargs)

    def set_unity_angles(self, yaw: float, pitch: float) -> None:
        self._look_at_rows = None
        self.unity_yaw = yaw
        self.unity_pitch = pitch
        self.reset_rotation_matrix()

    def set_unity_look_at(
        self,
        pos: Sequence[float],
        look_at: Sequence[float] = (0.0, 0.0, 0.0),
        up: Sequence[float] = (0.0, 1.0, 0.0),
    ) -> None:
        self._look_at_rows = look_at_view(pos, look_at, up)
        self.reset_rotation_matrix()

    def generate_rotation_matrix(self) -> np.ndarray:
        if self._look_at_rows is not None:
            return self._look_at_rows @ UNITY_TO_MANIM.T

        cy, sy = np.cos(self.unity_yaw), np.sin(self.unity_yaw)
        cp, sp = np.cos(self.unity_pitch), np.sin(self.unity_pitch)
        yaw_matrix = np.array(
            [
                [cy, 0.0, sy],
                [0.0, 1.0, 0.0],
                [-sy, 0.0, cy],
            ]
        )
        pitch_matrix = np.array(
            [
                [1.0, 0.0, 0.0],
                [0.0, cp, -sp],
                [0.0, sp, cp],
            ]
        )
        # Columns of ``view`` are the camera right/up/forward axes.
        # Unity's Transform applies Euler rotations in Z, X, Y order; with
        # zero roll the world-to-view rotation is Ry(yaw) @ Rx(pitch).
        view = yaw_matrix @ pitch_matrix
        # Rows: screen right, screen up, depth toward the camera.
        screen = np.array([view[:, 0], view[:, 1], -view[:, 2]])
        return screen @ UNITY_TO_MANIM.T


class UnityAxes(VGroup):
    """Red/green/blue axis triad for Unity ``+X``, ``+Y``, ``+Z``.

    Build it after the camera is placed: labels are baked to face the camera
    at construction time. Pass the scene's camera explicitly so the component
    also works outside ``UnityScene``.

    Parameters
    ----------
    camera
        Camera used to orient the labels.
    origin, length
        Triad origin and axis length, in Unity space.
    axes
        Axes to draw, e.g. ``"xyz"``, ``"xz"`` or ``("x", "z")``.
    labels
        Whether to add the X/Y/Z labels.
    colors, label_colors
        Per-axis arrow and label colors.
    dashed
        Draw dashed shafts instead of solid 3D cylinders.
    dash_length, dashed_ratio, stroke_width
        Dash geometry when ``dashed`` is true.
    thickness
        Shaft thickness when ``dashed`` is false.
    tip, tip_height, tip_radius
        Arrowhead switch and dimensions.
    opacity
        Opacity applied to both arrows and labels.
    axis_opacity, label_opacity
        Optional per-part overrides for ``opacity``.
    label_font_size, label_buff
        Label size and distance beyond the tip.
    """

    def __init__(
        self,
        camera,
        origin: Sequence[float] = (0.0, 0.0, 0.0),
        length: float = 1.0,
        *,
        axes: Sequence[str] | str = ("x", "y", "z"),
        labels: bool = True,
        colors: Sequence[str] | None = None,
        label_colors: Sequence[str] | None = None,
        dashed: bool = False,
        dash_length: float = 0.12,
        dashed_ratio: float = 0.5,
        stroke_width: float = 4.0,
        thickness: float = 0.015,
        tip: bool = True,
        tip_height: float = 0.16,
        tip_radius: float = 0.055,
        opacity: float = 1.0,
        axis_opacity: float | None = None,
        label_opacity: float | None = None,
        label_font_size: float = 20.0,
        label_buff: float = 0.14,
    ):
        super().__init__()
        origin_u = np.asarray(origin, dtype=float)
        palette = tuple(colors or UNITY_AXIS_COLORS)
        label_palette = tuple(label_colors or palette)

        selected = {str(value).lower() for value in axes}
        unknown = selected - {"x", "y", "z"}
        if unknown:
            raise ValueError(f"unknown axes: {sorted(unknown)}")

        for index, direction_u in enumerate(np.eye(3)):
            name = UNITY_AXIS_NAMES[index]
            if name.lower() not in selected:
                continue

            color = palette[index]
            start_m = to_manim(origin_u)
            end_m = to_manim(origin_u + direction_u * length)
            direction_m = to_manim(direction_u)

            axis = VGroup()
            if dashed:
                shaft_end = (
                    end_m - direction_m * tip_height if tip else end_m
                )
                axis.add(
                    DashedLine(
                        start_m,
                        shaft_end,
                        color=color,
                        dash_length=dash_length,
                        dashed_ratio=dashed_ratio,
                        stroke_width=stroke_width,
                    )
                )
            elif tip:
                axis.add(
                    Arrow3D(
                        start=start_m,
                        end=end_m,
                        color=color,
                        thickness=thickness,
                        height=tip_height,
                        base_radius=tip_radius,
                    )
                )
            else:
                axis.add(
                    Line3D(
                        start_m,
                        end_m,
                        color=color,
                        thickness=thickness,
                    )
                )

            if dashed and tip:
                cone = Cone(
                    direction=direction_m,
                    base_radius=tip_radius,
                    height=tip_height,
                    color=color,
                )
                cone.shift(end_m)
                axis.add(cone)

            axis.set_opacity(
                opacity if axis_opacity is None else axis_opacity
            )
            self.add(axis)

            if labels:
                label = Text(
                    name,
                    font_size=label_font_size,
                    color=label_palette[index],
                )
                label.move_to(
                    to_manim(origin_u + direction_u * (length + label_buff))
                )
                face_camera(label, camera)
                label.set_opacity(
                    opacity if label_opacity is None else label_opacity
                )
                self.add(label)


class UnityScene(ThreeDScene):
    """``ThreeDScene`` that authors in Unity coordinates."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("camera_class", UnityCamera)
        super().__init__(*args, **kwargs)

    def set_unity_camera(
        self,
        yaw: float | None = None,
        pitch: float | None = None,
        zoom: float | None = None,
        focal_distance: float | None = None,
        frame_center=None,
        *,
        pos: Sequence[float] | None = None,
        look_at: Sequence[float] | None = None,
        up: Sequence[float] = (0.0, 1.0, 0.0),
    ) -> None:
        """Place the camera in Unity space.

        Two forms::

            self.set_unity_camera(yaw=-35, pitch=20, zoom=2.2)
            self.set_unity_camera(pos=(4, 3, -8), look_at=(0, 1, 0))

        In the second form ``pos``, ``look_at`` and ``up`` are Unity-space
        coordinates. Unless overridden, the target becomes the projection
        center and ``focal_distance`` equals the camera-to-target distance.
        ``frame_center`` itself keeps Manim's coordinate convention.
        """
        camera = self.renderer.camera
        if not isinstance(camera, UnityCamera):
            raise TypeError("UnityScene needs UnityCamera as its camera_class")

        if pos is not None:
            if yaw is not None or pitch is not None:
                raise ValueError("pass either yaw/pitch or pos/look_at, not both")
            target = (
                np.zeros(3) if look_at is None else np.asarray(look_at, float)
            )
            position = np.asarray(pos, float)
            camera.set_unity_look_at(position.tolist(), target.tolist(), up)
            if frame_center is None:
                frame_center = to_manim(target)
            if focal_distance is None:
                focal_distance = np.linalg.norm(target - position).item()
        else:
            if look_at is not None:
                raise ValueError("look_at requires pos")
            camera.set_unity_angles(
                (yaw or 0.0) * DEGREES,
                (pitch or 0.0) * DEGREES,
            )

        if zoom is not None:
            camera.set_zoom(zoom)
        if focal_distance is not None:
            camera.set_focal_distance(focal_distance)
        if frame_center is not None:
            camera.frame_center = frame_center

    def set_unity_camera_look_at(
        self,
        pos: Sequence[float],
        look_at: Sequence[float] = (0.0, 0.0, 0.0),
        up: Sequence[float] = (0.0, 1.0, 0.0),
        **kwargs,
    ) -> None:
        """Alias for ``set_unity_camera(pos=..., look_at=..., up=...)``."""
        self.set_unity_camera(pos=pos, look_at=look_at, up=up, **kwargs)

    def unity_axes(
        self,
        origin: Sequence[float] = (0.0, 0.0, 0.0),
        length: float = 1.0,
        **kwargs,
    ) -> UnityAxes:
        """Shortcut for ``UnityAxes(self.renderer.camera, ...)``."""
        return UnityAxes(self.renderer.camera, origin, length, **kwargs)
