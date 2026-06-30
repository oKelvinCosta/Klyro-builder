/**
 * Custom helper field that explains how to embed iframes in the HTML block.
 */
export function HtmlIframeInstructionsField() {
  return {
    label: 'Iframe Instructions',
    type: 'custom' as const,
    render: () => {
      return (
        <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground rounded-md border border-dashed p-3 leading-5">
          <p className="text-foreground !text-xs font-semibold">Altura dinâmica Iframe</p>
          <p className="!text-xs">
            Adicione <code className="bg-space-800 px-1 text-red-400">data-iframe-id="quiz-1"</code>{' '}
            em seu iframe e envie o código de
            <code> postMessage </code>
            com o mesmo <code>iframeId</code> e a altura será sincronizada.
          </p>
          <p className="text-foreground !text-xs font-semibold">Youtube</p>
          <p className="!text-xs">O Klyro trata o iframe do video e o deixa proporcional 16/9.</p>
        </div>
      );
    },
  };
}
