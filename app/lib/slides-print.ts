/**
 * Framework-free helper that powers the slider viewer's Export PDF / Print /
 * New Tab actions. It builds a printable HTML document (one slide per page) and
 * opens it in a new window. Rebuilt from the prototype's `lessonExport.ts`
 * (behavioral reference only) with its OWN minimal input type so it has no
 * dependency on the lesson step model.
 */

/** A single printable slide. `imageUrl` is the picture to print; video slides
 *  pass their poster/cover here. When absent, a text placeholder is printed. */
export interface PrintableSlide {
  imageUrl?: string;
  title?: string;
}

/** Escape a string for safe interpolation into HTML text/attribute contexts. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build a full, self-contained HTML document from a list of slides: a header
 * with `title`, then one `page-break-after` block per slide (an `<h2>Slide N</h2>`,
 * the slide image when `imageUrl` is present else a `[No printable image]`
 * placeholder, and the optional slide title/caption). Landscape page size.
 * Every interpolated string is escaped — no raw injection.
 */
export function buildSlidesHtml(
  title: string,
  slides: readonly PrintableSlide[],
): string {
  const safeTitle = escapeHtml(title);

  const blocks = slides
    .map((slide, index) => {
      const slideNumber = index + 1;
      const media = slide.imageUrl
        ? `<img src="${escapeHtml(slide.imageUrl)}" alt="Slide ${slideNumber}" style="max-width:100%;max-height:70vh;border-radius:8px;object-fit:contain;" />`
        : `<p style="font-family:sans-serif;color:#999;font-style:italic;">[No printable image]</p>`;
      const caption = slide.title
        ? `<p style="font-family:sans-serif;color:#555;margin-top:12px;font-size:14px;">${escapeHtml(slide.title)}</p>`
        : "";
      return `
      <div style="page-break-after:always;margin-bottom:32px;text-align:center;">
        <h2 style="font-family:sans-serif;color:#333;margin-bottom:12px;">Slide ${slideNumber}</h2>
        ${media}
        ${caption}
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${safeTitle}</title>
<style>
  @page { size: landscape; margin: 12mm; }
  @media print {
    body { margin: 0; padding: 12px; max-width: none !important; }
    img { max-height: 80vh !important; max-width: 90vw !important; }
  }
</style>
</head>
<body style="max-width:1200px;margin:40px auto;padding:0 24px;font-family:sans-serif;">
  <h1 style="text-align:center;color:#1a1a1a;margin-bottom:8px;">${safeTitle}</h1>
  <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
  ${blocks}
</body></html>`;
}

/**
 * Wait for every `<img>` in the window to load (or error), then print. A cached
 * or zero-image doc prints immediately, and a hard fallback prints even if an
 * image never fires its load/error event. `win.print()` runs at most once.
 */
function triggerPrint(win: Window): void {
  const images = win.document.querySelectorAll("img");

  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    win.print();
  };

  if (images.length === 0) {
    fire();
    return;
  }

  let loaded = 0;
  const checkDone = () => {
    loaded += 1;
    // Small settle delay before the print dialog once all images resolve.
    if (loaded >= images.length) setTimeout(fire, 300);
  };

  images.forEach((img) => {
    if (img.complete) checkDone();
    else {
      img.addEventListener("load", checkDone);
      img.addEventListener("error", checkDone);
    }
  });

  // Fallback: if an image never resolves, print anyway rather than hang.
  setTimeout(fire, 3000);
}

/**
 * Open the built slides document in a new window. SSR-safe (no-op on the
 * server) and quietly bails if the popup is blocked. When `opts.print`, waits
 * for images before invoking the browser print dialog.
 */
export function openSlidesWindow(
  title: string,
  slides: readonly PrintableSlide[],
  opts: { print: boolean },
): void {
  if (typeof window === "undefined") return;

  const win = window.open("", "_blank");
  if (!win) return; // popup blocked

  win.document.write(buildSlidesHtml(title, slides));
  win.document.close();

  if (opts.print) triggerPrint(win);
}

/** Open the slides in a new window and trigger the browser print dialog. */
export function printSlides(
  title: string,
  slides: readonly PrintableSlide[],
): void {
  openSlidesWindow(title, slides, { print: true });
}

/** Export PDF ≡ Print — the browser "Save as PDF" path (no PDF library). */
export function exportSlidesPdf(
  title: string,
  slides: readonly PrintableSlide[],
): void {
  openSlidesWindow(title, slides, { print: true });
}

/** Open the standalone slides window without triggering a print dialog. */
export function openSlidesInNewTab(
  title: string,
  slides: readonly PrintableSlide[],
): void {
  openSlidesWindow(title, slides, { print: false });
}
