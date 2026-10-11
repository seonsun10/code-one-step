import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../src/grading.js';
import { tracks } from '../src/content.js';

const exerciseById = (id) => tracks
  .flatMap((track) => track.lessons)
  .map((lesson) => lesson.exercise)
  .find((exercise) => exercise?.id === id);

test('choice and short answers are graded without accepting an empty answer', () => {
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, 'b'), true);
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, ''), false);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, '  SUM(scores) / len(scores) '), true);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, ''), false);
  const pythonExpression = { type: 'short-answer', answerNormalization: 'python-expression', acceptedAnswers: ['sum(scores) / len(scores)'] };
  assert.equal(gradeAnswer(pythonExpression, 'sum( scores )/len( scores )'), true);
  assert.equal(gradeAnswer(pythonExpression, 'SUM(scores) / len(scores)'), false);
});

test('error-location and code-repair grading check exact expected changes', () => {
  const locate = { type: 'locate-error', answerLines: [2] };
  assert.equal(gradeAnswer(locate, [2]), true);
  assert.equal(gradeAnswer(locate, [1, 2]), false);
  assert.equal(gradeAnswer({ type: 'repair-code', requiredFragments: ['return true;'] }, 'return true;'), false);
  const repair = {
    type: 'repair-code',
    solutionPatterns: [String.raw`^setProfile\(\{[ \t]*\.\.\.profile,[ \t]*name:[ \t]*nextName[ \t]*\}[ \t]*\);?$`],
  };
  assert.equal(gradeAnswer(repair, ''), false);
  assert.equal(gradeAnswer(repair, 'setProfile({ ...profile, name: nextName });'), true);
  assert.equal(gradeAnswer(repair, 'setProfile({...profile,name:nextName});'), true);
  assert.equal(gradeAnswer(repair, 'profile.name = nextName; setProfile(profile);'), false);
});

test('repair grading ignores formatting and accepts the documented Java operand order', () => {
  const javaRepair = exerciseById('java-method-repair');
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) { return right+left; }'), true);
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) {\n  return left\n    + right;\n}'), true);
  assert.equal(gradeAnswer(javaRepair, 'static int add(int left, int right) { return left-right; }'), false);

  const functionRepair = exerciseById('js-function-repair');
  assert.equal(gradeAnswer(functionRepair, 'function double(value) { return value*2; }'), true);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n return value\n  * 2;\n}'), true);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n return\n  value * 2;\n}'), false);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) { value*2; }'), false);
  assert.equal(gradeAnswer(functionRepair, 'function double(value) {\n  // This comment does not change the return path.\n  return value * 2;\n}'), true);
});

test('repair grading ignores comments and strings when checking required code', () => {
  const cases = [
    ['js-function-repair', 'function double(value) { // return value * 2;\n}'],
    ['py-function-repair', 'def double(value):\n    # return value * 2'],
    ['java-method-repair', 'static int add(int left, int right) { // return left + right;\n}'],
    ['react-state-repair', 'function rename(nextName) { // setProfile({ ...profile, name: nextName })\n}'],
  ];

  for (const [id, response] of cases) {
    assert.equal(gradeAnswer(exerciseById(id), response), false, `${id} should not accept a comment as code`);
  }

  assert.equal(gradeAnswer(exerciseById('js-function-repair'), 'function double(value) { const note = "return value * 2;"; }'), false);
  assert.equal(gradeAnswer(exerciseById('py-function-repair'), 'def double(value):\n    """return value * 2"""'), false);
  assert.equal(gradeAnswer(exerciseById('java-method-repair'), 'static int add(int left, int right) { String note = """\nreturn left + right;\n"""; }'), false);
});

test('Python double function accepts either multiplication operand order', () => {
  const repair = exerciseById('py-function-repair');
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return 2 * value'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    # Return the computed value.\n    return value * 2'), true);
  assert.equal(gradeAnswer(repair, 'def double(value):\n    return (\n        value\n        * 2\n    )'), true);
});

test('JavaScript repair rejects the original expression when it remains as a duplicate statement', () => {
  const repair = exerciseById('js-function-repair');
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; value * 2; }'), false);
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; value * 2 }'), false);
  assert.equal(gradeAnswer(repair, 'function double(value) { return value * 2; }'), true);
});

test('repair solution patterns reject matching text outside the required active function body', () => {
  const incorrectSolutions = [
    ['js-function-repair', 'function double(value) { const matcher = /return value * 2;/; }'],
    ['js-function-repair', 'function double(value) { re"turn" value * 2; }'],
    ['js-function-repair', 'function double(value) { if (false) return value * 2; }'],
    ['js-function-repair', 'function double(value) { return value * 2; value\n*\n2; }'],
    ['js-function-repair', 'function double(value) { return value * 2; (value * 2); }'],
    ['py-function-repair', 'def double(value):\nreturn value * 2'],
    ['py-function-repair', 'def double(value):\n    if False:\n        return value * 2'],
    ['java-method-repair', 'static int add(int left, int right) { if (false) return left + right; return 0; }'],
    ['react-state-repair', 'function rename(nextName) { if (false) setProfile({ ...profile, name: nextName }); }'],
  ];

  for (const [id, response] of incorrectSolutions) {
    assert.equal(gradeAnswer(exerciseById(id), response), false, `${id} should reject a non-solution containing the required text`);
  }

  assert.equal(gradeAnswer(exerciseById('react-state-repair'), 'function rename(nextName) {\n setProfile({\n  ...profile,\n  name: nextName\n });\n}'), true);
});

test('coding exercise is correct only after every test passes', () => {
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: true }), true);
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: false }), false);
});
