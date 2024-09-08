"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[1762],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},p=Object.keys(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),c=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(o.Provider,{value:t},e.children)},i="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,p=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),i=c(n),d=r,f=i["".concat(o,".").concat(d)]||i[d]||m[d]||p;return n?a.createElement(f,l(l({ref:t},u),{},{components:n})):a.createElement(f,l({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=n.length,l=new Array(p);l[0]=d;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[i]="string"==typeof e?e:r,l[1]=s;for(var c=2;c<p;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3685:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>m,frontMatter:()=>p,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const p={title:"\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b",tags:["C++"]},l=void 0,s={permalink:"/blog/C++/\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b/1",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/C++/\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b/1.md",source:"@site/blog/C++/\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b/1.md",title:"\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b",description:"\u4e3a\u4ec0\u4e48\u9700\u8981\u79fb\u52a8\u8bed\u4e49",date:"2023-12-02T06:34:46.000Z",formattedDate:"December 2, 2023",tags:[{label:"C++",permalink:"/blog/tags/c"}],readingTime:5.415,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\u4ece\u79fb\u52a8\u8bed\u4e49\u5230\u5c01\u88c5RAII\u7c7b",tags:["C++"]},prevItem:{title:"Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3",permalink:"/blog/C++/Cpp\u548cUE\u667a\u80fd\u6307\u9488\u8be6\u89e3/1"},nextItem:{title:"\u7f16\u8bd1\u548c\u94fe\u63a5",permalink:"/blog/C++/\u7f16\u8bd1\u548c\u94fe\u63a5/\u94fe\u63a5\u3001\u88c5\u8f7d\u4e0e\u5e93"}},o={authorsImageUrls:[]},c=[{value:"\u4e3a\u4ec0\u4e48\u9700\u8981\u79fb\u52a8\u8bed\u4e49",id:"\u4e3a\u4ec0\u4e48\u9700\u8981\u79fb\u52a8\u8bed\u4e49",level:2},{value:"\u5de6\u503c\u548c\u53f3\u503c",id:"\u5de6\u503c\u548c\u53f3\u503c",level:2},{value:"\u901a\u7528\u5f15\u7528\u548c\u5b8c\u7f8e\u8f6c\u53d1",id:"\u901a\u7528\u5f15\u7528\u548c\u5b8c\u7f8e\u8f6c\u53d1",level:2},{value:"\u6765\u6e90",id:"\u6765\u6e90",level:3},{value:"std::forward",id:"stdforward",level:3}],u={toc:c},i="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(i,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"\u4e3a\u4ec0\u4e48\u9700\u8981\u79fb\u52a8\u8bed\u4e49"},"\u4e3a\u4ec0\u4e48\u9700\u8981\u79fb\u52a8\u8bed\u4e49"),(0,r.kt)("p",null,"\u5bf9\u4e8e\u4e00\u4e2a\u81ea\u5b9a\u4e49\u7684\u7c7b\uff0c\u8be5\u7c7b\u62e5\u6709\u4e00\u4e9b\u8d44\u6e90\uff0c\u6bd4\u5982\u5806\u4e2d\u7684\u8fde\u7eed\u6570\u636e"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"struct Vec {\n    Vec(int size):\n    size(size),\n    data(new int[size])\n    {}\n\n    ~Vec(){delete[] data;}\n    \n    Vec(const Vec& v) {\n        size = v.size;\n        data = new int[size];\n        memcpy(data, v.data, size);\n    }\n\n    Vec& operator=(const Vec& v) {\n        if(this == &v) return *this;\n        size = v.size();\n        delete[] data;\n        data = new int[size];\n        memcpy(data, v.data, size);\n        return *this;\n    }\n\n    int* data;\n    int size;\n};\n")),(0,r.kt)("p",null,"\u8fd9\u4e2a\u7c7b\u7684\u8bed\u4e49\u662f\u638c\u7ba1\u4e86\u4e00\u4efd\u8d44\u6e90\uff0c\u8fd9\u4e2a\u8d44\u6e90\u53ef\u4ee5\u6df1\u62f7\u8d1d\u7ed9\u5176\u4ed6\u5bf9\u8c61\uff0c\u4f46\u6bcf\u4e2a\u5bf9\u8c61\u62e5\u6709\u7684\u8d44\u6e90\u662f\u4e0d\u540c\u4e14\u552f\u4e00\u7684\uff0c\u4e0d\u53ef\u5171\u4eab\u3002"),(0,r.kt)("p",null,"\u5927\u90e8\u5206\u60c5\u51b5\uff0c\u8fd9\u79cd\u8bed\u4e49\u662fOK\u7684\uff0c\u4f46\u5728\u67d0\u4e9b\u9700\u6c42\u4e0b\u5e0c\u671b\u4e00\u4e2a\u5bf9\u8c61\u7684\u8d44\u6e90\u7684\u6240\u6709\u6743\u662f\u53ef\u4ee5\u8f6c\u79fb\u7ed9\u522b\u4eba\u7684\uff0c\u8f6c\u79fb\u4e86\u4e4b\u540e\u81ea\u5df1\u5c31\u4e0d\u518d\u62e5\u6709\u8fd9\u4efd\u8d44\u6e90\u3002"),(0,r.kt)("p",null,"\u90a3\u4e48\u5c31\u5e94\u5f53\u8fd9\u6837\u5b9e\u73b0\u62f7\u8d1d\u548c\u8d4b\u503c"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"Vec(Vec-Type v) {\n    size = v.size;\n    data = v.data;\n    v.data = nullptr;\n    v.size = 0;\n}\n\nVec& operator=(Vec-Type v) {\n    if(this == &v) return *this;\n    delete[] data;\n    size = v.size();\n    data = v.data;\n    v.data = nullptr;\n    v.size = 0;\n    return *this;\n}\n")),(0,r.kt)("p",null,"\u6b64\u5904\u7684Vec-Type\u7528\u4e8e\u533a\u522bconst Vec&, \u8fd9\u6837\u5c31\u80fd\u6839\u636e\u4f20\u5165\u7684\u53c2\u6570\u7c7b\u578b\u6765\u51b3\u5b9a\u8c03\u7528\u62f7\u8d1d\u8fd8\u662f\u79fb\u52a8\u3002"),(0,r.kt)("p",null,"\u5728c++11\u524d\uff0c\u4e00\u822c\u4f7f\u7528Boost\u4e2drvref\u6765\u5b9e\u73b0"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"template<typename T>\nstruct Boost_rvref {\n  T& ref;\n};\n\ntemplate<typename T>\nBoost_rvref<T> move(const T& in) {\n  return in;\n}\n\nVec(Boost_rvref<Vec> v) {\n  size = v.ref.size;\n  data = new int[size];\n  memcpy(data, v.ref.data, size);\n}\n\nVec a(3);\nVec b(move(a));\n")),(0,r.kt)("p",null,"\u786e\u5b9a\u662f\u9700\u8981\u66f4\u591a\u7684\u4f7f\u7528move\u6765\u89e6\u53d1\u7acb\u5373\u6570\u548c\u5c06\u4ea1\u503c\u7684\u79fb\u52a8"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"Vec(const Vec&) = delete;\nVec f() {\n    Vec v(3);\n    return v;\n}\nVec b(f()); // \u4f1a\u8c03\u7528Vec(const Vec&) \u62a5\u9519\n")),(0,r.kt)("p",null,"c++11\u540e\u5b98\u65b9\u7ed9\u51fa\u4e86rvalue ref\u7c7b\u578b,\u6765\u533a\u5206\u62f7\u8d1d\u548c\u79fb\u52a8\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"Vec(Vec&& v) {\n    size = v.ref.size;\n    data = new int[size];\n    memcpy(data, v.ref.data, size);\n}\nVec a(3);\nVec b(std::move(a));\n")),(0,r.kt)("p",null,"\u6240\u4ee5\u53f3\u503c\u5f15\u7528\u7684\u552f\u4e00\u4f5c\u7528\u5c31\u662f\u5b9e\u73b0\u79fb\u52a8\u6784\u9020\u548c\u79fb\u52a8\u8d4b\u503c"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"\u5bf9\u6bd4boost\u8fd9\u79cd\u6a21\u677f\u7684\u65b9\u5f0f\uff0c\u5b98\u65b9\u7684\u6807\u51c6\u652f\u6301\u7acb\u5373\u6570\u548c\u5c06\u4ea1\u503c\u7684\u79fb\u52a8\uff0c\u800c\u4e0d\u9700\u8981\u989d\u5916\u5957\u4e00\u4e2amove")),(0,r.kt)("h2",{id:"\u5de6\u503c\u548c\u53f3\u503c"},"\u5de6\u503c\u548c\u53f3\u503c"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u7c7b\u578b")," \u548c ",(0,r.kt)("strong",{parentName:"p"},"\u5de6\u53f3\u503c"),"\u662f\u4e24\u4e2a\u4e0d\u540c\u7ef4\u5ea6\u7684\u4e1c\u897f\uff0c\u8c03\u7528\u51fd\u6570\u65f6\u7684\u51fd\u6570\u7b7e\u540d\u65e2\u5305\u542b",(0,r.kt)("strong",{parentName:"p"},"\u7c7b\u578b"),"\u4e5f\u5305\u542b",(0,r.kt)("strong",{parentName:"p"},"\u5de6\u53f3\u503c"),"\uff0c \u4e24\u4e2a\u90fd\u5bf9\u5e94\u624d\u80fd\u8c03\u7528"),(0,r.kt)("p",null,"\u5de6\u503c\uff1a\u80fd\u53d6\u51fa\u5730\u5740\uff0c\u5185\u5b58\u4e2d\u5b9e\u9645\u5b58\u5728\uff0c\u6709\u4e00\u4e2a\u6807\u8bc6\u7b26\uff08\u540d\u79f0\uff09\u7684\u503c"),(0,r.kt)("p",null,"\u53f3\u503c\uff1a\u4e0d\u80fd\u53d6\u51fa\u5730\u5740\uff0c\u901a\u5e38\u662f\u4e34\u65f6\u5bf9\u8c61"),(0,r.kt)("p",null,"\u5de6\u503c\u548c\u53f3\u503c\u53ea\u662f\u8bed\u6cd5\u5c42\u9762\u7684\u4e1c\u897f\uff0c\u53ea\u5728\u7f16\u8bd1\u671f\u53d1\u6325\u4f5c\u7528\uff0c\u6307\u6325\u7f16\u8bd1\u5668\u9009\u53d6\u5bf9\u5e94\u51fd\u6570"),(0,r.kt)("p",null,"\u53f3\u503c\u5f15\u7528\u662f\u4e00\u79cd",(0,r.kt)("strong",{parentName:"p"},"\u7c7b\u578b"),"\uff0c\u7ed1\u5b9a\u5230\u4e00\u4e2a\u53f3\u503c\u4e0a\u3002"),(0,r.kt)("p",null,"\u53f3\u503c\u5f15\u7528\u53ef\u4ee5\u662f\u5de6\u503c\u4e5f\u53ef\u4ee5\u662f\u53f3\u503c"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"A a;\nA&& a1 = std::move(a);\n// a1\u548cstd::move(a)\u7c7b\u578b\u90fd\u662fA&&, \u4f46a1\u662f\u5de6\u503c\uff0c std::move(a)\u662f\u53f3\u503c\n")),(0,r.kt)("h2",{id:"\u901a\u7528\u5f15\u7528\u548c\u5b8c\u7f8e\u8f6c\u53d1"},"\u901a\u7528\u5f15\u7528\u548c\u5b8c\u7f8e\u8f6c\u53d1"),(0,r.kt)("h3",{id:"\u6765\u6e90"},"\u6765\u6e90"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"// \u53f3\u503c\u5f15\u7528\nA&& a1 = A();\n\n// \u901a\u7528\u5f15\u7528\nauto&& a2 = A();\n\ntemplate<typename T>\nvoid f(T&& param);\n")),(0,r.kt)("p",null,"\u901a\u7528\u5f15\u7528\u5176\u5b9e\u662feffective c++\u7684\u4f5c\u8005\u63d0\u51fa\uff0c \u7528\u6765\u63cf\u8ff0",(0,r.kt)("strong",{parentName:"p"},"\u5f15\u7528\u6298\u53e0"),"\u6548\u679c\u7684\u6982\u5ff5"),(0,r.kt)("p",null,"\u5f15\u7528\u6298\u53e0\u662fc++\u6807\u51c6\u7684\u7f16\u8bd1\u89c4\u5219"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"\u53ea\u6709T&& && \u624d\u662f\u53f3\u503c\uff0c\u5176\u4ed6\u7ec4\u5408\u65b9\u5f0f\u90fd\u662f\u5de6\u503c")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'struct A {\n    A() = default;\n};\n\nvoid f(const A&){std::cout << "const A&\\n";}\nvoid f(A&&){std::cout << "A&&\\n";}\n\ntemplate<typename T>\nvoid test(T&& t) {\n    f(t);\n}\n\nA a;\ntest(a); // const A&\uff0c t\u7684\u7c7b\u578b\u662f && + & = &\ntest(std::move(a)); // const A&\uff0c t\u7684\u7c7b\u578b\u662f&& + && = &&\uff0c \u4f46\u662ft\u662f\u4e2a\u5de6\u503c\n')),(0,r.kt)("h3",{id:"stdforward"},"std::forward"),(0,r.kt)("p",null,"\u4e3a\u4e86\u5b9e\u73b0\u4f20\u8fdb\u6765\u7684\u53c2\u6570\u662f\u5de6\u503c\uff0ct\u5c31\u662f\u5de6\u503c\uff1b\u4f20\u8fdb\u6765\u7684\u53c2\u6570\u662f\u53f3\u503c\uff0ct\u5c31\u662f\u53f3\u503c\uff0c\u9700\u8981\u52a0std::forward"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"template<typename T>\nvoid test(T&& t) {\n    f(std::forward<T>(t));\nA a;\ntest(a); // const A&\ntest(std::move(a)); // A&&\n}\n")),(0,r.kt)("p",null,"\u5177\u4f53\u5b9e\u73b0"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'// \u9488\u5bf9\u4f20\u5165\u7684\u662f\u5de6\u503c\ntemplate <typename T>\nconstexpr T&& forward(typename std::remove_reference<T>::type& t) noexcept {\n    return static_cast<T&&>(t);\n}\n\n// \u9488\u5bf9\u4f20\u5165\u7684\u662f\u53f3\u503c\ntemplate <typename T>\nconstexpr T&& forward(typename std::remove_reference<T>::type&& t) noexcept {\n    static_assert(!std::is_lvalue_reference<T>::value, "T must not be an lvalue reference");\n    return static_cast<T&&>(t);\n}\n')),(0,r.kt)("p",null,"\u53ef\u4ee5\u53d1\u73b0forward\u4e5f\u5229\u7528\u4e86\u5f15\u7528\u6298\u53e0\u7684\u89c4\u5219\uff0c\u4f20\u5165\u5de6\u503c && + & = &\uff0c \u4f20\u5165\u53f3\u503c && + && = &&"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"// f(std::forward<T>(t)) \u76f8\u5f53\u4e8e\nif t is &, f(t)\nif t is &&, f(std::move(t))\n\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u5e94\u7528")),(0,r.kt)("p",null,"\u5b9e\u73b0\u8f93\u5165\u7c7bT\u7684\u6784\u9020\u53c2\u6570\uff0c\u8fd4\u56deT\u7684\u667a\u80fd\u6307\u9488"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"template<typename T, typename... Args>\nstd::shared_ptr<T> make_shared(Args&&... args){\n  // args\u662fArgs&&...\u7c7b\u578b\u7684\u5de6\u503c\n  // \u6240\u4ee5\u4e0b\u9762\u8c03\u7528\u7684\u662fT\u7684\u62f7\u8d1d\u6784\u9020\n  return std::shared_ptr<T>(new T(args...));\n}\n")),(0,r.kt)("p",null,"\u6539\u4e3a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"template<typename T, typename... Args>\nstd::shared_ptr<T> make_shared(Args&&... args){\n  // \u5b8c\u7f8e\u8f6c\u53d1 args\u7684\u5de6/\u53f3\u503c\u5c5e\u6027\n  // \u4f20\u5165\u7684\u662f\u5de6\u503c\u5c31\u8f6c\u53d1\u5de6\u503c\n  // \u4f20\u5165\u7684\u662f\u53f3\u503c\u5c31\u8f6c\u53d1\u53f3\u503c\n  return std::shared_ptr<T> (new T(std::forward<Args>(args)...);\n}\n")))}m.isMDXComponent=!0}}]);