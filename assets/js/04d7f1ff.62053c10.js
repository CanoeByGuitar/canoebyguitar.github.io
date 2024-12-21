"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9323],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},m="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(c,".").concat(d)]||m[d]||s[d]||i;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[m]="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1918:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const i={title:"Eigen Cookbook",tags:["C++"]},o=void 0,l={permalink:"/blog/C++/Eigen/eigen",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/C++/Eigen/eigen.md",source:"@site/blog/C++/Eigen/eigen.md",title:"Eigen Cookbook",description:"Matrix",date:"2024-12-14T16:22:47.811Z",formattedDate:"December 14, 2024",tags:[{label:"C++",permalink:"/blog/tags/c"}],readingTime:1.005,hasTruncateMarker:!1,authors:[],frontMatter:{title:"Eigen Cookbook",tags:["C++"]},prevItem:{title:"2024\u5e74\u5e95\u4e00\u4e9b\u60f3\u6cd5\u603b\u7ed3",permalink:"/blog/\u6742\u8c08/\u968f\u7b14/\u9009offer\u540e\u7684\u601d\u8003"},nextItem:{title:"\u5e38\u7528\u8bbe\u8ba1\u6a21\u5f0f",permalink:"/blog/C++/\u8bbe\u8ba1\u6a21\u5f0f/1"}},c={authorsImageUrls:[]},p=[{value:"Matrix",id:"matrix",level:2},{value:"\u6e90\u7801\u5206\u6790",id:"\u6e90\u7801\u5206\u6790",level:2},{value:"\u6784\u9020",id:"\u6784\u9020",level:3},{value:"\u8d4b\u503c",id:"\u8d4b\u503c",level:3},{value:"\u4e0d\u5fc5\u8981\u7684\u5185\u5b58\u7533\u8bf7\u548c\u62f7\u8d1d\u8d4b\u503c",id:"\u4e0d\u5fc5\u8981\u7684\u5185\u5b58\u7533\u8bf7\u548c\u62f7\u8d1d\u8d4b\u503c",level:2}],u={toc:p},m="wrapper";function s(e){let{components:t,...n}=e;return(0,a.kt)(m,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"matrix"},"Matrix"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"Matrix<float, Dynamic, 1> // n\u884c1\u5217\u7684float\u77e9\u9635\n")),(0,a.kt)("h2",{id:"\u6e90\u7801\u5206\u6790"},"\u6e90\u7801\u5206\u6790"),(0,a.kt)("p",null,"refs: ",(0,a.kt)("a",{parentName:"p",href:"https://eigen.tuxfamily.org/dox/TopicInsideEigenExample.html"},"eigen\u5b98\u7f51")),(0,a.kt)("h3",{id:"\u6784\u9020"},"\u6784\u9020"),(0,a.kt)("h3",{id:"\u8d4b\u503c"},"\u8d4b\u503c"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"VectorXd v; v << 1, 2, 3;"),"\n\u8fd9\u79cd\u5199\u6cd5\u662fcpp98\u7684\u7cdf\u7c95\uff0c\u56e0\u4e3a\u5f53\u65f6\u6ca1\u6709initializer_list\u3002\n\u901a\u8fc7\u5185\u90e8\u7c7bCommaInitializer\u548c\u91cd\u8f7d",(0,a.kt)("inlineCode",{parentName:"p"},"operator,"),"\u6765\u5b9e\u73b0"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"// \u4e00\u4e2a\u7b80\u5355\u7684\u4f8b\u5b50\nstruct VectorXd {\n    explicit VectorXd(int n) :\n            size(n),\n            current_idx(0) {\n        data = new double[n];\n    }\n\n    ~VectorXd() {\n        delete[] data;\n    }\n\n    double &operator[](int i) const {\n        return *(data + i);\n    }\n\n    double *data;\n    int size;\n    int current_idx;\n\n    struct CommaInitializer {\n        explicit CommaInitializer(VectorXd &v) : vec(v) {}\n\n        CommaInitializer& operator,(double val){\n            assert(vec.current_idx < vec.size);\n            vec.data[vec.current_idx] = val;\n            vec.current_idx++;\n            return *this;\n        };\n\n        VectorXd &vec;\n    };\n\n    CommaInitializer operator<<(double val){\n        CommaInitializer init(*this);\n        init, val;\n        return init;\n    }\n};\n")),(0,a.kt)("h2",{id:"\u4e0d\u5fc5\u8981\u7684\u5185\u5b58\u7533\u8bf7\u548c\u62f7\u8d1d\u8d4b\u503c"},"\u4e0d\u5fc5\u8981\u7684\u5185\u5b58\u7533\u8bf7\u548c\u62f7\u8d1d\u8d4b\u503c"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"// \u4e00\u822c\u7684\u5b9e\u73b0\u4e0b\nu = v + w; \n//\u5b9e\u9645\u4f1a\u6267\u884c\uff0c\u53d1\u751f\u4e86\u4e00\u6b21\u989d\u5916\u7684\u62f7\u8d1d\nVectorXf tmp = v + w;\nVectorXf u = tmp;\n")))}s.isMDXComponent=!0}}]);