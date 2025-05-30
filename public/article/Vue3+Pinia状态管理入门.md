直到刚才，我脑子里冒出了一个想法，我确定了博客的大致方向，夜晚与白天的交织，加入大量的交互，如同rpg一样？

## 1 天堂与地狱
### 主题切换
以两个主题为主——天堂和地狱：



### 流体效果
我要怎么实现流体效果呢？
在网络中并没有找到比较好的案例，如此看来需要我自己进行相关的开创了。


>岩浆流体效果：先进行拆分
1. 从盒子上方流下然后流向两边
2. 当流向盒子范围后开始滴落
3. 已经流出去的流体会有起伏
4. 确定流体的总体积
5. 确定流体的速度
6. 流体的颜色


目前找到一个效果比较好的：[github](https://github.com/lukix/fluid-simulation?tab=readme-ov-file)


### 像素
我希望我的网站充满像素风，想要让ai生成像素的静态图片或者动图，但是效果总是差强人意，因此我选择~~不做人啦~~自己学习像素的绘制——[[aseprite]]。

**目前的成品**：
![[Pasted image 20250511220926.png]]


不能说十分出色，但是多少差强人意了。


### 拖拽功能
参考国外一个优秀的[网站](https://wodniack.dev)，本来想学习他的3D布局，但是目前还不知道怎么完美的添加这个功能，但是又不想这么简单的就放弃。突然灵光一现，向下兼容学习他的拖拽功能，为每个盒子添加这个功能。
![[新建 文本文档.html 和另外 7 个页面 - 个人 - Microsoft​ Edge 2025-05-11 22-14-19.mp4]]

当然，这个是chatgpt生成的，不过秉持着有ai不用是蠢蛋的原则，直接节省99%的时间。下面展示源码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    .container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 50px;
      perspective: 1000px;
    }

    .box {
      width: 120px;
      height: 120px;
      background: salmon;
      transform-style: preserve-3d;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      cursor: grab;
      user-select: none;
      transition: transform 0.2s ease;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="box" data-id="1">盒子 1</div>
  <div class="box" data-id="2">盒子 2</div>
  <div class="box" data-id="3">盒子 3</div>
</div>

<script>
  let isDragging = false;
  let currentBox = null;
  let startX = 0, startY = 0;
  let startAngle = { x: 0, y: 0 };

  const rotateMap = {};
  const maxAngle = 45;

  document.querySelectorAll('.box').forEach(box => {
    const id = box.dataset.id;
    rotateMap[id] = { x: 0, y: 0 };

    box.addEventListener('mousedown', (e) => {
      isDragging = true;
      currentBox = box;
      const id = box.dataset.id;

      startX = e.clientX;
      startY = e.clientY;
      startAngle = { ...rotateMap[id] };

      box.style.transition = 'none';
      box.style.cursor = 'grabbing';
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentBox) return;
    const id = currentBox.dataset.id;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // 鼠标移动映射为角度变化（缩放比例）
    const sensitivity = 0.4;
    let rotateX = startAngle.x + deltaY * sensitivity;
    let rotateY = startAngle.y + deltaX * sensitivity;

    // 限制角度范围
    rotateX = Math.max(-maxAngle, Math.min(maxAngle, rotateX));
    rotateY = Math.max(-maxAngle, Math.min(maxAngle, rotateY));

    rotateMap[id] = { x: rotateX, y: rotateY };
    currentBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!currentBox) return;
    const id = currentBox.dataset.id;

    isDragging = false;
    currentBox.style.cursor = 'grab';
    currentBox.style.transition = 'transform 0.4s ease';

    // 复位
    rotateMap[id] = { x: 0, y: 0 };
    currentBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
    currentBox = null;
  });
</script>
</body>
</html>

```

<mark style="background: #FF5582A6;">上面这个便是视频里展示的源码</mark>，但是这个并不能自动化为盒子添加`index`也就是`data-id='num'`，因此需要添加下面的代码：
```js
document.querySelectorAll('.box').forEach((box, index) => {
  const id = index.toString(); // 自动生成 ID（从 "0" 开始）
  box.dataset.id = id;         // 设置 data-id 属性
  rotateMap[id] = { x: 0, y: 0 };

  box.addEventListener('mousedown', (e) => {
    isDragging = true;
    currentBox = box;

    startX = e.clientX;
    startY = e.clientY;
    startAngle = { ...rotateMap[id] };

    box.style.transition = 'none';
    box.style.cursor = 'grabbing';
  });
});
```

#### 步骤总结
**其实就两个细节**：
1. 为需要该功能的盒子添加上一个统一的样式，并在样式中写上：
```css
%% 目标盒子 %%
transform:preserve-3d;

%% 目标盒子的父盒子 %%
perspective:1000px;
上面这个相当于3D的视角距离，距离越远效果越好。
```

2. 在js中加入下面这段代码即可，只需要改动一个地方就行了，由于代码框里不好标记，因此在这里提一嘴，`  const boxes = document.querySelectorAll('.home-box')`这里的盒子类名更改一下就行了：
```js
let isDragging = false;
let currentBox = null;
let startX = 0, startY = 0;
let startAngle = { x: 0, y: 0 };

const rotateMap = {};
const maxAngle = 45;

onMounted(() => {
  const boxes = document.querySelectorAll('.home-box')
  boxes.forEach((box, index) => {
    const id = index.toString()
    box.dataset.id = id
    rotateMap[id] = { x: 0, y: 0 }

    box.addEventListener('mousedown', (e) => {
      isDragging = true
      currentBox = box
      startX = e.clientX
      startY = e.clientY
      startAngle = { ...rotateMap[id] }

      box.style.transition = 'none'
      box.style.cursor = 'grabbing'
    })
  })
})

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentBox) return;
    const id = currentBox.dataset.id;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // 鼠标移动映射为角度变化（缩放比例）
const sensitivity = 0.4;
let rotateX = startAngle.x - deltaY * sensitivity; // ← 修正了方向
let rotateY = startAngle.y + deltaX * sensitivity;


    // 限制角度范围
    rotateX = Math.max(-maxAngle, Math.min(maxAngle, rotateX));
    rotateY = Math.max(-maxAngle, Math.min(maxAngle, rotateY));

    rotateMap[id] = { x: rotateX, y: rotateY };
    currentBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener('mouseup', () => {
    if (!currentBox) return;
    const id = currentBox.dataset.id;

    isDragging = false;
    currentBox.style.cursor = 'grab';
    currentBox.style.transition = 'transform 0.4s ease';

    // 复位
    rotateMap[id] = { x: 0, y: 0 };
    currentBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
    currentBox = null;
  });

```

而下面则是添加后的效果：
![[Vite App 和另外 4 个页面 - 个人 - Microsoft​ Edge 2025-05-11 22-48-55.mp4]]

虽然成功实现了，但是我还是感觉到了一点不适感。不过没有内容因此效果不够明显，等待之后添加了内容后，再进行适当的修改。

#### 思路分解
1. 首先对盒子绑定`点击事件`，本篇选择的是：
```js
const boxes=document.querySelectorAll('.home-box')  //绑定盒子
boxes.forEach((box,index) =>{
	const id=index.toString();    //自动生成id
	box.dataset.id=id;           //分配id
	rotateMap[id]={x:0,y:0};
})
```

2. 然后对盒子绑定`移动事件`：
```js

```


#### 问题查找
时间坐标是上面这段内容写下的第二天早上。此时再对该旋转做实验，发现从盒子内部拖拽的旋转有问题，而且只有从左到右有问题，目前问题仍待研究。
这个点很奇怪，我单独运行chatgpt代码的时候没有类似的问题，但是运行于我的博客中的时候，问题就出现了，目前仍待研究。

~~通过对比，问题可能出现在绑定盒子部分。~~
~~但是经过测试，问题也不是出现在这个地方。~~

~~经过第二次测试，发现是因为有类似绝对值的东西？但是目前需要完成其他任务，暂时停更。~~

<mark style="background: #FF5582A6;">最后一次测试，终于成功解决问题：我父级没有设置`preserve-3d`!!!!!</mark>
我给其父级的父级设置了，但没有给父级设置。






### 传送门
在我花费半天时间，结合chatgpt，终于完成了传送门的制作（虽然不够好，但差不多了）
![[portal.gif]]

我的设想是，当鼠标悬浮于图片之上时，会显现出传送门后面的内容，根据天堂还是地狱更改后面的内容。

点击后会传送到内容的地点。


#### 传送门内容（施工中）
