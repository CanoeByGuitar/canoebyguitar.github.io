# 博客使用
notebook项目和blog项目分离两个仓库，定期从notebook整理进bolg

bolg启动
```cpp
// local
npm run build
npm run serve

// deploy
npm run build
npm run deploy  // 这是把static网页推到gh-page分支
git add .
git commit -m "."
git push
```
