/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
function renderMindMap(text) {
  var scriptTag = document.getElementById('myScript');
  scriptTag.text = text;
  window.markmap.autoLoader.renderAll();

  // markmap.autoLoader.renderAll() 分两阶段：
  // 1. 初始阶段：节点先聚在 (0,0)，此时 getBBox() 已非零（只含文字尺寸）
  // 2. 布局阶段：计算树形结构后节点扩散，getBBox() 持续增大直到稳定
  // 策略：连续 STABLE_REQUIRED 次检测 getBBox() 不再变化，才认为布局完成。
  var attempts = 0;
  var MAX_ATTEMPTS = 50; // 最多等 5 秒 (50 × 100ms)
  var STABLE_REQUIRED = 3; // 连续 3 次（300ms）无变化视为稳定
  var stableCount = 0;
  var lastW = 0;
  var lastH = 0;

  function checkRenderComplete() {
    var svg = document.querySelector('svg.markmap');
    var bbox = svg ? svg.getBBox() : { width: 0, height: 0 };

    if (bbox.width > 0 && bbox.height > 0) {
      var deltaW = Math.abs(bbox.width - lastW);
      var deltaH = Math.abs(bbox.height - lastH);
      if (deltaW < 1 && deltaH < 1) {
        stableCount++;
        if (stableCount >= STABLE_REQUIRED) {
          // 布局已稳定，通知原生开始导出
          window.ty.miniProgram.postMessage({ data: { action: 'render_complete' } });
          return;
        }
      } else {
        // 尺寸仍在变化，重置稳定计数
        stableCount = 0;
      }
    }

    lastW = bbox.width;
    lastH = bbox.height;
    attempts++;

    if (attempts >= MAX_ATTEMPTS) {
      // 超时兜底
      window.ty.miniProgram.postMessage({ data: { action: 'render_complete' } });
      return;
    }
    setTimeout(checkRenderComplete, 100);
  }
  // 直接开始检查，checkRenderComplete 内部已处理 SVG 不存在的情况
  checkRenderComplete();
}

function setTheme(theme) {
  var mindDom = document.getElementById('mindMapContainer');
  mindDom.style.backgroundColor = theme === 'dark' ? '#000' : '#fff';
  mindDom.style.color = theme === 'dark' ? '#fff' : '#000';
}

/**
 * 将原始 SVG 所有子元素的 computed style 内联到克隆节点上。
 *
 * 问题背景：markmap 通过 CSS class（如 .markmap-link）给连接线设置颜色，
 * cloneNode(true) 只复制 DOM 结构，不携带外部样式表，序列化后 class 失效，
 * 路径 stroke/fill 回退为浏览器默认值（黑色），导致连接线出现黑色区域。
 * 解决：遍历原始节点，用 getComputedStyle 读取实际渲染值，写入克隆节点的 style。
 */
function inlineComputedStyles(originalSvg, clonedSvg) {
  var PROPS = [
    'fill',
    'fill-opacity',
    'stroke',
    'stroke-width',
    'stroke-opacity',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-dasharray',
    'opacity',
    'font-size',
    'font-family',
    'font-weight',
    'font-style',
    'text-anchor',
    'dominant-baseline',
  ];
  var origEls = originalSvg.querySelectorAll('*');
  var cloneEls = clonedSvg.querySelectorAll('*');
  for (var i = 0; i < origEls.length; i++) {
    if (!cloneEls[i]) break;
    try {
      var computed = window.getComputedStyle(origEls[i]);
      for (var j = 0; j < PROPS.length; j++) {
        var val = computed.getPropertyValue(PROPS[j]);
        if (val) cloneEls[i].style.setProperty(PROPS[j], val);
      }
    } catch (e) {
      //
    }
  }
}

/**
 * 与 exportMindMapAsBase64 逻辑相同，但会在底部追加品牌条（logo + 二维码）。
 * @param {string} logoUrl  - logo 图片 URL（可为空）
 * @param {string} qrUrl    - 二维码图片 URL（可为空）
 * @param {string} brandText - 品牌文字（默认 'AI 笔记'）
 * @param {string} brandDescText - 品牌描述文字（显示在 brandText 下方）
 */
function exportWithBranding(logoUrl, qrUrl, brandText, brandDescText) {
  var svg = document.querySelector('svg.markmap');
  if (!svg) {
    window.ty.miniProgram.postMessage({
      data: { action: 'export_image_error', msg: 'SVG not found' },
    });
    return;
  }

  var bgColor = document.getElementById('mindMapContainer').style.backgroundColor || '#ffffff';
  var bbox = svg.getBBox();
  var padding = 24;
  var contentW = Math.ceil(bbox.width) + padding * 2;
  var contentH = Math.ceil(bbox.height) + padding * 2;
  var brandingH = 20; // 品牌条高度（px，未 scale）
  var brandingW = 70; // 品牌条固定宽度（px，未 scale）
  var bottomMargin = 10; // 品牌条距离底部距离（px，未 scale）
  var scale = 6;

  // 检查是否所有品牌参数都为空
  var hasBranding = !!(logoUrl || qrUrl || brandText || brandDescText);

  var svgClone = svg.cloneNode(true);
  inlineComputedStyles(svg, svgClone);
  svgClone.setAttribute('width', contentW);
  svgClone.setAttribute('height', contentH);
  svgClone.setAttribute(
    'viewBox',
    bbox.x - padding + ' ' + (bbox.y - padding) + ' ' + contentW + ' ' + contentH
  );

  var serializer = new XMLSerializer();
  var svgStr = serializer.serializeToString(svgClone);
  if (svgStr.indexOf('xmlns=') === -1) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  var canvas = document.createElement('canvas');
  canvas.width = contentW * scale;
  // 如果不需要品牌条，canvas 高度只包含内容高度
  canvas.height = hasBranding ? (contentH + bottomMargin + brandingH) * scale : contentH * scale;
  var ctx = canvas.getContext('2d');

  // 思维导图区域背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);

  var svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));

  var img = new Image();
  img.onload = function () {
    // 绘制思维导图
    ctx.drawImage(img, 0, 0, contentW, contentH);

    // 如果所有品牌参数都为空，跳过品牌条绘制
    if (!hasBranding) {
      var base64 = canvas.toDataURL('image/png');
      window.ty.miniProgram.postMessage({
        data: { action: 'export_image_result', base64, t: new Date().getTime() },
      });
      return;
    }

    // ── 品牌条 ──────────────────────────────────────────
    // 计算品牌条的位置（居中，距离底部 20px）
    var brandingStartX = (contentW - brandingW) / 2;
    var brandingY = contentH;
    var borderRadius = 6; // 圆角半径

    // 先绘制底部区域为白色背景（铺满整个底部区域）
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, contentH, contentW, bottomMargin + brandingH);

    // 绘制圆角品牌条
    ctx.fillStyle = '#E6EFFB'; // 浅色背景
    ctx.beginPath();
    ctx.moveTo(brandingStartX + borderRadius, brandingY);
    ctx.lineTo(brandingStartX + brandingW - borderRadius, brandingY);
    ctx.quadraticCurveTo(
      brandingStartX + brandingW,
      brandingY,
      brandingStartX + brandingW,
      brandingY + borderRadius
    );
    ctx.lineTo(brandingStartX + brandingW, brandingY + brandingH - borderRadius);
    ctx.quadraticCurveTo(
      brandingStartX + brandingW,
      brandingY + brandingH,
      brandingStartX + brandingW - borderRadius,
      brandingY + brandingH
    );
    ctx.lineTo(brandingStartX + borderRadius, brandingY + brandingH);
    ctx.quadraticCurveTo(
      brandingStartX,
      brandingY + brandingH,
      brandingStartX,
      brandingY + brandingH - borderRadius
    );
    ctx.lineTo(brandingStartX, brandingY + borderRadius);
    ctx.quadraticCurveTo(brandingStartX, brandingY, brandingStartX + borderRadius, brandingY);
    ctx.closePath();
    ctx.fill();

    // 分割线（在品牌条顶部）
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 0.5 / scale; // 抵消 scale，保持视觉 0.5px
    ctx.beginPath();
    ctx.moveTo(brandingStartX, brandingY);
    ctx.lineTo(brandingStartX + brandingW, brandingY);
    ctx.stroke();

    // 计算三个元素的尺寸和位置，使整体居中
    var logoSize = logoUrl ? brandingH * 0.5 : 0;
    var qrSize = qrUrl ? brandingH * 0.6 : 0;
    var labelText = brandText || '';
    var descText = brandDescText || '';
    var spacing = 4; // 元素之间的间距

    // 测量文字宽度
    ctx.fillStyle = '#333333';
    ctx.font = '4px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var textWidth1 = labelText ? ctx.measureText(labelText).width : 0;
    var textWidth2 = descText ? ctx.measureText(descText).width : 0;
    var textWidth = Math.max(textWidth1, textWidth2); // 取两行文字的最大宽度

    // 计算总宽度和起始位置（整体居中，包含间距）
    var hasLogo = logoSize > 0;
    var hasText = textWidth > 0;
    var hasQr = qrSize > 0;
    var spacing1 = hasLogo && hasText ? spacing : 0; // logo 和文字之间的间距
    var spacing2 = hasText && hasQr ? spacing : hasLogo && hasQr ? spacing : 0; // 文字和二维码之间的间距，或 logo 和二维码之间的间距（当没有文字时）
    var startX = brandingStartX + spacing; // 在品牌条内居中
    var centerY = brandingY + brandingH / 2;
    var logoPadY = logoSize > 0 ? (brandingH - logoSize) / 2 : 0;
    var qrPadY = qrSize > 0 ? (brandingH - qrSize) / 2 : 0;

    // 计算文字区域的起始位置
    var textStartX = startX + logoSize + spacing1;

    // 计算两行文字的垂直位置（垂直居中）
    var lineHeight = 6; // 行高
    var textStartY = centerY - (labelText && descText ? lineHeight / 2 : 0);

    // 绘制品牌文字（在 logo 和 qr 之间）
    if (labelText) {
      ctx.fillText(labelText, textStartX, textStartY);
    }
    // 绘制品牌描述文字（在 brandText 下方）
    if (descText) {
      ctx.font = '3px sans-serif';
      var originalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = 0.5; // 设置透明度为 50%
      ctx.fillText(descText, textStartX, textStartY + lineHeight);
      ctx.globalAlpha = originalAlpha; // 恢复原来的透明度
    }

    // 追踪待加载图片数量，全部完成后再 toDataURL
    var pending = 0;
    function tryFinish() {
      if (pending > 0) return;
      // eslint-disable-next-line no-shadow
      var base64 = canvas.toDataURL('image/png');
      window.ty.miniProgram.postMessage({
        data: { action: 'export_image_result', base64: base64, t: new Date().getTime() },
      });
    }

    // logo（左侧，紧挨着文字）
    if (logoUrl) {
      pending++;
      var logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = function () {
        ctx.drawImage(logoImg, startX, brandingY + logoPadY, logoSize, logoSize);
        pending--;
        tryFinish();
      };
      logoImg.onerror = function () {
        pending--;
        tryFinish();
      };
      logoImg.src = logoUrl;
    }

    // 二维码（右侧，与文字间隔 6px）
    if (qrUrl) {
      pending++;
      var qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      var qrStartX = textStartX + textWidth + spacing2 * 2;
      qrImg.onload = function () {
        ctx.drawImage(qrImg, qrStartX, brandingY + qrPadY, qrSize, qrSize);
        pending--;
        tryFinish();
      };
      qrImg.onerror = function () {
        pending--;
        tryFinish();
      };
      qrImg.src = qrUrl;
    }

    if (pending === 0) tryFinish();
  };
  img.onerror = function () {
    window.ty.miniProgram.postMessage({
      data: { action: 'export_image_error', msg: 'Canvas render failed' },
    });
  };
  img.src = svgDataUrl;
}

// 接受来自逻辑层的消息
window.ty.miniProgram.onMessage(event => {
  console.log('=webview= onMessage', 'typeof event.data', typeof event.data, '\n', event.data);
  var msgData = event.data;
  if (typeof msgData == 'string') {
    msgData = JSON.parse(msgData);
  }
  switch (msgData.action) {
    case 'markdown_text':
      setTheme(msgData.theme);
      renderMindMap(msgData.text);
      break;
    case 'export_with_branding':
      exportWithBranding(
        msgData.logoUrl || '',
        msgData.qrUrl || '',
        msgData.brandText || '',
        msgData.brandDescText || ''
      );
      break;
    default:
      break;
  }
});

// 关闭
var clickBtnEl = document.getElementById('clickBtn');
clickBtnEl.onclick = () => {
  window.ty.miniProgram.postMessage({
    data: {
      action: 'close',
      t: new Date().getTime(),
    },
  });
};
