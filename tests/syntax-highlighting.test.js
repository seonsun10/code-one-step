import assert from 'node:assert/strict';
import test from 'node:test';
import { codeLanguageId, highlightCode } from '../src/syntax-highlight.js';

test('JavaScript declarations, built-ins, functions, values, and templates get distinct syntax colors', () => {
  const html = highlightCode("const course = 'JavaScript';\nconsole.log(`Hello ${course}`);", 'JavaScript');
  assert.match(html, /syntax-keyword">const/);
  assert.match(html, /syntax-declaration">course/);
  assert.match(html, /syntax-string">&#39;JavaScript&#39;/);
  assert.match(html, /syntax-builtin">console/);
  assert.match(html, /syntax-function">log/);
  assert.match(html, /syntax-template">`Hello \$\{course\}`/);
});

test('Python and Java comments and language-specific syntax are highlighted', () => {
  const python = highlightCode('def total(score):\n    return score + 1  # add one', 'Python');
  const java = highlightCode('public class Course {\n  private final int lessons = 12;\n}', 'Java');
  assert.match(python, /syntax-keyword">def/);
  assert.match(python, /syntax-declaration">total/);
  assert.match(python, /syntax-comment"># add one/);
  assert.match(java, /syntax-keyword">public/);
  assert.match(java, /syntax-declaration">Course/);
  assert.match(java, /syntax-number">12/);
});

test('Kotlin declarations, types, null-safety operators, and Android snippets are highlighted', () => {
  const html = highlightCode('data class Course(val title: String?)\nsuspend fun load() = title?.length ?: 0', 'Kotlin · Android');
  assert.match(html, /syntax-keyword">data/);
  assert.match(html, /syntax-declaration">Course/);
  assert.match(html, /syntax-keyword">val/);
  assert.match(html, /syntax-type">String/);
  assert.match(html, /syntax-keyword">suspend/);
  assert.match(html, /syntax-keyword">fun/);
  assert.match(html, /syntax-operator">\?\./);
  assert.match(html, /syntax-operator">\?:/);
  assert.equal(codeLanguageId('Kotlin · Android'), 'kotlin');
});

test('C# declarations, common types, .NET calls, and null-conditional operators are highlighted', () => {
  const html = highlightCode('public record Lesson(string Title);\ncustomer?.Order = currentOrder;', 'C# · .NET');
  assert.match(html, /syntax-keyword">public/);
  assert.match(html, /syntax-keyword">record/);
  assert.match(html, /syntax-declaration">Lesson/);
  assert.match(html, /syntax-keyword">string/);
  assert.match(html, /syntax-operator">\?\./);
  assert.equal(codeLanguageId('C# · .NET'), 'csharp');
});

test('SQL keywords, functions, identifiers, values, and comments receive distinct styles', () => {
  const html = highlightCode("SELECT learner_id, SUM(points) AS total FROM attempts WHERE active = TRUE LIMIT 10 -- keep active rows", 'SQL · PostgreSQL');
  assert.match(html, /syntax-keyword">SELECT/);
  assert.match(html, /syntax-builtin">SUM/);
  assert.match(html, /syntax-variable">learner_id/);
  assert.match(html, /syntax-number/);
  assert.match(html, /syntax-comment">-- keep active rows/);
  assert.equal(codeLanguageId('SQL · PostgreSQL'), 'sql');
});

test('block comments and strings escape markup instead of rendering learner code as HTML', () => {
  const html = highlightCode("const note = '<img src=x onerror=alert(1)>'; /* note */", 'React');
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /syntax-comment">\/\* note \*\//);
  assert.doesNotMatch(html, /<img\b/);
});

test('track names map to known languages and unknown labels remain safely escaped', () => {
  assert.equal(codeLanguageId('Spring Boot'), 'java');
  assert.equal(codeLanguageId('React'), 'javascript');
  assert.equal(codeLanguageId('Next.js'), 'javascript');
  assert.equal(codeLanguageId('C#'), 'csharp');
  assert.equal(codeLanguageId('custom <language>'), 'plain');
  assert.equal(highlightCode('<script>alert(1)</script>', 'custom <language>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});
