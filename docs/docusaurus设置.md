---
sidebar_position: 4
---

# Tips
## Typora和docusaurus注意点
* docusaurus blog里不支持jsx渲染，图片必须用markdown格式；而Typora中截屏的图片粘贴过来本身是markdown格式的，但如果后面设定了缩放，就会自动转为jsx html格式，下面写了一个jsx2md的python脚本
* 注意把typora图片存放位置路径改为相对路径，比如`/asset/xxx.png`
* Typora笔记想放进博客时，直接把md和相应的asset拖过来就可以了
```python
import sys
import re

'''
convert every string like
<img src="/Volumes/disk2/notebooks/C++/parallel101/assets/image-20230122235653250.png" alt="image-20230122235653250" style="zoom:50%;" />
to string like
![](/Volumes/disk2/notebooks/C++/parallel101/assets/image-20230122235653250.png)
'''

file_path = "/Volumes/disk2/notebooks/C++/parallel101/notebook.md"

def jsx2md():
    with open(file_path, 'r') as file:
        text = file.read()
        # define the regular expression pattern to search for
        pattern = r'<img src="([^"]+)"[^>]*>'
        # use re.sub() to replace matches with the desired format
        result = re.sub(pattern, r'![](\g<1>)', text)

        img_regex = re.compile(pattern)
        img_matches = img_regex.findall(text)

        print(img_matches)
        print(len(img_matches))
        print(result)


def main():
    jsx2md()

if __name__ == "__main__":
    main()
```
## 文章截断
```<!--truncate-->```

## 代码高亮
注意c++要写成cpp，否则不会高亮，而typora里c++和cpp都可以

## 部署
npm run deploy