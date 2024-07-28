---
title: 浅析ECS架构
tags: [杂谈]
---
<!--truncate-->
[项目链接](https://github.com/CanoeByGuitar/ECS-Template)

## Introduce
每个Entiry挂载一些Component，每次Tick的时候对Component进行Tick就可以了。

比如说场景里的Entity可以挂有MeshRenderComponent、TransformComponent、CameraComponent. 每个Component上都会存一些数据，比如RenderComponent里会有模型数据（Vertices、Normals等）和VBO、VAO索引；每个CameraComponent里会有fov、lookat方向等参数。

在每次Tick时，这些参数都有可能会改变，有两种数据存储/遍历Tick方式：
* SOA：一个Entity的所有Component数据存在一起，一次Tick遍历所有Entity，依次Tick每个Entity全部的Component
* AOS： 把同一类的Component存在一起，一次Tick，依次Tick所有Compoent，比如先Tick所有Transform，在Tick所有Render...

选择AOS的空间局部性更好，Cache miss更少

在内存中需要存些什么？

* EntityManager不用存储任何实际信息（因为所有信息都写在Component里），我们只需要维护一个当前生命周期内的Eid集合LiveEntitySet和可用的Eid队列AvailableEidQueue，当需要创建一个Entity的时候取AvailableEidQueue的队头head，创建实体（Component池子里增加新的数据），然后把head加入LiveEntitySet
* ComponentManager，按种类依次存储所有的Component，可以用一个Map：Name --> Array来实现, 每个Array除了data本身，还需要维护一个MapEidToCid和MapCidToEid，在加入新的Component时，加入到data到尾部，而删除一个Entity时，把Eid对应的Cid删掉会导致o(n)的开销（后面的Component要前移），所以采取把删掉的那个位置用尾部Component来代替。



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