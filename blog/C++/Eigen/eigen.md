---
title: Eigen Cookbook
tags: [C++]
---
## Matrix
```cpp
Matrix<float, Dynamic, 1> // n行1列的float矩阵
```

## 源码分析
refs: [eigen官网](https://eigen.tuxfamily.org/dox/TopicInsideEigenExample.html)
### 构造

### 赋值
`VectorXd v; v << 1, 2, 3;`
这种写法是cpp98的糟粕，因为当时没有initializer_list。
通过内部类CommaInitializer和重载`operator,`来实现
```cpp
// 一个简单的例子
struct VectorXd {
    explicit VectorXd(int n) :
            size(n),
            current_idx(0) {
        data = new double[n];
    }

    ~VectorXd() {
        delete[] data;
    }

    double &operator[](int i) const {
        return *(data + i);
    }

    double *data;
    int size;
    int current_idx;

    struct CommaInitializer {
        explicit CommaInitializer(VectorXd &v) : vec(v) {}

        CommaInitializer& operator,(double val){
            assert(vec.current_idx < vec.size);
            vec.data[vec.current_idx] = val;
            vec.current_idx++;
            return *this;
        };

        VectorXd &vec;
    };

    CommaInitializer operator<<(double val){
        CommaInitializer init(*this);
        init, val;
        return init;
    }
};
```

## 不必要的内存申请和拷贝赋值
```cpp
// 一般的实现下
u = v + w; 
//实际会执行，发生了一次额外的拷贝
VectorXf tmp = v + w;
VectorXf u = tmp;
```