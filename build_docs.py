#!/usr/bin/env python3
"""Builds DOCUMENTATION.pdf — a styled walkthrough of the Verdant app."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    Preformatted, HRFlowable, KeepTogether, PageBreak, ListFlowable, ListItem,
    NextPageTemplate,
)
from reportlab.lib.enums import TA_LEFT

# ---- Green palette (matches the app's CSS tokens) --------------------------
G900 = colors.HexColor('#081c15')
G800 = colors.HexColor('#1b4332')
G700 = colors.HexColor('#2d6a4f')
G600 = colors.HexColor('#40916c')
G500 = colors.HexColor('#52b788')
G200 = colors.HexColor('#b7e4c7')
G100 = colors.HexColor('#d8f3dc')
G050 = colors.HexColor('#f1f8f4')
INK = colors.HexColor('#10241c')
MUTED = colors.HexColor('#5b7167')
CODEBG = colors.HexColor('#0f2a20')

styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, parent=styles['Normal'], **kw)

body = S('Body', fontName='Helvetica', fontSize=10.5, leading=15.5,
         textColor=INK, spaceAfter=8)
h1 = S('H1', fontName='Helvetica-Bold', fontSize=19, leading=23,
       textColor=G800, spaceBefore=6, spaceAfter=4)
h2 = S('H2', fontName='Helvetica-Bold', fontSize=13.5, leading=18,
       textColor=G700, spaceBefore=14, spaceAfter=4)
eyebrow = S('Eyebrow', fontName='Helvetica-Bold', fontSize=8.5, leading=11,
            textColor=G500, spaceAfter=2)
code = S('Code', fontName='Courier', fontSize=8.3, leading=12,
         textColor=colors.HexColor('#eaf5ef'))
small = S('Small', fontName='Helvetica', fontSize=8.5, leading=12, textColor=MUTED)
cell = S('Cell', fontName='Helvetica', fontSize=9, leading=12.5, textColor=INK)
cellb = S('CellB', fontName='Helvetica-Bold', fontSize=9, leading=12.5, textColor=G800)
white_big = S('WhiteBig', fontName='Helvetica-Bold', fontSize=30, leading=34,
              textColor=colors.white)
white_sub = S('WhiteSub', fontName='Helvetica', fontSize=12, leading=17,
              textColor=G100)


def code_block(text):
    """A dark rounded code panel."""
    p = Preformatted(text, code)
    t = Table([[p]], colWidths=[165 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODEBG),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('ROUNDEDCORNERS', [5, 5, 5, 5]),
    ]))
    return t


def rule():
    return HRFlowable(width='100%', thickness=1.2, color=G200,
                      spaceBefore=2, spaceAfter=10)


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(x, body), leftIndent=6, value='•') for x in items],
        bulletType='bullet', bulletColor=G600, bulletFontSize=8,
        leftIndent=12, spaceAfter=6,
    )


# ---- Page furniture --------------------------------------------------------
def header_footer(canvas, doc):
    canvas.saveState()
    # top accent line
    canvas.setStrokeColor(G500)
    canvas.setLineWidth(2)
    canvas.line(20 * mm, 285 * mm, 190 * mm, 285 * mm)
    canvas.setFont('Helvetica-Bold', 8)
    canvas.setFillColor(G600)
    canvas.drawString(20 * mm, 287 * mm, 'VERDANT')
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(190 * mm, 287 * mm, 'E-Commerce Product Listing · Technical Documentation')
    # footer
    canvas.setStrokeColor(G200)
    canvas.setLineWidth(0.8)
    canvas.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 10 * mm, 'Built with React · Redux Toolkit · React Query · TanStack Table')
    canvas.drawRightString(190 * mm, 10 * mm, f'Page {doc.page}')
    canvas.restoreState()


def cover(canvas, doc):
    canvas.saveState()
    # full green band across the top ~57% of the page
    canvas.setFillColor(G800)
    canvas.rect(0, 128 * mm, 210 * mm, 169 * mm, fill=1, stroke=0)
    canvas.setFillColor(G600)
    canvas.rect(0, 128 * mm, 210 * mm, 8 * mm, fill=1, stroke=0)

    # logo mark
    canvas.setFillColor(colors.white)
    canvas.roundRect(20 * mm, 250 * mm, 16 * mm, 16 * mm, 4 * mm, fill=1, stroke=0)
    canvas.setFillColor(G700)
    canvas.setFont('Helvetica-Bold', 20)
    canvas.drawCentredString(28 * mm, 254.5 * mm, 'V')

    # eyebrow
    canvas.setFillColor(G200)
    canvas.setFont('Helvetica-Bold', 9)
    canvas.drawString(20 * mm, 224 * mm, 'TECHNICAL DOCUMENTATION')

    # title
    canvas.setFillColor(colors.white)
    canvas.setFont('Helvetica-Bold', 40)
    canvas.drawString(20 * mm, 204 * mm, 'Verdant')

    # subtitle (wrapped manually, light green on band)
    canvas.setFillColor(G100)
    canvas.setFont('Helvetica', 13)
    canvas.drawString(20 * mm, 192 * mm, 'A responsive e-commerce product listing page — built with')
    canvas.drawString(20 * mm, 184.5 * mm, 'Redux, React Query, TanStack Table and pure CSS.')

    # stack chips
    chips = ['React', 'Redux Toolkit', 'React Query', 'TanStack Table', 'Pure CSS']
    x = 20 * mm
    canvas.setFont('Helvetica-Bold', 8.5)
    for c in chips:
        w = canvas.stringWidth(c, 'Helvetica-Bold', 8.5) + 12
        canvas.setFillColor(G700)
        canvas.roundRect(x, 168 * mm, w, 7 * mm, 3 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.drawString(x + 6, 170 * mm, c)
        x += w + 6

    # intro note below the band (dark ink on white)
    canvas.setFillColor(INK)
    canvas.setFont('Helvetica', 10.5)
    lines = [
        'This document explains every library, custom hook and architectural',
        'decision in the app, and maps each requirement and evaluation criterion',
        'from the brief to exactly where it is met in code.',
    ]
    y = 112 * mm
    for ln in lines:
        canvas.drawString(20 * mm, y, ln)
        y -= 6.5 * mm
    canvas.restoreState()


# ---- Document assembly -----------------------------------------------------
def build():
    doc = BaseDocTemplate(
        '/home/claude/ecommerce-green/DOCUMENTATION.pdf',
        pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=22 * mm, bottomMargin=20 * mm,
        title='Technical Documentation', author='Frontend Build',
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin,
                  doc.width, doc.height, id='main')
    cover_frame = Frame(20 * mm, 20 * mm, 170 * mm, 145 * mm, id='cover')
    doc.addPageTemplates([
        PageTemplate(id='cover', frames=[cover_frame], onPage=cover),
        PageTemplate(id='main', frames=[frame], onPage=header_footer),
    ])

    story = []

    # ---------------- COVER (all text drawn on canvas in cover()) ----------
    story.append(NextPageTemplate('main'))
    story.append(Spacer(1, 1 * mm))
    story.append(PageBreak())

    # ---------------- 1. OVERVIEW ----------------
    story.append(Paragraph('01 — OVERVIEW', eyebrow))
    story.append(Paragraph('What this app is', h1))
    story.append(rule())
    story.append(Paragraph(
        'E-Commerce Listing is a product-listing page for an e-commerce store. It fetches a '
        'catalogue from a mock API, caches it, and lets the user search, filter by '
        'category and rating, sort by price or rating, favorite products, and scroll '
        'through results infinitely. The whole UI is themed from a single green '
        'palette and adapts from wide desktop grids down to a single mobile column.', body))
    story.append(Paragraph(
        'The guiding idea is a clean separation of three kinds of state, each handled '
        'by the tool best suited to it:', body))
    story.append(bullets([
        '<b>Server state</b> (the product catalogue) → <b>React Query</b>, which caches '
        'the response so filtering and sorting never trigger new network calls.',
        '<b>Client / UI state</b> (search text, active filters, sort order, favorites) '
        '→ <b>Redux Toolkit</b>, a single predictable source of truth.',
        '<b>Derived view state</b> (the filtered + sorted rows) → <b>TanStack Table</b> '
        'used headlessly to compute rows that are rendered as cards.',
    ]))

    # ---------------- 2. ARCHITECTURE ----------------
    story.append(Paragraph('02 — ARCHITECTURE', eyebrow))
    story.append(Paragraph('How the pieces fit together', h1))
    story.append(rule())
    story.append(Paragraph('Data flow', h2))
    story.append(Paragraph(
        'The user interacts with the sticky Toolbar and the favorite buttons. Those '
        'actions update Redux. The ProductListing feature reads the cached catalogue '
        'from React Query and the current filters from Redux, feeds both into a headless '
        'TanStack Table, and renders the resulting rows through an infinite-scroll '
        'window.', body))
    story.append(code_block(
        "User action (type / filter / favorite)\n"
        "        |\n"
        "        v\n"
        "   Redux store  <----------------.\n"
        "  (filters, favorites)           |  persisted to\n"
        "        |                        |  localStorage\n"
        "        v                        |\n"
        "  ProductListing feature         |\n"
        "        |  data from React Query (cached mock API)\n"
        "        v\n"
        "  TanStack Table (headless: filter + sort)\n"
        "        |\n"
        "        v\n"
        "  useInfiniteScroll  ->  ProductGrid  ->  ProductCard(s)"))

    story.append(Paragraph('Why TanStack Table for a card grid?', h2))
    story.append(Paragraph(
        'TanStack Table is headless — it computes filtered, sorted (and if wanted, '
        'paginated) row models without rendering any markup. We hand it the catalogue '
        'plus the Redux-derived filter and sort state, take the processed rows it '
        'returns, and render them as cards in a CSS grid. This gives robust, composable '
        'filtering/sorting logic instead of ad-hoc array code, while keeping full '
        'control over presentation.', body))

    # ---------------- 3. LIBRARIES ----------------
    story.append(PageBreak())
    story.append(Paragraph('03 — LIBRARIES', eyebrow))
    story.append(Paragraph('Libraries used and why', h1))
    story.append(rule())

    lib_rows = [
        [Paragraph('Library', cellb), Paragraph('Role in this app', cellb), Paragraph('Why chosen', cellb)],
        [Paragraph('React 18 + Vite', cell),
         Paragraph('UI rendering & dev tooling', cell),
         Paragraph('Component model + instant HMR and fast builds.', cell)],
        [Paragraph('Redux Toolkit', cell),
         Paragraph('Client/UI state: filters + favorites', cell),
         Paragraph('Predictable single source of truth; slices cut boilerplate; Immer allows safe "mutations".', cell)],
        [Paragraph('react-redux', cell),
         Paragraph('Binds React components to the store', cell),
         Paragraph('useSelector / useDispatch hooks with render optimization.', cell)],
        [Paragraph('TanStack React Query', cell),
         Paragraph('Server state & caching for the mock API', cell),
         Paragraph('Caching, dedupe, background refetch, loading/error/retry handled for us.', cell)],
        [Paragraph('TanStack React Table', cell),
         Paragraph('Headless filter + sort of products', cell),
         Paragraph('Battle-tested row models; decoupled from rendering so we keep the card grid.', cell)],
    ]
    lt = Table(lib_rows, colWidths=[34 * mm, 60 * mm, 71 * mm])
    lt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), G100),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, G050]),
        ('GRID', (0, 0), (-1, -1), 0.6, G200),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(lt)

    # ---------------- 4. HOOKS ----------------
    story.append(Paragraph('04 — REUSABLE HOOKS', eyebrow))
    story.append(Paragraph('Custom hooks', h1))
    story.append(rule())
    story.append(Paragraph(
        'Cross-cutting logic is extracted into small, reusable hooks so components '
        'stay declarative and the behaviours can be reused anywhere.', body))

    hook_rows = [
        [Paragraph('Hook', cellb), Paragraph('Purpose', cellb)],
        [Paragraph('useDebounce(value, delay)', cell),
         Paragraph('Delays a value until typing pauses. Powers the search box so the '
                   'grid recomputes once the user stops, not on every keystroke.', cell)],
        [Paragraph('useThrottle(fn, limit)', cell),
         Paragraph('Runs a callback at most once per interval. Powers the infinite-scroll '
                   'listener so the near-bottom check fires a few times/second, not per event.', cell)],
        [Paragraph('useProducts()', cell),
         Paragraph('Wraps React Query useQuery for the products endpoint with sensible '
                   'staleTime / gcTime / retry, and exposes loading & error state.', cell)],
        [Paragraph('useInfiniteScroll(total, opts)', cell),
         Paragraph('Grows a visible-count as you scroll (throttled + IntersectionObserver '
                   'backup) and resets to page one when filters change.', cell)],
        [Paragraph('useLocalStorage(key, init)', cell),
         Paragraph('useState mirrored to localStorage. Persists the color theme so the '
                   'palette choice survives reloads.', cell)],
    ]
    ht = Table(hook_rows, colWidths=[52 * mm, 113 * mm])
    ht.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), G100),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, G050]),
        ('GRID', (0, 0), (-1, -1), 0.6, G200),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 1), (0, -1), 'Courier'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(ht)

    # ---------------- 5. STATE MANAGEMENT ----------------
    story.append(PageBreak())
    story.append(Paragraph('05 — STATE MANAGEMENT', eyebrow))
    story.append(Paragraph('Redux slices & the debounce → Redux → table pipeline', h1))
    story.append(rule())
    story.append(Paragraph('Two slices', h2))
    story.append(bullets([
        '<b>filtersSlice</b> — search, category, minRating, sort, favoritesOnly. The '
        'single source of truth for every toolbar control.',
        '<b>favoritesSlice</b> — the array of favorited product ids, initialised from '
        'localStorage and persisted on every change via a store subscription.',
    ]))
    story.append(Paragraph('Search pipeline', h2))
    story.append(code_block(
        "Toolbar: local input value (instant)\n"
        "   -> useDebounce(value, 350ms)\n"
        "   -> dispatch(setSearch(debounced))   // Redux\n"
        "   -> ProductListing reads filters.search\n"
        "   -> TanStack Table globalFilter recomputes rows"))
    story.append(Paragraph(
        'Because the debounced value is what reaches Redux, the expensive filter/sort '
        'pass runs only when the user pauses — keystrokes stay smooth even with a large '
        'catalogue.', body))

    # ---------------- 6. PERFORMANCE ----------------
    story.append(Paragraph('06 — PERFORMANCE', eyebrow))
    story.append(Paragraph('Optimizations', h1))
    story.append(rule())
    story.append(bullets([
        '<b>Lazy-loaded images</b> — LazyImage uses native loading="lazy" and '
        'decoding="async" with a shimmer skeleton, so off-screen product images aren\'t '
        'fetched until needed.',
        '<b>Query caching</b> — React Query caches the catalogue (staleTime 5 min), so '
        'filtering, sorting and remounts never re-hit the network.',
        '<b>Debounced search</b> — filtering runs on pause, not per keystroke.',
        '<b>Throttled scroll</b> — the infinite-scroll check runs at most ~5×/second.',
        '<b>Memoized cards</b> — ProductCard is wrapped in React.memo and derived lists '
        'use useMemo, so toggling one favorite doesn\'t re-render the whole grid.',
        '<b>Windowed rendering</b> — infinite scroll renders only a growing slice of the '
        'result set rather than all rows at once.',
    ]))

    # ---------------- 7. REQUIREMENTS MAP ----------------
    story.append(PageBreak())
    story.append(Paragraph('07 — REQUIREMENTS COVERAGE', eyebrow))
    story.append(Paragraph('Brief → implementation', h1))
    story.append(rule())

    req_rows = [
        [Paragraph('Requirement', cellb), Paragraph('Where it lives', cellb)],
        [Paragraph('Products with image, name, price, category, rating', cell),
         Paragraph('data/products.js, ProductCard.jsx', cell)],
        [Paragraph('Filter by category and rating', cell),
         Paragraph('Toolbar.jsx + filtersSlice → TanStack column filters', cell)],
        [Paragraph('Sort by price (asc/desc)', cell),
         Paragraph('Toolbar sort control → TanStack sorting state', cell)],
        [Paragraph('Add to favorites + visual highlight', cell),
         Paragraph('favoritesSlice, ProductCard (card--fav class)', cell)],
        [Paragraph('Responsive grid layout', cell),
         Paragraph('global.css .grid (auto-fill) + media queries', cell)],
        [Paragraph('Sticky filter/sort bar', cell),
         Paragraph('global.css .toolbar (position: sticky)', cell)],
        [Paragraph('Fetch from mock API / JSON', cell),
         Paragraph('api/mockApi.js (+ React Query)', cell)],
        [Paragraph('State management for filters & favorites', cell),
         Paragraph('Redux Toolkit store (two slices)', cell)],
        [Paragraph('Challenge: pagination / infinite scroll', cell),
         Paragraph('useInfiniteScroll.js (throttled + observer)', cell)],
        [Paragraph('Challenge: persist favorites (localStorage)', cell),
         Paragraph('store/index.js subscription', cell)],
    ]
    rt = Table(req_rows, colWidths=[95 * mm, 70 * mm])
    rt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), G100),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, G050]),
        ('GRID', (0, 0), (-1, -1), 0.6, G200),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (1, 1), (1, -1), 'Courier'),
        ('FONTSIZE', (1, 1), (1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(rt)

    story.append(Paragraph('Evaluation criteria', h2))
    story.append(bullets([
        '<b>Performance optimization</b> — lazy images, query caching, debounce, '
        'throttle, memoization (section 06).',
        '<b>State management & modularity</b> — server/client/derived state cleanly '
        'split across React Query, Redux and TanStack Table; reusable hooks; small '
        'presentational vs. container components.',
        '<b>Usability & design</b> — consistent green theme from CSS tokens, sticky '
        'controls, skeletons, empty/error states, keyboard-focusable controls, '
        'reduced-motion support, responsive down to mobile.',
    ]))

    # ---------------- 8. RUN + STRUCTURE ----------------
    story.append(Paragraph('08 — GETTING STARTED', eyebrow))
    story.append(Paragraph('Run it & file structure', h1))
    story.append(rule())
    story.append(code_block(
        "npm install\n"
        "npm run dev       # http://localhost:5173\n"
        "npm run build     # production build\n"
        "npm run preview   # preview the build"))
    story.append(Spacer(1, 4))
    story.append(code_block(
        "src/\n"
        "  api/mockApi.js            mock endpoint (simulated latency)\n"
        "  data/products.js          seed catalogue\n"
        "  store/                    Redux: store + filters + favorites slices\n"
        "  hooks/                    useDebounce, useThrottle, useProducts,\n"
        "                            useInfiniteScroll, useLocalStorage\n"
        "  components/               Toolbar, ProductGrid, ProductCard,\n"
        "                            LazyImage, StarRating\n"
        "  features/ProductListing   React Query + Redux + TanStack Table\n"
        "  styles/                   variables.css (tokens) + global.css\n"
        "  App.jsx, main.jsx         shell + providers"))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'Product images are served from picsum.photos and lazy-load as you scroll, so '
        'an internet connection is needed to see them.', small))

    doc.build(story)
    print('DOCUMENTATION.pdf built')


if __name__ == '__main__':
    build()
