import type { RenderDocumentProps } from '@goldstack/template-ssr';

export const renderDocument = ({
  bundledJsPath,
  bundledCssPath,
  renderedHtml,
}: RenderDocumentProps): string => {
  const template = `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="${bundledCssPath}" media="screen" />
  </head>
  <body>
    <div id="root">${renderedHtml}</div>
    <script src="${bundledJsPath}"></script>
  </body>
</html>
  `;
  return template;
};
