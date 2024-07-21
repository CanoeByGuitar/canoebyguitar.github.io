---
title: 伪物理实时弹性骨骼 
tags: [graphics]
---
<!--truncate-->
## 概要



## 算法

**基本部分**

一根骨骼链，在每一帧都会有一个pose，如果没有key过中间pose，应当始终保持初始pose。root joint在移动时（被父骨骼带动）会驱动其他子骨骼的运动。除了root joint完全维持自身的pose外，其他子joint计算得到的position为 **伪物理计算 和 原本Pose的插值**,计算完position后再进行**长度复原**

伪物理计算会依次考虑：**惯性、角色root在世界中的移动和旋转、重力**。某joint第$t+1$时刻的position $x^{t+1}$

1. 惯性影响：

    $v^t = \frac{x^t - x^{t-1}}{dt}\cdot(1-damping) \\ x^{t+1}=x^t + dt\cdot v^t$​

2. 角色root在世界中的移动和旋转

   $x^{t+1} = x^t + moveVector \cdot (1 - moveDamping) \\ x^{t+1} = x^t + (moveRotation \cdot x^t - x^t) * rotateDamping $

3. 重力（外力）

​	$x^{t+1} = x^{t} + force * dt$

和Pose插值 以及长度复原

```cpp
// interpolate with pose
Vec3 baseLocation =
      mLocations[parent_joint] + (mPoseLocations[i] - mPoseLocations[parent_joint]);
mLocations[i] +=
  (baseLocation - mLocations[i]) * (1.0 - pow(1.0 - CONFIG::stiffness, 1));

// restore length
double length = (mPoseLocations[i] - mPoseLocations[parent_joint]).norm();
 mLocations[i] =
      (mLocations[i] - mLocations[parent_joint]).normalized() * length + mLocations[parent_joint];
```



## Maya实现





## UE实现



