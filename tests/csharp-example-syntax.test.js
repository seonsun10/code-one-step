import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tracks } from '../src/content.js';

test('C# examples place top-level statements before type declarations', (t) => {
  let sdkList;
  try {
    sdkList = execFileSync('dotnet', ['--list-sdks'], { encoding: 'utf8', timeout: 10000 });
  } catch {
    t.skip('.NET 10 SDK is not available');
    return;
  }
  const sdk = [...sdkList.matchAll(/^(10\.[^\s]+) \[(.+)\]\s*$/gm)].at(-1);
  if (!sdk) {
    t.skip('.NET 10 SDK is not available');
    return;
  }

  const tempRoot = resolve('.tmp');
  mkdirSync(tempRoot, { recursive: true });
  const tempDir = mkdtempSync(join(tempRoot, 'csharp-example-syntax-'));
  const xmlPath = (file) => join(sdk[2], sdk[1], 'Roslyn', 'bincore', file)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  try {
    writeFileSync(join(tempDir, 'Check.csproj'), `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings></PropertyGroup>
  <ItemGroup>
    <Reference Include="Microsoft.CodeAnalysis"><HintPath>${xmlPath('Microsoft.CodeAnalysis.dll')}</HintPath></Reference>
    <Reference Include="Microsoft.CodeAnalysis.CSharp"><HintPath>${xmlPath('Microsoft.CodeAnalysis.CSharp.dll')}</HintPath></Reference>
  </ItemGroup>
</Project>`);
    writeFileSync(join(tempDir, 'NuGet.Config'), '<configuration><packageSources><clear /></packageSources></configuration>');
    writeFileSync(join(tempDir, 'Program.cs'), `using System.Text.Json;
using Microsoft.CodeAnalysis.CSharp;
var examples = JsonSerializer.Deserialize<Dictionary<string, string>>(File.ReadAllText(args[0]))!;
var failures = new List<string>();
foreach (var entry in examples) {
    var tree = CSharpSyntaxTree.ParseText(entry.Value, new CSharpParseOptions(LanguageVersion.CSharp14));
    if (tree.GetDiagnostics().Any(diagnostic => diagnostic.Id == "CS8803")) failures.Add(entry.Key);
}
File.WriteAllText(args[1], JsonSerializer.Serialize(failures));`);
    const course = tracks.find((track) => track.id === 'csharp');
    const examples = Object.fromEntries(course.lessons.flatMap((lesson) => lesson.studyDays.map((day) => [`${lesson.id}-day-${day.number}`, day.example])));
    assert.equal(Object.keys(examples).length, 175);
    const input = join(tempDir, 'examples.json');
    const output = join(tempDir, 'failures.json');
    writeFileSync(input, JSON.stringify(examples));
    execFileSync('dotnet', ['build', 'Check.csproj', '--nologo'], { cwd: tempDir, encoding: 'utf8', timeout: 60000 });
    execFileSync('dotnet', [join(tempDir, 'bin', 'Debug', 'net10.0', 'Check.dll'), input, output], { cwd: tempDir, encoding: 'utf8', timeout: 60000 });
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), []);
  } finally {
    if (dirname(resolve(tempDir)) === tempRoot) rmSync(tempDir, { recursive: true, force: true });
  }
});
