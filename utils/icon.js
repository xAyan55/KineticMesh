/**
 * Server-side Lucide icon renderer for EJS views.
 * Exact adaptation of Airlink's src/utils/icon.ts
 *
 * Usage in EJS:
 *   <%- icon('server', { class: 'w-4 h-4' }) %>
 *   <%- icon('play', { size: 14 }) %>
 */

const lucide = require('lucide');

function toPascalCase(name) {
  if (!name) return '';
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
    .join(' ');
}

function renderNode([tag, attrs, children]) {
  const attrStr = attrsToString(attrs);
  if (!children || children.length === 0) {
    return `<${tag} ${attrStr}/>`;
  }
  const inner = children.map(renderNode).join('');
  return `<${tag} ${attrStr}>${inner}</${tag}>`;
}

function icon(name, opts = {}) {
  const key = toPascalCase(name);
  const iconData = lucide[key];

  if (!iconData || !Array.isArray(iconData)) {
    return `<span class="${opts.class || ''}"></span>`;
  }

  const width = opts.width || opts.size || 16;
  const height = opts.height || opts.size || 16;
  const strokeWidth = opts.strokeWidth || 1.5;

  const topAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };

  if (opts.id) topAttrs.id = opts.id;
  if (opts.class) topAttrs.class = opts.class;
  if (opts.style) topAttrs.style = opts.style;
  if (opts.label) {
    topAttrs['aria-label'] = opts.label;
    topAttrs.role = 'img';
  } else {
    topAttrs['aria-hidden'] = 'true';
  }

  const inner = iconData.map(renderNode).join('');
  return `<svg ${attrsToString(topAttrs)}>${inner}</svg>`;
}

module.exports = { icon };
