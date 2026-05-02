/**
 * htmlToContentNodes — Legacy HTML → ContentNode[] adapter
 *
 * Parses Bootstrap-flavoured HTML strings from the legacy CDN
 * course format (aptis-course.json subheading fields) into the
 * schema v2 ContentNode tree that TheoryBlock requires.
 *
 * The runtime (UnitView / BlockRenderer / TheoryBlockView) ONLY
 * understands ContentNode trees. This module is the boundary
 * that keeps raw HTML out of the rendering layer.
 *
 * Supports:
 *   h1–h6 → HeadingNode
 *   p     → ParagraphNode
 *   div   → flattened block children (or ParagraphNode if leaf)
 *   ul    → ListNode { ordered: false }
 *   ol    → ListNode { ordered: true }
 *   li    → ListItemNode
 *   table → TableNode
 *   br    → newline in parent's inline children
 *   strong, b   → bold mark
 *   em, i       → italic mark
 *   u           → underline mark
 *   span[style*=color] → color mark
 *   img         → ImageNode
 *
 * Fallback: if DOMParser is unavailable (SSR / test env) or
 * parsing fails, strips all HTML tags and returns a single
 * ParagraphNode containing the plain text.
 *
 * @module htmlToContentNodes
 */

// ── Inline helpers ────────────────────────────────────────────

/**
 * Extracts a CSS color value from an inline style string.
 * Returns null if no color found.
 *
 * @param {string} style
 * @returns {string | null}
 */
function extractColor(style) {
  const m = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)
  return m ? m[1].trim() : null
}

/**
 * Merges a new mark into an existing marks array.
 * Returns a new array — does not mutate the input.
 *
 * @param {Array} marks
 * @param {Object} mark
 * @returns {Array}
 */
function withMark(marks, mark) {
  return [...marks, mark]
}

/**
 * Walks a DOM node's children and collects InlineText spans,
 * inheriting marks from parent inline elements.
 *
 * @param {Node} node
 * @param {Array} inheritedMarks
 * @returns {Array<{ text: string, marks?: Array }>}
 */
function extractInlineChildren(node, inheritedMarks) {
  const spans = []

  for (const child of node.childNodes) {
    if (child.nodeType === 3 /* TEXT_NODE */) {
      const text = child.textContent || ''
      if (!text) continue
      const item = { text }
      if (inheritedMarks.length > 0) item.marks = inheritedMarks
      spans.push(item)
      continue
    }

    if (child.nodeType !== 1 /* ELEMENT_NODE */) continue

    const tag = child.tagName.toLowerCase()
    let marks = inheritedMarks

    if (tag === 'strong' || tag === 'b') {
      marks = withMark(marks, { type: 'bold' })
    } else if (tag === 'em' || tag === 'i') {
      marks = withMark(marks, { type: 'italic' })
    } else if (tag === 'u') {
      marks = withMark(marks, { type: 'underline' })
    } else if (tag === 'span') {
      const style = child.getAttribute('style') || ''
      const color = extractColor(style)
      if (color) marks = withMark(marks, { type: 'color', value: color })
    } else if (tag === 'br') {
      spans.push({ text: '\n' })
      continue
    }

    // Recurse into inline container — img handled separately below
    if (tag === 'img') {
      // Images inside inline context are skipped here;
      // extractBlockNodes handles img at block level
      continue
    }

    spans.push(...extractInlineChildren(child, marks))
  }

  return spans
}

// ── Block node extraction ─────────────────────────────────────

/**
 * Tests whether a DOM element contains only inline content
 * (no block-level children such as p, div, ul, ol, table).
 *
 * @param {Element} el
 * @returns {boolean}
 */
function isLeafBlock(el) {
  const BLOCK_TAGS = new Set(['p', 'div', 'ul', 'ol', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'])
  for (const child of el.childNodes) {
    if (child.nodeType === 1 && BLOCK_TAGS.has(child.tagName.toLowerCase())) {
      return false
    }
  }
  return true
}

/**
 * Builds a ParagraphNode from a DOM element's inline content.
 *
 * @param {Element} el
 * @returns {{ type: 'paragraph', children: Array }}
 */
function toParagraphNode(el) {
  const children = extractInlineChildren(el, [])
  if (children.length === 0) return null
  return { type: 'paragraph', children }
}

/**
 * Builds a HeadingNode from an h1–h6 element.
 *
 * @param {Element} el
 * @param {1|2|3|4|5|6} level
 * @returns {{ type: 'heading', level: number, children: Array }}
 */
function toHeadingNode(el, level) {
  const children = extractInlineChildren(el, [])
  if (children.length === 0) return null
  return { type: 'heading', level, children }
}

/**
 * Builds a ListNode from a ul or ol element.
 *
 * @param {Element} el
 * @param {boolean} ordered
 * @returns {{ type: 'list', ordered: boolean, items: Array }}
 */
function toListNode(el, ordered) {
  const items = []
  for (const child of el.children) {
    if (child.tagName.toLowerCase() !== 'li') continue
    const children = extractInlineChildren(child, [])
    if (children.length > 0) {
      items.push({ type: 'list_item', children })
    }
  }
  if (items.length === 0) return null
  return { type: 'list', ordered, items }
}

/**
 * Builds a TableNode from a table element.
 *
 * @param {Element} el
 * @returns {{ type: 'table', rows: Array }}
 */
function toTableNode(el) {
  const rows = []
  const trElements = el.querySelectorAll('tr')
  for (const tr of trElements) {
    const cells = []
    for (const cell of tr.querySelectorAll('td, th')) {
      const children = extractInlineChildren(cell, [])
      cells.push({
        type: 'table_cell',
        children: children.length > 0 ? children : [{ text: '' }]
      })
    }
    if (cells.length > 0) {
      rows.push({ type: 'table_row', cells })
    }
  }
  if (rows.length === 0) return null
  return { type: 'table', rows }
}

/**
 * Recursively extracts block-level ContentNodes from a DOM element.
 *
 * @param {Element} el
 * @returns {Array}
 */
function extractBlockNodes(el) {
  const nodes = []

  for (const child of el.childNodes) {
    if (child.nodeType === 3 /* TEXT_NODE */) {
      const text = (child.textContent || '').trim()
      if (text) nodes.push({ type: 'paragraph', children: [{ text }] })
      continue
    }

    if (child.nodeType !== 1 /* ELEMENT_NODE */) continue

    const tag = child.tagName.toLowerCase()

    if (tag === 'h1') { const n = toHeadingNode(child, 1); if (n) nodes.push(n); continue }
    if (tag === 'h2') { const n = toHeadingNode(child, 2); if (n) nodes.push(n); continue }
    if (tag === 'h3') { const n = toHeadingNode(child, 3); if (n) nodes.push(n); continue }
    if (tag === 'h4') { const n = toHeadingNode(child, 4); if (n) nodes.push(n); continue }
    if (tag === 'h5') { const n = toHeadingNode(child, 5); if (n) nodes.push(n); continue }
    if (tag === 'h6') { const n = toHeadingNode(child, 6); if (n) nodes.push(n); continue }

    if (tag === 'p') {
      const n = toParagraphNode(child)
      if (n) nodes.push(n)
      continue
    }

    if (tag === 'ul') { const n = toListNode(child, false); if (n) nodes.push(n); continue }
    if (tag === 'ol') { const n = toListNode(child, true); if (n) nodes.push(n); continue }
    if (tag === 'table') { const n = toTableNode(child); if (n) nodes.push(n); continue }

    if (tag === 'br') {
      // top-level <br> — skip (meaningful only inside inline context)
      continue
    }

    if (tag === 'img') {
      const src = child.getAttribute('src') || ''
      if (src) {
        nodes.push({
          type: 'image',
          src,
          alt: child.getAttribute('alt') || ''
        })
      }
      continue
    }

    if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'span') {
      if (isLeafBlock(child)) {
        // Treat as paragraph-like leaf
        const n = toParagraphNode(child)
        if (n) nodes.push(n)
      } else {
        // Recurse into container divs
        nodes.push(...extractBlockNodes(child))
      }
      continue
    }

    // Inline elements at block level (strong, em, a, etc.) — wrap in paragraph
    const inlined = extractInlineChildren(child, [])
    if (inlined.length > 0) {
      nodes.push({ type: 'paragraph', children: inlined })
    }
  }

  return nodes
}

// ── Public API ────────────────────────────────────────────────

/**
 * Strips all HTML tags from a string, leaving plain text.
 * Used as the fallback when DOMParser is unavailable.
 *
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim()
}

/**
 * Parses a legacy HTML string into a ContentNode array.
 *
 * This is the ONLY place in the codebase that converts raw HTML
 * from the legacy CDN format into the schema v2 content tree.
 * All callers are in the adapter layer — never in the runtime.
 *
 * @param {string} html - Raw HTML string from legacy CDN payload
 * @returns {import('schemas/course/content').ContentNode[]}
 */
export function htmlToContentNodes(html) {
  if (!html || typeof html !== 'string') {
    return [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  try {
    if (typeof DOMParser === 'undefined') {
      // Non-browser environment (Jest / Node) — strip tags
      const text = stripHtml(html)
      return [{ type: 'paragraph', children: [{ text: text || '' }] }]
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div id="root">${html}</div>`, 'text/html')
    const root = doc.getElementById('root')

    if (!root) throw new Error('parse root missing')

    const nodes = extractBlockNodes(root)
    return nodes.length > 0
      ? nodes
      : [{ type: 'paragraph', children: [{ text: stripHtml(html) }] }]
  } catch {
    // Fallback: plain text paragraph
    const text = stripHtml(html)
    return [{ type: 'paragraph', children: [{ text: text || '' }] }]
  }
}
