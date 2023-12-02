---
title: ECS-Template  
tags: [graphics]
---
<!--truncate-->
[项目链接](https://github.com/CanoeByGuitar/ECS-Template)
## 浅析ECS架构
TODO

## 性能测试（vulgrind）
```
==34347== I refs:        1,846,865,683
==34347== I1  misses:            2,382
==34347== LLi misses:            2,200
==34347== I1  miss rate:          0.00%
==34347== LLi miss rate:          0.00%
==34347== 
==34347== D refs:          763,562,223  (507,107,313 rd   + 256,454,910 wr)
==34347== D1  misses:       12,871,245  ( 12,347,581 rd   +     523,664 wr)
==34347== LLd misses:           39,315  (      7,755 rd   +      31,560 wr)
==34347== D1  miss rate:           1.7% (        2.4%     +         0.2%  )
==34347== LLd miss rate:           0.0% (        0.0%     +         0.0%  )
==34347== 
==34347== LL refs:          12,873,627  ( 12,349,963 rd   +     523,664 wr)
==34347== LL misses:            41,515  (      9,955 rd   +      31,560 wr)
==34347== LL miss rate:            0.0% (        0.0%     +         0.0%  )

```