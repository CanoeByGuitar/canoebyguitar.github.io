---
title: Djikstra题型总结
date: 2020-06-14 20:20:48
tags: [Algorithm]
---
<!--truncate-->
## 概述
使用Dijkstra的最短路的问题通常不仅要求给出最短路径，还附带以下几种题型或其组合：
- 额外增加一个边权，用于最短路径相同情况下的比较；
- 额外增加一个点权，用于最短路径相同情况下的比较；
- 问有多少种最短路；
- 输出最短路经过节点。

## 代码
```c++
#include <iostream>
#include <vector>

using namespace std;

const int MAXV = 510; //最大顶点数，通常取题目所给条件的上限+（5～10）即可
const int INF = 100000000;//定义一个很大的数

vector<int> Adj[MAXV];//图的邻接表（可以选择用vector<Node> Adj[] 结构体中放入边权和点权）

int d[MAXV];//第一线权（从起点s到顶点u的最短路程为d[u]）
int w[MAXV];//点权（从起点s到顶点u能收集到的最多的点权为w[u]）
int c[MAXV];//第二线权（从起点s到顶点u花费的最少线权为c[u]）
int num[MAXV];//记录相同距离路径个数
int pre[MAXV];//从起点到v的最短路径的v的前一个节点为pre[v]

int weight[MAXV];//存储输入的点权
int dist[MAXV][MAXV];//存储输入的第一线权
int cost[MAXV][MAXV];//存储输入的第二线权

bool isVisit[MAXV];//用来记录是否访问过
int M,N;

void Dijkstra(int s);
void print_route(int s, int v);

int main(){
    /*
     * 输入的格式
     * N（节点个数） M（边个数）
     * w1 w2 ... wN （点权）
     * v1 v2 distance cost (两顶点编号，以及两者间的两种边权)
     */
    cin >> M >> N;
    for(int i = 0;i < N;i++){
        int temp;
        cin >> temp;
        weight[i] = temp;
    }

    for(int i = 0; i < M;i++){
        int v1,v2,distance,cost_;
        cin >> v1 >> v2 >> distance >> cost_;
        dist[v1][v2] = distance;
        cost[v1][v2] = cost_;
    }

    /*
     * 初始化全局变量
     */
    fill(d,d+MAXV,INF);//初始d都为0
    fill(w,w+MAXV,0);
    fill(c,c+MAXV,0);

    fill(num,num+MAXV,0);
    num[0] = 1;

    Dijkstra(0);

}

void Dijkstra(int s){//s为起点
    d[s] = 0;//起点到自己距离为0
    int u = -1;//用来记录当前的顶点
    for(int i = 0; i < N; i++){//计算到每个点的最短路径
        int MIN = INF;
        for(int j = 0;j < N;j++){
            if(isVisit[j]== false && d[j] < MIN){
                u = j;
                MIN = d[j];
            }
        }
        isVisit[u] = true;

        for(int j=0; j < Adj[u].size();j++){
            int v = Adj[u][j];
            if(isVisit[v] == false && d[u] + dist[u][v] < d[v]){//优先级：第一线 > 第二线 > 点
                d[v] = d[u] + dist[u][v];//第一线权
                c[v] = c[u] + cost[u][v];//第二线权
                w[v] = w[u] + weight[v];//点权
                num[v] = num[u];
                pre[v] = u;
            }else if(isVisit[v] == false && d[u] + dist[u][v] == d[v]){
                num[v] = num[v] + num[u];//加法原理
                if(c[v] > c[u] + cost[u][v]){
                    c[v] = c[u] + cost[u][v];//选择更小的花费
                    pre[v] = u;
                }else if(c[v] == c[u] + cost[u][v]){
                    if(w[v] < w[u] + weight[v]){
                        w[v] = w[u] + weight[v];
                        pre[v] = u;
                    }
                }

            }
        }
        print_route(s, i);
        cout << "\n";
    }
}

void print_route(int s, int v){//类似于并查集或DFS
    if(v==s){
        cout << s;
        return;
    }
    print_route(s,pre[v]);
    cout << v;
}

```

