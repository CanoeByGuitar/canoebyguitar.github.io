---
name: manim-blog-animation
description: 为本博客写/改 Manim CE 动画与静态插图，并渲染成文章资产。适用于新增文章动画场景、改现有 scene（Y 轴向上的 Unity 坐标）、生成 MP4/WebM/poster 或裁剪后的 PNG 插图，或扩展 scripts/manim_utils 公共封装时使用。
license: MIT
---

# Manim 博客动画

本项目的所有动画和插图都用 Manim CE 在本地离线渲染，网页只引用生成的静态文件。不引入浏览器端动画运行时。

## 目录约定

```text
src/content/docs/posts/<slug>/
├── index.md
├── assets/                      # Markdown 图片（Astro 会优化成 WebP）
└── scenes/
    ├── bouncing_ball.py         # 视频场景
    └── vec3_project.py          # 静态图场景
public/media/<slug>/             # 视频产物（原生 <video> 不受 Astro 处理）
scripts/manim_utils/             # 共享封装
scripts/render-manim.mjs         # 渲染脚本
.venv/                           # Python 3.12 + Manim 0.22.1
```

规则：

- 一篇文章一个文件夹，资产目录名 = 文章文件夹名，脚本自动推导，不需要手填
- 视频/大媒体 → `public/media/<slug>/`，文章里用 `/media/<slug>/name.webm`
- 静态插图 → 文章自己的 `assets/`，Markdown 用 `./assets/name.png`，Astro 会转 WebP 并加尺寸

## 基本用法

场景文件结构：

```python
# output: my-animation        # 决定资产文件名，不写则用文件名

import numpy as np
from manim import ManimColor, Sphere, Text
from manim_utils import UnityScene, to_manim

class MyScene(UnityScene):
    def construct(self):
        self.camera.background_color = ManimColor("#FFFFFF")
        self.set_unity_camera(pos=(4, 3, -6), look_at=(0, 1, 0))

        ball = Sphere(radius=0.2, color=ManimColor("#FF3030"))
        ball.move_to(to_manim((0, 2, 0)))   # Unity 坐标 → Manim 坐标
        self.play(Create(ball))
        self.wait(1)
```

写场景时：

- 一律用 Unity 坐标思考（+Y 上、+Z 前），进出 Manim 用 `to_manim` / `U`
- 相机用 `self.set_unity_camera(yaw=, pitch=, zoom=)` 或 `pos=` / `look_at=`
- 不要用 `from manim import *`，显式导入（ruff 会拦通配符导入）
- 类名驼峰，`# output:` 用短横线小写
- 只有 `self.add(...)`、没有 `play`/`wait` 的场景会走 `still`（静态图），速度最快

## 共享封装 `scripts/manim_utils`

导出的公共 API（`from manim_utils import ...`）：

| 名称 | 用途 |
| --- | --- |
| `UnityScene` | 基类，相机默认是 `UnityCamera` |
| `set_unity_camera(yaw, pitch, zoom, ..., pos, look_at, up)` | Unity 风格摆机位 |
| `set_unity_camera_look_at(pos, look_at, up)` | 上面那个的简写 |
| `unity_axes(...)` | 生成 Unity 三轴（可配色、可虚线） |
| `to_manim(points)` / `U(x, y, z)` | Unity → Manim 坐标 |
| `UnityAxes` | 三轴 VGroup，需自己传入 camera |
| `UnityCamera` | 绑定在场景里的相机类，一般不用直接碰 |
| `face_camera(mobject, camera)` | 让文字始终面向相机 |
| `look_at_view(...)` | 底层矩阵，主要给封装内部用 |
| `UNITY_AXIS_COLORS` / `UNITY_AXIS_NAMES` | 轴颜色与名字常量 |

**扩展原则**：只要逻辑会对第二个场景有用，就写进 `scripts/manim_utils/`，不要复制粘贴到场景里。

- 新的通用几何/相机/坐标行为 → 加到 `unity3d.py`，并在 `__init__.py` 的 import 和 `__all__` 里导出
- 只服务单一场景的一次性逻辑（某条曲线、某个布局）→ 留在场景文件里
- 改完 utils 要在 `pyrightconfig.json` 覆盖到的范围内保持零诊断：`pyright` 用 `extraPaths: ["scripts"]`
- 类型标注要能被 pyright 接受：`np.ndarray` 传给 `Sequence[float]` 参数时用 `.tolist()`，标量用 `.item()`

## 渲染

```bash
node scripts/render-manim.mjs --mode preview --scene-file <scene.py>   # 480p15，自动播放
node scripts/render-manim.mjs --mode still   --scene-file <scene.py>   # 3840×2160 → 裁边 → PNG
node scripts/render-manim.mjs --mode render  --scene-file <scene.py>   # 1080p30 + WebM + poster
```

Zed task（打开 `.py` 后从 `task: spawn` 选）：

| Task | 等价命令 | 产物 |
| --- | --- | --- |
| `Manim: Preview current scene` | `--mode preview` | `.manim-media/` 里的 MP4，自动打开，不写 `public/` |
| `Manim: Render current still` | `--mode still` | `<article>/assets/<output>.png`，已裁白边并补 32px |
| `Manim: Render current scene` | `--mode render` | `public/media/<slug>/<output>.{mp4,webm}` + `-poster.webp` |

说明：

- `preview` 只进 `.manim-media/`，可以随便跑
- `still` 走 3840×2160 渲染后 `sharp` 裁掉白边，所以插图不会是画布中间一个小点
- `render` 末尾用 FFmpeg 转 VP9 WebM（CRF 32）并抽 2 秒帧做 WebP poster
- FFmpeg 查找顺序：`FFMPEG_PATH` → PATH → winget 安装目录
- Manim 按 `self.play`/`self.wait` 逐段渲染再拼接，段与段之间没有输出，属于正常现象

改完场景必须跑：

```bash
.venv/Scripts/python.exe -m ruff check <scene.py> scripts/
.venv/Scripts/python.exe -m py_compile <scene.py>
```

## 在文章里引用

视频（WebM 在前，MP4 兜底，必须有 poster 和 `preload="metadata"`）：

```html
<video controls playsinline preload="metadata" poster="/media/<slug>/name-poster.webp">
  <source src="/media/<slug>/name.webm" type="video/webm" />
  <source src="/media/<slug>/name.mp4" type="video/mp4" />
  Your browser does not support embedded video.
</video>
```

静态插图（Markdown 语法，走 Astro 优化）：

```markdown
![说明文字](./assets/name.png)
```

## 交付前

```bash
npm run check
npm run build
```

确认 `dist/media/<slug>/` 有产物、页面里的路径是 `/media/...`，然后才谈提交。
