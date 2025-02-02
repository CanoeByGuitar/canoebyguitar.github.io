---
title: Partio编译
tags: [杂谈]
---
## Cpp
文件结构
```
- extern
    - partio
- CMakeLists.txt
```

```cmake
add_subdirectory(extern/partio)
add_executable(test xx.cpp)
target_link_library(test partio)
```

## Python API
只在ubuntu上尝试了，python环境选择了conda
* partio下载路径： /home/chenhui/Dev/partio/
* conda环境root：/home/chenhui/anaconda3/envs/asflip/
* 执行`/home/chenhui/anaconda3/envs/asflip/bin/python -m pip install /home/chenhui/Dev/partio/` 

它会执行/home/chenhui/Dev/partio/下的setup.py, 里面会进行cmake、make以及把一些编译好的文件move到python目录

### cmake cannot find python
很奇怪的bug，在setup.py里设置了`"-DPython_LIBRARY={} ".format(get_config_var("LIBDIR"))`,这样会找不到python。
如果直接注释掉，能找到python但是后面有一步move文件的时候move的位置不对。
因为get_config_var("LIBDIR")得到的路径是这样`/home/chenhui/anaconda3/envs/asflip/lib`, 而需要的路径是这样
`/home/chenhui/anaconda3/envs/asflip/lib/python3.7`，所以直接改成下面

```
PARTIO_EXT = CMakeExtension(
    name="partio",
    cmake_configure_options=[
        "-DPython_INCLUDE_DIR={} ".format(get_python_inc()),
        # "-DPython_LIBRARY={} ".format(get_config_var("LIBDIR")),
        "-DPython_LIBRARY=/home/chenhui/anaconda3/envs/asflip/lib/python3.7 ",
        "-DPython_EXECUTABLE={} ".format(sys.executable),
    ],
)
```

### lib64路径问题
```
running install_lib
      error: [Errno 2] No such file or directory: '/home/chenhui/Dev/partio/build/install/lib64/libpartio.so.1'
```
把`base_path = Path.cwd() / "build" / "install" / "lib64"`改成`base_path = Path.cwd() / "build" / "install" / "lib"`

### 没有生成partio.py
这是因为没有安装SWIG
> SWIG（Simplified Wrapper and Interface Generator）是一个软件开发工具，它能将用 C 和 C++ 编写的代码与多种高级编程语言（如 Python、Java、Ruby 等）进行连接。.i 文件就是 SWIG 所使用的接口文件，用于描述 C/C++ 代码和目标高级语言之间的接口映射关系。

`sudo apt-get install swig`

## python api使用
https://github.com/CanoeByGuitar/asflip

