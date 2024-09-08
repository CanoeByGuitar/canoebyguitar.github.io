"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6964],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),p=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(i.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),s=p(n),m=a,f=s["".concat(i,".").concat(m)]||s[m]||d[m]||l;return n?r.createElement(f,c(c({ref:t},u),{},{components:n})):r.createElement(f,c({ref:t},u))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,c=new Array(l);c[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o[s]="string"==typeof e?e:a,c[1]=o;for(var p=2;p<l;p++)c[p]=n[p];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1363:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>c,default:()=>d,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const l={title:"\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001",tags:["C++"]},c=void 0,o={permalink:"/blog/C++/\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001/1",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/C++/\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001/1.md",source:"@site/blog/C++/\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001/1.md",title:"\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001",description:"\u52a8\u6001\u591a\u6001",date:"2024-07-28T04:38:49.000Z",formattedDate:"July 28, 2024",tags:[{label:"C++",permalink:"/blog/tags/c"}],readingTime:4.845,hasTruncateMarker:!0,authors:[],frontMatter:{title:"\u52a8\u6001\u591a\u6001\u548c\u9759\u6001\u591a\u6001",tags:["C++"]},prevItem:{title:"\u6a21\u7248\u5143\u5165\u95e8",permalink:"/blog/C++/\u6a21\u7248\u5143\u8303\u5f0f\u5165\u95e8/1"},nextItem:{title:"UE C++ Cookbook",permalink:"/blog/Unreal/UE_Cookbook/1"}},i={authorsImageUrls:[]},p=[{value:"\u52a8\u6001\u591a\u6001",id:"\u52a8\u6001\u591a\u6001",level:2},{value:"\u9759\u6001\u591a\u6001",id:"\u9759\u6001\u591a\u6001",level:2},{value:"\u6a21\u7248\u51fd\u6570",id:"\u6a21\u7248\u51fd\u6570",level:3},{value:"CRTP",id:"crtp",level:3},{value:"\u7528Variant\u6539\u9020\u9759\u6001\u591a\u6001",id:"\u7528variant\u6539\u9020\u9759\u6001\u591a\u6001",level:3}],u={toc:p},s="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(s,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"\u52a8\u6001\u591a\u6001"},"\u52a8\u6001\u591a\u6001"),(0,a.kt)("p",null,"\u52a8\u6001\u591a\u6001\u7684\u4f18\u70b9\u662f\u53ef\u4ee5\u5b9e\u73b0\u591a\u8d28\u53d8\u91cf\u7684\u5bb9\u5668\uff0c\u7136\u540e\u904d\u5386\u6267\u884c\u540c\u540d\u51fd\u6570\uff0c\u4ea7\u751f\u4e0d\u540c\u6548\u679c\u3002\n\u7f3a\u70b9\u663e\u7136\u5c31\u662fvptr\u7684\u5bfb\u5740\u5f00\u9500"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"namespace VirtualFunction {\n    struct IShape {\n        virtual ~IShape() = default;\n\n        virtual float Area() = 0;\n    };\n\n    struct Circle : public IShape {\n        float r = 1;\n\n        float Area() override {\n            return 3.14f * r * r;\n        }\n    };\n\n    struct Rect : public IShape {\n        float a = 1, b = 1;\n\n        float Area() override {\n            return a * b;\n        }\n    };\n\n    void f() {\n        IShape *circle = new Circle();\n        IShape *rect = new Rect();\n        std::cout << circle->Area() << rect->Area();\n        delete circle;\n        delete rect;\n    }\n}\n")),(0,a.kt)("h2",{id:"\u9759\u6001\u591a\u6001"},"\u9759\u6001\u591a\u6001"),(0,a.kt)("h3",{id:"\u6a21\u7248\u51fd\u6570"},"\u6a21\u7248\u51fd\u6570"),(0,a.kt)("p",null,"\u7528\u6a21\u7248\u51fd\u6570\uff0c\u628a\u62bd\u8c61\u7c7b\u4f5c\u4e3a\u6a21\u7248\u53c2\u6570\u4f20\u5165\uff0c\u7136\u540e\u6267\u884c\uff0c\u867d\u7136\u8868\u8fbe\u4e0a\u80fd\u4f53\u73b0\u591a\u6001\u6027\uff0c\n\u4f46\u662f\u5355\u7eaf\u8fd9\u6837\u4f3c\u4e4e\u6ca1\u6709\u5b58\u5728\u7684\u610f\u4e49\u3002\u6bd5\u7adf\u5728\u4f7f\u7528\u591a\u6001\u65f6\uff0c\u4e0d\u4f1a\u4e00\u4e2a\u4e2a\u624b\u52a8\u7684\u53bb\u521b\u5efa\u5bf9\u8c61\u6267\u884c\u51fd\u6570\u3002"),(0,a.kt)("p",null,"\u56e0\u6b64\u4f18\u70b9\u662f\u7f16\u8bd1\u5668\u591a\u6001\uff0c\u6ca1\u6709\u8fd0\u884c\u65f6\u989d\u5916\u5f00\u9500\uff1b\u7f3a\u70b9\u662f\u505a\u4e0d\u5230\u201c\u591a\u8d28\u53d8\u91cf\u5bb9\u5668\u904d\u5386\u201d\u3010\u9664\u975e\u901a\u8fc7variant\uff0c\u540e\u6587\u4f1a\u8bb2\u3011"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"namespace NormalTemplate {\n    struct Circle {\n        float r = 1;\n        float Area() const { return 3.14f * r * r; }\n    };\n\n    struct Rect {\n        float a = 1, b = 1;\n        float Area() const { return a * b; }\n    };\n\n    template<typename Shape>\n    float Area(const Shape &shape) {\n        return shape.Area();\n    }\n\n    void f(){\n        Circle circle;\n        Rect rect;\n        std::cout << Area(circle) << Area(rect);\n    }\n}\n")),(0,a.kt)("h3",{id:"crtp"},"CRTP"),(0,a.kt)("p",null,"\u666e\u901a\u7684\u6a21\u7248\u51fd\u6570\u7684\u5b9e\u73b0\u80fd\u8868\u8fbe\u591a\u6001\u8bed\u4e49\uff0c\u4f46\u662f\u5b58\u5728\u6ca1\u6709\u66f4\u591a\u7684\u5408\u7406\u6027\uff1b\n\u800cCRTP\u9664\u4e86\u80fd\u8868\u8fbe\u591a\u6001\u8bed\u4e49\uff08is-a\uff09\uff0c\u5728\u672c\u8d28\u4e0a\u5b83\u662f\u4e00\u79cdhas-ability\u7684\u8bed\u4e49. "),(0,a.kt)("p",null,"is-a\u5c31\u662f\u719f\u77e5\u7684\u7ee7\u627f\u5173\u7cfb\uff0cCircle\u7ee7\u627f\u81eaShape\uff0c\u81ea\u7136\u6709Shape\u8ba1\u7b97Area\u7684\u529f\u80fd\uff1b\n\u800c\u591a\u4e2aCRTP Derived\u7c7b\u8868\u8fbe\u7684\u662f\u8fd9\u4e9b\u7c7b\u90fd\u6709\u4e00\u4e9b\u5171\u540c\u7684\u80fd\u529b\uff0c\u8fd9\u4e2a\u80fd\u529b\u4e0d\u662f\u4eceBase\u90a3\u8fb9\u7ee7\u627f\u8fc7\u6765\u7684\uff08\u867d\u7136\u597d\u50cf\u542c\u8d77\u6765\u548c\u591a\u6001\u8bed\u4e49\u4e5f\u5dee\u4e0d\u591a\uff09\u3002"),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"\u5728\u5e94\u7528\u4e2d\uff0cCRTP\u5b58\u5728\u7684\u610f\u4e49\u5c31\u662f\u7b80\u5316\u4ee3\u7801\uff0c\u800c\u4e0d\u662f\u5f02\u8d28\u5bb9\u5668\u904d\u5386\u3002")),(0,a.kt)("p",null,"\u6bd4\u5982\u6211\u6709\u5f88\u591a\u5361\u724c\uff0c\u90fd\u5e0c\u671b\u5b83\u6709\u590d\u5236\u81ea\u8eab\u5c5e\u6027\u7684\u80fd\u529b"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"struct Card{}\nstruct CardA : public Card{\n    CardA Clone(){\n        return CardA(*this);\n    }\n    int a;\n}\n\nstruct CardB : public Card{\n    CardB Clone(){\n        return CardB(*this);\n    }\n    float b;\n}\n")),(0,a.kt)("p",null,"\u5982\u679c\u8fd9\u6837\u5199\uff0c\u6bcf\u591a\u4e00\u4e2a\u5361\u724c\u90fd\u8981\u91cd\u65b0\u5199\u4e00\u4e0bClone\u51fd\u6570\uff0c\u6b64\u65f6\u5c31\u53ef\u4ee5\u901a\u8fc7CRTP\uff0c\u8868\u8fbe\u5361\u724c\u62e5\u6709\u590d\u5236\u81ea\u8eab\u5230\u80fd\u529b\uff0c\u6765\u5b9e\u73b0",(0,a.kt)("strong",{parentName:"p"},"\u591a\u4e2a\u7c7b\u6709\u76f8\u4f3c\u51fd\u6570\u7684\u7b80\u5316\u5199\u6cd5")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"template<typename Derived>\n    struct Card {\n        Derived Clone() {\n            return Derived(*static_cast<Derived *>(this));\n        };\n    };\n\n    struct CardA : public Card<CardA> {\n        int a = 1;\n    };\n\n    struct CardB : public Card<CardA> {\n        float b = 1;\n    };\n    \n    void f(){\n        CardA a;\n        auto a1 = a.Clone();\n    }\n")),(0,a.kt)("p",null,"\u8fd9\u79cd\u65b9\u5f0f\u975e\u5e38\u5e38\u89c1\uff0c\u5404\u79cd\u5f00\u6e90\u9879\u76ee\u4e2d\u90fd\u6709\u51fa\u73b0\uff0c\u6bd4\u5982UE\u7684TCommands"),(0,a.kt)("p",null,"\u518d\u6765\u4e00\u4e2a\u4f53\u73b0CRTP\u591a\u6001\u8bed\u4e49\u7684\u4f8b\u5b50"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"namespace CRTP {\n    template<typename Derived>\n    struct IShape {\n        float Area() {\n            return dynamic_cast<Derived *>(this)->Area();\n        }\n    };\n\n    struct Circle : public IShape<Circle> {\n        float r = 1;\n\n        float Area() {\n            return 3.14f * r * r;\n        }\n    };\n\n    struct Rect : public IShape<Rect> {\n        float a = 1, b = 1;\n\n        float Area() {\n            return a * b;\n        }\n    };\n\n    void f() {\n        Circle circle;\n        Rect rect;\n        std::cout << circle.Area() << rect.Area();\n    }\n}\n")),(0,a.kt)("p",null,"\u540c\u6837\u7684\uff0c\u8fd9\u6837\u7684\u591a\u6001\u4e5f\u662f\u63d0\u4f9b\u4e0d\u4e86\u5f02\u8d28\u5bb9\u5668\u904d\u5386"),(0,a.kt)("h3",{id:"\u7528variant\u6539\u9020\u9759\u6001\u591a\u6001"},"\u7528Variant\u6539\u9020\u9759\u6001\u591a\u6001"),(0,a.kt)("p",null,"\u901a\u8fc7Variant\uff0c\u5c31\u53ef\u4ee5\u5f3a\u884c\u8d4b\u4e88\u4e24\u79cd\u9759\u6001\u591a\u6001",(0,a.kt)("strong",{parentName:"p"},"\u5f02\u8d28\u5bb9\u5668\u904d\u5386"),"\uff0c \u867d\u7136\u597d\u50cf\u6ca1\u89c1\u54ea\u4e2a\u5f00\u6e90\u8f6f\u4ef6\u8fd9\u6837\u5199\u8fc7\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"namespace NormalVariant {\n    struct Circle {\n        float r = 1;\n\n        float Area() const {\n            return 3.14f * r * r;\n        }\n    };\n\n    struct Rect {\n        float a = 1, b = 1;\n\n        float Area() const {\n            return a * b;\n        }\n    };\n\n    template<typename Shape>\n    float Area(const Shape &shape) {\n        return shape.Area();\n    }\n\n    void f() {\n        std::variant<Circle, Rect> shape;\n        std::vector<std::variant<Circle, Rect>> ShapeList;\n        for (const auto &item: ShapeList) {\n            std::visit([](auto &&arg) {\n                std::cout << Area(arg);\n            }, item);\n        }\n    }\n}\n")),(0,a.kt)("p",null,"\u601d\u8003\u4e00\u4e0b\u8fd9\u6709\u4ec0\u4e48\u7f3a\u70b9\u5bfc\u81f4\u6ca1\u4ec0\u4e48\u4eba\u7528\uff08\u731c\u6d4b\uff09"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"variant\u4fdd\u5b58data\u6307\u9488\u548c\u989d\u5916\u7684\u4e00\u4e2aint Index\u6307\u793a\u5f53\u524d\u5b58\u50a8\u7684\u7c7b\u578b, \u5185\u5b58\u5f00\u9500\u66f4\u5927"),(0,a.kt)("li",{parentName:"ol"},"visit\u5199\u6cd5\u8ba9\u4eba\u5206\u89e3\uff0c\u4eff\u51fd\u6570\u4e5f\u4e0d\u4fbf\u4e8edebug")))}d.isMDXComponent=!0}}]);