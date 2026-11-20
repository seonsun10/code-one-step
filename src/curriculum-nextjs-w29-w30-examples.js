// W29–W30 예제예요. 이 학습 사이트는 Next.js 서버나 데이터베이스를 실행하지 않아요.
export const reviewedReliabilityExamples = {
  29: [
    String.raw`import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  await reportSafeError({
    digest: error.digest,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};

// 필요한 안전한 값만 기록하고 쿠키·인증 헤더·요청 본문은 남기지 않아요.`,
    String.raw`const retryableStatuses = new Set([502, 503, 504]);

async function readCourse(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) return response.json();
    if (!retryableStatuses.has(response.status) || attempt === 2) {
      throw new Error("강의 정보를 불러오지 못했어요.");
    }
    await new Promise((resolve) => setTimeout(resolve, 200 * 2 ** attempt));
  }
  throw new Error("다시 시도할 수 있는 횟수를 넘었어요.");
}

// 이 제한된 재시도는 여러 번 요청해도 안전한 조회에 쓰고, 임의의 저장 작업에는 쓰지 않아요.`,
    String.raw`"use client";
import { useEffect, useState } from "react";

function isCourseList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((course) => typeof course === "string");
}

export function CourseSearch({ query }: { query: string }) {
  type SearchState = {
    status: "loading" | "success" | "error";
    courses: string[];
    message?: string;
  };
  const [result, setResult] = useState<{ query: string; state: SearchState } | null>(null);
  const state = result?.query === query
    ? result.state
    : { status: "loading" as const, courses: [] };

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    void fetch("/api/courses?q=" + encodeURIComponent(query), {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("검색에 실패했어요.");
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (!isCourseList(value)) throw new Error("검색 결과 형식이 올바르지 않아요.");
        return value;
      })
      .then((courses) => {
        if (current) setResult({ query, state: { status: "success", courses } });
      })
      .catch(() => {
        if (current && !controller.signal.aborted) {
          setResult({ query, state: { status: "error", courses: [], message: "검색에 실패했어요." } });
        }
      });

    return () => {
      current = false;
      controller.abort();
    };
  }, [query]);

  return <CourseResults state={state} />;
}`,
    String.raw`"use client";

export default function CourseError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section aria-labelledby="course-error-title">
      <h2 id="course-error-title">강의를 불러오지 못했어요.</h2>
      <p>잠시 후 다시 시도해 주세요.</p>
      {error.digest && <p>문의 코드: {error.digest}</p>}
      <button type="button" onClick={() => retry()}>다시 시도</button>
    </section>
  );
}

// 입력 검증 실패는 이 오류 화면이 아니라 폼 상태로 돌려줘요.`,
    String.raw`// output: "export"는 정적 파일을 만들며 요청을 처리할 서버는 제공하지 않아요.
export const deploymentCapabilities = {
  prebuiltPages: true,
  browserLocalProgress: true,
  requestTimeNodeHandlers: false,
  serverActions: false,
} as const;

// 실제 배포 환경에서 동작하는 복구 방법만 안내해요.`,
  ],
  30: [
    String.raw`import "server-only";

export async function getCourseForViewer(courseId: string) {
  const session = await verifySession();
  const row = await courseRepository.findOwnedBy({
    courseId,
    ownerId: session.userId,
  });
  if (!row) return null;

  return { id: row.id, title: row.title, updatedAt: row.updatedAt };
}

// 권한 확인은 저장소 가까이에서 하고 화면에 필요한 값만 돌려줘요.`,
    String.raw`const transactionSql = [
  "BEGIN;",
  "UPDATE course_progress SET completed = true WHERE course_id = $1 AND user_id = $2;",
  "INSERT INTO progress_audit (course_id, user_id, action) VALUES ($1, $2, 'completed');",
  "COMMIT;",
].join("\n");

// 둘 중 하나라도 실패하면 COMMIT 대신 ROLLBACK을 실행해요.
// 학습 사이트는 이 SQL을 보여 주기만 하고 실행하지 않아요.`,
    String.raw`const migrationSql = [
  "-- 먼저 기존 행이 NULL이어도 되는 새 열을 추가해요.",
  "ALTER TABLE course_progress ADD COLUMN progress_version integer;",
  "-- 이전 행을 읽고 새 열도 기록할 수 있는 코드를 배포해요.",
  "-- 나눠서 기존 행을 채운 뒤 빠진 값이 없는지 확인해요.",
  "SELECT count(*) FROM course_progress WHERE progress_version IS NULL;",
  "-- 이전 코드가 종료되고 기존 행을 모두 확인한 뒤 제약을 추가해요.",
  "ALTER TABLE course_progress ALTER COLUMN progress_version SET NOT NULL;",
].join("\n");`,
    String.raw`const updateSql = [
  "-- $3은 요청 본문이 아니라 서버에서 확인한 로그인 정보에서 가져와요.",
  "UPDATE courses SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING id;",
].join("\n");

// 반환 행이 없으면 이 사용자가 수정할 수 있는 자료가 없다는 뜻이에요.`,
    String.raw`const backup = {
  version: 1,
  progress: readProgressFromThisBrowser(),
};
const json = JSON.stringify(backup);
downloadAsFile("study-progress.json", json);

async function restoreProgress(file: File) {
  try {
    const value: unknown = JSON.parse(await file.text());
    const backup = validateProgressBackup(value); // 형식과 값을 검사한 뒤 저장해요.
    localStorage.setItem("study-progress", JSON.stringify(backup.progress));
    return { ok: true as const };
  } catch {
    return { ok: false as const, message: "백업 파일을 읽거나 저장하지 못했어요." };
  }
}

// 사용자가 직접 내보내고 가져올 때만 백업 파일로 기록을 옮겨요.`,
  ],
};
