"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5474],{3905:(n,t,e)=>{e.d(t,{Zo:()=>u,kt:()=>_});var r=e(7294);function a(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function p(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),e.push.apply(e,r)}return e}function o(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?p(Object(e),!0).forEach((function(t){a(n,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):p(Object(e)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))}))}return n}function s(n,t){if(null==n)return{};var e,r,a=function(n,t){if(null==n)return{};var e,r,a={},p=Object.keys(n);for(r=0;r<p.length;r++)e=p[r],t.indexOf(e)>=0||(a[e]=n[e]);return a}(n,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(n);for(r=0;r<p.length;r++)e=p[r],t.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(n,e)&&(a[e]=n[e])}return a}var i=r.createContext({}),d=function(n){var t=r.useContext(i),e=t;return n&&(e="function"==typeof n?n(t):o(o({},t),n)),e},u=function(n){var t=d(n.components);return r.createElement(i.Provider,{value:t},n.children)},c="mdxType",m={inlineCode:"code",wrapper:function(n){var t=n.children;return r.createElement(r.Fragment,{},t)}},l=r.forwardRef((function(n,t){var e=n.components,a=n.mdxType,p=n.originalType,i=n.parentName,u=s(n,["components","mdxType","originalType","parentName"]),c=d(e),l=a,_=c["".concat(i,".").concat(l)]||c[l]||m[l]||p;return e?r.createElement(_,o(o({ref:t},u),{},{components:e})):r.createElement(_,o({ref:t},u))}));function _(n,t){var e=arguments,a=t&&t.mdxType;if("string"==typeof n||a){var p=e.length,o=new Array(p);o[0]=l;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=n,s[c]="string"==typeof n?n:a,o[1]=s;for(var d=2;d<p;d++)o[d]=e[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,e)}l.displayName="MDXCreateElement"},2376:(n,t,e)=>{e.r(t),e.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>m,frontMatter:()=>p,metadata:()=>s,toc:()=>d});var r=e(7462),a=(e(7294),e(3905));const p={title:"Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3",tags:["C++"]},o=void 0,s={permalink:"/blog/C++/Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3/1",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/C++/Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3/1.md",source:"@site/blog/C++/Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3/1.md",title:"Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3",description:"shared_ptr",date:"2023-12-02T06:34:46.000Z",formattedDate:"December 2, 2023",tags:[{label:"C++",permalink:"/blog/tags/c"}],readingTime:3.17,hasTruncateMarker:!0,authors:[],frontMatter:{title:"Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3",tags:["C++"]},prevItem:{title:"\u6d45\u6790ECS\u67b6\u6784",permalink:"/blog/\u6742\u8c08/\u6d45\u6790ECS\u67b6\u6784/ECS"},nextItem:{title:"\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b",permalink:"/blog/C++/\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b/1"}},i={authorsImageUrls:[]},d=[{value:"shared_ptr",id:"shared_ptr",level:2},{value:"unique_ptr",id:"unique_ptr",level:2}],u={toc:d},c="wrapper";function m(n){let{components:t,...e}=n;return(0,a.kt)(c,(0,r.Z)({},u,e,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"shared_ptr"},"shared_ptr"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},'//\n// Created by \u738b\u6668\u8f89 on 2023/8/7.\n//\n\n#include <iostream>\n\n#define LINE std::cout << "\\n*************************************\\n" << std::endl;\n#define BLOCK(x)  std::cout << "\\n\\n\\n********** " <<#x << " ********* \\n\\n\\n";\n#define Print(x) std::cout << #x << "  cnt : " << x.use_count() << "  value: "<< *x << std::endl;\n\n\nnamespace MySharedPtr {\n    template<typename T>\n    class shared_ptr {\n    public:\n        // ctor\n        explicit shared_ptr(T* objPtr);\n\n        // dtor\n        ~shared_ptr();\n\n        // copy ctor\n        shared_ptr(const shared_ptr& other);\n\n        // copy assignment\n        shared_ptr& operator=(const shared_ptr& other);\n\n        // dereference\n        T operator*(){return *m_data;};\n\n        // count\n        int use_count(){return *m_cnt;};\n\n        // get\n        T* get(){return m_data;};\n\n    private:\n        T *m_data;\n        int *m_cnt;\n    };\n\n    template<typename T, typename... Args>\n    shared_ptr<T> make_shared(Args&&... args){\n        return shared_ptr<T>(new T(std::forward<Args>(args)...));\n    }\n}\n\nint main() {\n    {// std\n        using std::shared_ptr;\n        using std::make_shared;\n\n        shared_ptr<int> a(new int(10));\n        Print(a)  // 1 10\n\n//        int raw = 1; // \u4e0d\u8981\u628a\u6808\u91cc\u53d8\u91cf\u7684\u5730\u5740\u7ed9shared_ptr\n        int* raw = new int(1);\n        shared_ptr<int> b(raw);\n        Print(b) // 1 1\n\n        auto c = make_shared<int>(10);\n        Print(c) // 1 10\n\n        auto d = make_shared<int>(*raw);\n        Print(d) // 1 1\n\n        // copy construct / copy assignment\n        auto e = d; // \u6d45\u62f7\u8d1d\n        Print(e)  // 2 1\n        shared_ptr<int> g(e); // \u6d45\u62f7\u8d1d\n        Print(g)  // 3 1\n        auto f = make_shared<int>(*d); // \u6df1\u62f7\u8d1d\n        Print(f)  // 1 1\n\n        // dereference\n        auto pa = a.get();\n        std::cout << *pa << std::endl; // 10\n        *pa = 2;\n        std::cout << *a << std::endl; // 2\n    }\n\n    LINE;\n\n    {// MySharedPtr\n        using MySharedPtr::shared_ptr;\n        using MySharedPtr::make_shared;\n\n        shared_ptr<int> a(new int(10));\n        Print(a)  // 1 10\n\n//        int raw = 1; // \u4e0d\u8981\u628a\u6808\u91cc\u53d8\u91cf\u7684\u5730\u5740\u7ed9shared_ptr\n        int* raw = new int(1);\n        shared_ptr<int> b(raw);\n        Print(b) // 1 1\n\n        auto c = make_shared<int>(10);\n        Print(c) // 1 10\n\n        auto d = make_shared<int>(*raw);\n        Print(d) // 1 1\n\n        // copy construct / copy assignment\n        auto e = d; // \u6d45\u62f7\u8d1d\n        Print(e)  // 2 1\n        shared_ptr<int> g(e); // \u6d45\u62f7\u8d1d\n        Print(g)  // 3 1\n        auto f = make_shared<int>(*d); // \u6df1\u62f7\u8d1d\n        Print(f)  // 1 1\n\n        // dereference\n        auto pa = a.get();\n        std::cout << *pa << std::endl; // 10\n        *pa = 2;\n        std::cout << *a << std::endl; // 2\n    }\n\n\n\n}\n\n\ntemplate<typename T>\nMySharedPtr::shared_ptr<T>::shared_ptr(T* obj)\n:m_data(obj), m_cnt(new int(1))\n{}\n\ntemplate<typename T>\nMySharedPtr::shared_ptr<T>::~shared_ptr(){\n    (*m_cnt)--;\n    if(*m_cnt == 0){\n        delete m_data;\n        delete m_cnt;\n    }\n}\n\ntemplate<typename T>\nMySharedPtr::shared_ptr<T>::shared_ptr(const shared_ptr<T> &other) {\n    m_data = other.m_data;\n    m_cnt = other.m_cnt;\n    (*m_cnt)++;\n}\n\ntemplate<typename T>\nMySharedPtr::shared_ptr<T>& MySharedPtr::shared_ptr<T>::operator=(const MySharedPtr::shared_ptr<T>& other) {\n    if(this == &other) return *this;\n    (*m_cnt)--;\n    if(*m_cnt == 0){\n        delete m_cnt;\n        delete m_data;\n    }\n    m_data = other.m_data;\n    m_cnt = other.cnt;\n    *(m_cnt)++;\n}\n')),(0,a.kt)("h2",{id:"unique_ptr"},"unique_ptr"),(0,a.kt)("p",null,"\u53ea\u652f\u6301\u79fb\u52a8\u6784\u9020\u548c\u79fb\u52a8\u8d4b\u503c"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},'//\n// Created by \u738b\u6668\u8f89 on 2023/8/11.\n//\n//\n// Created by \u738b\u6668\u8f89 on 2023/8/7.\n//\n\n#include <iostream>\n#include <memory>\n\n#define LINE std::cout << "\\n*************************************\\n" << std::endl;\n#define BLOCK(x)  std::cout << "\\n\\n\\n********** " <<#x << " ********* \\n\\n\\n";\n\n\n\nnamespace MyUniquePtr{\n    template<typename T>\n    class unique_ptr{\n    private:\n        T* m_data;\n\n    public:\n        unique_ptr(T* p = nullptr):m_data(p){}\n        unique_ptr(const unique_ptr<T>&) = delete;\n        unique_ptr& operator=(const unique_ptr<T>&)  = delete;\n        unique_ptr(unique_ptr<T>&& other):m_data(other){\n            other.ptr = nullptr;\n        }\n        unique_ptr& operator=(unique_ptr<T>&& other) noexcept {\n            if(this == &other){\n                return *this;\n            }\n            delete m_data;\n            m_data = other.m_data;\n            other.m_data = nullptr;\n            return *this;\n        }\n        ~unique_ptr(){delete m_data;}\n        T* get() const {return m_data;}\n    };\n}\n\n\nstd::unique_ptr<int> pass_through(std::unique_ptr<int> p){\n    return p;\n}\n\nint main() {\n    {// std\n        using std::shared_ptr;\n        using std::unique_ptr;\n        using std::make_shared;\n        using std::make_unique;\n\n        unique_ptr<int> p = std::make_unique<int>(1);\n//        unique_ptr<int> q = pass_through(p); // error unique_ptr has no copy ctor\n        unique_ptr<int> q1 = std::move(p);  // it has only move ctor\n//        unique_ptr<int> q2(std::move(p)); // move ctor  but error for p has pass the ownership to q1\n        unique_ptr<int> q3(std::move(q1));\n        std::cout << *q3 << std::endl;\n\n        unique_ptr<int> w = std::make_unique<int>(1);\n        q3 = std::move(w);  // move assignment\n        std::cout << *q3  << std::endl;\n\n    }\n\n    LINE;\n\n\n}\n\n')))}m.isMDXComponent=!0}}]);