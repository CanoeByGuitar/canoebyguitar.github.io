"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6109],{3905:(n,t,e)=>{e.d(t,{Zo:()=>l,kt:()=>m});var r=e(7294);function i(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function a(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),e.push.apply(e,r)}return e}function o(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?a(Object(e),!0).forEach((function(t){i(n,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):a(Object(e)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))}))}return n}function s(n,t){if(null==n)return{};var e,r,i=function(n,t){if(null==n)return{};var e,r,i={},a=Object.keys(n);for(r=0;r<a.length;r++)e=a[r],t.indexOf(e)>=0||(i[e]=n[e]);return i}(n,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(r=0;r<a.length;r++)e=a[r],t.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(n,e)&&(i[e]=n[e])}return i}var u=r.createContext({}),c=function(n){var t=r.useContext(u),e=t;return n&&(e="function"==typeof n?n(t):o(o({},t),n)),e},l=function(n){var t=c(n.components);return r.createElement(u.Provider,{value:t},n.children)},p="mdxType",v={inlineCode:"code",wrapper:function(n){var t=n.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(n,t){var e=n.components,i=n.mdxType,a=n.originalType,u=n.parentName,l=s(n,["components","mdxType","originalType","parentName"]),p=c(e),d=i,m=p["".concat(u,".").concat(d)]||p[d]||v[d]||a;return e?r.createElement(m,o(o({ref:t},l),{},{components:e})):r.createElement(m,o({ref:t},l))}));function m(n,t){var e=arguments,i=t&&t.mdxType;if("string"==typeof n||i){var a=e.length,o=new Array(a);o[0]=d;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=n,s[p]="string"==typeof n?n:i,o[1]=s;for(var c=2;c<a;c++)o[c]=e[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,e)}d.displayName="MDXCreateElement"},9132:(n,t,e)=>{e.r(t),e.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>v,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=e(7462),i=(e(7294),e(3905));const a={title:"Djikstra\u9898\u578b\u603b\u7ed3",date:new Date("2020-06-14T20:20:48.000Z"),tags:["Algorithm"]},o=void 0,s={permalink:"/blog/\u6570\u636e\u7ed3\u6784\u548c\u7b97\u6cd5/Dijkstra/Dijkstra",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/\u6570\u636e\u7ed3\u6784\u548c\u7b97\u6cd5/Dijkstra/Dijkstra.md",source:"@site/blog/\u6570\u636e\u7ed3\u6784\u548c\u7b97\u6cd5/Dijkstra/Dijkstra.md",title:"Djikstra\u9898\u578b\u603b\u7ed3",description:"\u6982\u8ff0",date:"2020-06-14T20:20:48.000Z",formattedDate:"June 14, 2020",tags:[{label:"Algorithm",permalink:"/blog/tags/algorithm"}],readingTime:3.36,hasTruncateMarker:!0,authors:[],frontMatter:{title:"Djikstra\u9898\u578b\u603b\u7ed3",date:"2020-06-14T20:20:48.000Z",tags:["Algorithm"]},prevItem:{title:"\u7ea2\u9ed1\u6811",permalink:"/blog/\u6570\u636e\u7ed3\u6784\u548c\u7b97\u6cd5/RBTree/RBTree"}},u={authorsImageUrls:[]},c=[{value:"\u6982\u8ff0",id:"\u6982\u8ff0",level:2},{value:"\u4ee3\u7801",id:"\u4ee3\u7801",level:2}],l={toc:c},p="wrapper";function v(n){let{components:t,...e}=n;return(0,i.kt)(p,(0,r.Z)({},l,e,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"\u6982\u8ff0"},"\u6982\u8ff0"),(0,i.kt)("p",null,"\u4f7f\u7528Dijkstra\u7684\u6700\u77ed\u8def\u7684\u95ee\u9898\u901a\u5e38\u4e0d\u4ec5\u8981\u6c42\u7ed9\u51fa\u6700\u77ed\u8def\u5f84\uff0c\u8fd8\u9644\u5e26\u4ee5\u4e0b\u51e0\u79cd\u9898\u578b\u6216\u5176\u7ec4\u5408\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u989d\u5916\u589e\u52a0\u4e00\u4e2a\u8fb9\u6743\uff0c\u7528\u4e8e\u6700\u77ed\u8def\u5f84\u76f8\u540c\u60c5\u51b5\u4e0b\u7684\u6bd4\u8f83\uff1b"),(0,i.kt)("li",{parentName:"ul"},"\u989d\u5916\u589e\u52a0\u4e00\u4e2a\u70b9\u6743\uff0c\u7528\u4e8e\u6700\u77ed\u8def\u5f84\u76f8\u540c\u60c5\u51b5\u4e0b\u7684\u6bd4\u8f83\uff1b"),(0,i.kt)("li",{parentName:"ul"},"\u95ee\u6709\u591a\u5c11\u79cd\u6700\u77ed\u8def\uff1b"),(0,i.kt)("li",{parentName:"ul"},"\u8f93\u51fa\u6700\u77ed\u8def\u7ecf\u8fc7\u8282\u70b9\u3002")),(0,i.kt)("h2",{id:"\u4ee3\u7801"},"\u4ee3\u7801"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-c++"},'#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nconst int MAXV = 510; //\u6700\u5927\u9876\u70b9\u6570\uff0c\u901a\u5e38\u53d6\u9898\u76ee\u6240\u7ed9\u6761\u4ef6\u7684\u4e0a\u9650+\uff085\uff5e10\uff09\u5373\u53ef\nconst int INF = 100000000;//\u5b9a\u4e49\u4e00\u4e2a\u5f88\u5927\u7684\u6570\n\nvector<int> Adj[MAXV];//\u56fe\u7684\u90bb\u63a5\u8868\uff08\u53ef\u4ee5\u9009\u62e9\u7528vector<Node> Adj[] \u7ed3\u6784\u4f53\u4e2d\u653e\u5165\u8fb9\u6743\u548c\u70b9\u6743\uff09\n\nint d[MAXV];//\u7b2c\u4e00\u7ebf\u6743\uff08\u4ece\u8d77\u70b9s\u5230\u9876\u70b9u\u7684\u6700\u77ed\u8def\u7a0b\u4e3ad[u]\uff09\nint w[MAXV];//\u70b9\u6743\uff08\u4ece\u8d77\u70b9s\u5230\u9876\u70b9u\u80fd\u6536\u96c6\u5230\u7684\u6700\u591a\u7684\u70b9\u6743\u4e3aw[u]\uff09\nint c[MAXV];//\u7b2c\u4e8c\u7ebf\u6743\uff08\u4ece\u8d77\u70b9s\u5230\u9876\u70b9u\u82b1\u8d39\u7684\u6700\u5c11\u7ebf\u6743\u4e3ac[u]\uff09\nint num[MAXV];//\u8bb0\u5f55\u76f8\u540c\u8ddd\u79bb\u8def\u5f84\u4e2a\u6570\nint pre[MAXV];//\u4ece\u8d77\u70b9\u5230v\u7684\u6700\u77ed\u8def\u5f84\u7684v\u7684\u524d\u4e00\u4e2a\u8282\u70b9\u4e3apre[v]\n\nint weight[MAXV];//\u5b58\u50a8\u8f93\u5165\u7684\u70b9\u6743\nint dist[MAXV][MAXV];//\u5b58\u50a8\u8f93\u5165\u7684\u7b2c\u4e00\u7ebf\u6743\nint cost[MAXV][MAXV];//\u5b58\u50a8\u8f93\u5165\u7684\u7b2c\u4e8c\u7ebf\u6743\n\nbool isVisit[MAXV];//\u7528\u6765\u8bb0\u5f55\u662f\u5426\u8bbf\u95ee\u8fc7\nint M,N;\n\nvoid Dijkstra(int s);\nvoid print_route(int s, int v);\n\nint main(){\n    /*\n     * \u8f93\u5165\u7684\u683c\u5f0f\n     * N\uff08\u8282\u70b9\u4e2a\u6570\uff09 M\uff08\u8fb9\u4e2a\u6570\uff09\n     * w1 w2 ... wN \uff08\u70b9\u6743\uff09\n     * v1 v2 distance cost (\u4e24\u9876\u70b9\u7f16\u53f7\uff0c\u4ee5\u53ca\u4e24\u8005\u95f4\u7684\u4e24\u79cd\u8fb9\u6743)\n     */\n    cin >> M >> N;\n    for(int i = 0;i < N;i++){\n        int temp;\n        cin >> temp;\n        weight[i] = temp;\n    }\n\n    for(int i = 0; i < M;i++){\n        int v1,v2,distance,cost_;\n        cin >> v1 >> v2 >> distance >> cost_;\n        dist[v1][v2] = distance;\n        cost[v1][v2] = cost_;\n    }\n\n    /*\n     * \u521d\u59cb\u5316\u5168\u5c40\u53d8\u91cf\n     */\n    fill(d,d+MAXV,INF);//\u521d\u59cbd\u90fd\u4e3a0\n    fill(w,w+MAXV,0);\n    fill(c,c+MAXV,0);\n\n    fill(num,num+MAXV,0);\n    num[0] = 1;\n\n    Dijkstra(0);\n\n}\n\nvoid Dijkstra(int s){//s\u4e3a\u8d77\u70b9\n    d[s] = 0;//\u8d77\u70b9\u5230\u81ea\u5df1\u8ddd\u79bb\u4e3a0\n    int u = -1;//\u7528\u6765\u8bb0\u5f55\u5f53\u524d\u7684\u9876\u70b9\n    for(int i = 0; i < N; i++){//\u8ba1\u7b97\u5230\u6bcf\u4e2a\u70b9\u7684\u6700\u77ed\u8def\u5f84\n        int MIN = INF;\n        for(int j = 0;j < N;j++){\n            if(isVisit[j]== false && d[j] < MIN){\n                u = j;\n                MIN = d[j];\n            }\n        }\n        isVisit[u] = true;\n\n        for(int j=0; j < Adj[u].size();j++){\n            int v = Adj[u][j];\n            if(isVisit[v] == false && d[u] + dist[u][v] < d[v]){//\u4f18\u5148\u7ea7\uff1a\u7b2c\u4e00\u7ebf > \u7b2c\u4e8c\u7ebf > \u70b9\n                d[v] = d[u] + dist[u][v];//\u7b2c\u4e00\u7ebf\u6743\n                c[v] = c[u] + cost[u][v];//\u7b2c\u4e8c\u7ebf\u6743\n                w[v] = w[u] + weight[v];//\u70b9\u6743\n                num[v] = num[u];\n                pre[v] = u;\n            }else if(isVisit[v] == false && d[u] + dist[u][v] == d[v]){\n                num[v] = num[v] + num[u];//\u52a0\u6cd5\u539f\u7406\n                if(c[v] > c[u] + cost[u][v]){\n                    c[v] = c[u] + cost[u][v];//\u9009\u62e9\u66f4\u5c0f\u7684\u82b1\u8d39\n                    pre[v] = u;\n                }else if(c[v] == c[u] + cost[u][v]){\n                    if(w[v] < w[u] + weight[v]){\n                        w[v] = w[u] + weight[v];\n                        pre[v] = u;\n                    }\n                }\n\n            }\n        }\n        print_route(s, i);\n        cout << "\\n";\n    }\n}\n\nvoid print_route(int s, int v){//\u7c7b\u4f3c\u4e8e\u5e76\u67e5\u96c6\u6216DFS\n    if(v==s){\n        cout << s;\n        return;\n    }\n    print_route(s,pre[v]);\n    cout << v;\n}\n\n')))}v.isMDXComponent=!0}}]);