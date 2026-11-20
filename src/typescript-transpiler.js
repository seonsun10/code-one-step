import ts from 'typescript';

const MAX_TYPESCRIPT_CHARS = 20_000;
const MAX_DIAGNOSTIC_CHARS = 500;

export function transpileTypeScript(source) {
  const text = String(source ?? '');
  if (text.length > MAX_TYPESCRIPT_CHARS) {
    return { ok: false, error: '코드가 20,000자를 넘었습니다.' };
  }

  const result = ts.transpileModule(text, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      noEmitOnError: true,
      removeComments: true,
    },
  });
  const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    const messages = errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    return { ok: false, error: messages.join('\n').slice(0, MAX_DIAGNOSTIC_CHARS) };
  }
  if (!result.outputText.trim()) return { ok: false, error: '실행할 TypeScript 코드가 없습니다.' };
  return { ok: true, code: result.outputText };
}
