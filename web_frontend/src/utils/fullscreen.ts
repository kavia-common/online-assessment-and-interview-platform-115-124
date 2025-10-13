export function enterFullscreen(el: Element): Promise<void> {
  // Attempt various vendor-prefixed methods
  const anyEl = el as any;
  const req: (() => Promise<void>) | undefined =
    anyEl.requestFullscreen ||
    anyEl.webkitRequestFullscreen ||
    anyEl.mozRequestFullScreen ||
    anyEl.msRequestFullscreen;

  if (req) return req.call(anyEl);
  return Promise.reject(new Error('Fullscreen not supported'));
}

export function exitFullscreen(): Promise<void> {
  const doc: any = document as any;
  const exit: (() => Promise<void>) | undefined =
    document.exitFullscreen ||
    doc.webkitExitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.msExitFullscreen;
  if (exit) return exit.call(document);
  return Promise.resolve();
}

export function isFullscreen(): boolean {
  const d: any = document as any;
  return !!(document.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement);
}
