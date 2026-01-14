// 游戏状态
const gameState = {
  gridSize: 9,
  cat: { row: 4, col: 4 },
  blocks: new Set(),
  gameOver: false,
  result: null,
  isMoving: false
};

// DOM 元素
const gridEl = document.getElementById('grid');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
let catEl = null;

// 初始化游戏
function init() {
  gameState.cat = { row: 4, col: 4 };
  gameState.blocks = generateInitialBlocks(gameState.gridSize, gameState.cat, 8);
  gameState.gameOver = false;
  gameState.result = null;
  gameState.isMoving = false;

  messageEl.textContent = '';
  messageEl.className = 'message';

  createGrid();
  createCat();
  renderGrid();
}

// 创建网格 DOM
function createGrid() {
  gridEl.innerHTML = '';

  for (let row = 0; row < gameState.gridSize; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';

    for (let col = 0; col < gameState.gridSize; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', () => handleClick(row, col));
      rowEl.appendChild(cell);
    }

    gridEl.appendChild(rowEl);
  }
}

// 创建小猫元素
function createCat() {
  // 移除旧的猫咪元素
  if (catEl) {
    catEl.remove();
  }

  catEl = document.createElement('div');
  catEl.id = 'cat';
  gridEl.appendChild(catEl);

  // 设置初始位置
  updateCatPosition(false);
}

// 获取格子的中心位置
function getCellCenter(row, col) {
  const cell = gridEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return { x: 0, y: 0 };

  const gridRect = gridEl.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  return {
    x: cellRect.left - gridRect.left + cellRect.width / 2 - 16,
    y: cellRect.top - gridRect.top + cellRect.height / 2 - 16
  };
}

// 更新猫咪位置
function updateCatPosition(animate = true) {
  const pos = getCellCenter(gameState.cat.row, gameState.cat.col);

  if (animate) {
    catEl.classList.add('jumping');
    setTimeout(() => {
      catEl.classList.remove('jumping');
    }, 300);
  }

  catEl.style.left = pos.x + 'px';
  catEl.style.top = pos.y + 'px';
}

// 渲染网格状态
function renderGrid() {
  const cells = gridEl.querySelectorAll('.cell');

  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const key = `${row},${col}`;

    cell.classList.remove('blocked');

    if (gameState.blocks.has(key)) {
      cell.classList.add('blocked');
    }
  });
}

// 处理点击事件
function handleClick(row, col) {
  if (gameState.gameOver || gameState.isMoving) return;

  const key = `${row},${col}`;

  // 不能点击已有障碍物或小猫位置
  if (gameState.blocks.has(key)) return;
  if (row === gameState.cat.row && col === gameState.cat.col) return;

  // 放置障碍物
  gameState.blocks.add(key);
  renderGrid();

  // 小猫移动
  gameState.isMoving = true;
  setTimeout(() => {
    moveCat();
  }, 150);
}

// 移动小猫
function moveCat() {
  const bestMove = findBestMove(gameState.cat, gameState.blocks, gameState.gridSize);

  if (bestMove === null) {
    // 无路可逃，玩家获胜
    gameState.gameOver = true;
    gameState.result = 'win';
    gameState.isMoving = false;

    // 被困动画
    catEl.classList.add('trapped');
    setTimeout(() => {
      showMessage('你赢了！成功围住小猫！', 'win');
    }, 500);
    return;
  }

  // 移动小猫
  gameState.cat = bestMove;
  updateCatPosition(true);

  // 检查是否到达边界
  if (isEdge(gameState.cat, gameState.gridSize)) {
    gameState.gameOver = true;
    gameState.result = 'lose';

    // 延迟一点执行逃跑动画，让跳跃动画先完成
    setTimeout(() => {
      playCatEscapeAnimation();
    }, 200);
  } else {
    gameState.isMoving = false;
  }
}

// 播放小猫逃跑动画
function playCatEscapeAnimation() {
  const { row, col } = gameState.cat;
  const gridSize = gameState.gridSize;

  // 根据逃跑方向选择动画
  let escapeClass = 'escape-right';

  if (row === 0) {
    escapeClass = 'escape-up';
  } else if (row === gridSize - 1) {
    escapeClass = 'escape-down';
  } else if (col === 0) {
    escapeClass = 'escape-left';
  } else if (col === gridSize - 1) {
    escapeClass = 'escape-right';
  }

  catEl.classList.add(escapeClass);

  setTimeout(() => {
    showMessage('小猫逃跑了！', 'lose');
    gameState.isMoving = false;
  }, 600);
}

// 显示消息
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

// 生成初始障碍物
function generateInitialBlocks(gridSize, catPos, count) {
  const blocks = new Set();

  while (blocks.size < count) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    const key = `${row},${col}`;

    // 不能是小猫位置
    if (row !== catPos.row || col !== catPos.col) {
      // 不能是小猫的直接邻居（给玩家一些挑战空间）
      const neighbors = getNeighbors(catPos.row, catPos.col, gridSize);
      const isNeighbor = neighbors.some(n => n.row === row && n.col === col);

      if (!isNeighbor && !blocks.has(key)) {
        blocks.add(key);
      }
    }
  }

  return blocks;
}

// 获取六边形邻居
function getNeighbors(row, col, gridSize) {
  const isOddRow = row % 2 === 1;
  const offsets = isOddRow
    ? [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]]
    : [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]];

  return offsets
    .map(([dc, dr]) => ({ row: row + dr, col: col + dc }))
    .filter(pos => isValidPosition(pos, gridSize));
}

// 检查位置是否有效
function isValidPosition(pos, gridSize) {
  return pos.row >= 0 && pos.row < gridSize &&
         pos.col >= 0 && pos.col < gridSize;
}

// 检查是否在边界
function isEdge(pos, gridSize) {
  return pos.row === 0 ||
         pos.row === gridSize - 1 ||
         pos.col === 0 ||
         pos.col === gridSize - 1;
}

// BFS 寻找最佳移动
function findBestMove(catPos, blocks, gridSize) {
  const queue = [{ pos: catPos, firstStep: null }];
  const visited = new Set([`${catPos.row},${catPos.col}`]);

  while (queue.length > 0) {
    const { pos, firstStep } = queue.shift();

    // 到达边界，返回第一步
    if (isEdge(pos, gridSize) && firstStep !== null) {
      return firstStep;
    }

    // 遍历邻居
    for (const neighbor of getNeighbors(pos.row, pos.col, gridSize)) {
      const key = `${neighbor.row},${neighbor.col}`;

      if (!visited.has(key) && !blocks.has(key)) {
        visited.add(key);
        queue.push({
          pos: neighbor,
          firstStep: firstStep || neighbor
        });
      }
    }
  }

  // 无路可逃
  return null;
}

// 重置按钮事件
resetBtn.addEventListener('click', init);

// 窗口大小改变时更新猫咪位置
window.addEventListener('resize', () => {
  if (catEl && !gameState.gameOver) {
    updateCatPosition(false);
  }
});

// 启动游戏
init();
